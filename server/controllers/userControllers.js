import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import { nanoid } from "nanoid";
import userCollection from "../model/userModel.js";
import {
  createAccessToken,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} from "../utils/token.js";
import { isAuth } from "../utils/isAuth.js";

const { verify } = pkg;

export const register = async (req, res, next) => {
  try {
    const { name, email, password, joinedOn } = req.body;
    const emailCheck = await userCollection.findOne({ email });
    if (emailCheck) {
      return res.send({ msg: "email already used", status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userCollection.create({
      userId: nanoid(),
      name: name,
      email: email,
      password: hashedPassword,
      joinedOn: joinedOn,
    });
    return res.send({ status: true, msg: "account created successfully" });
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't create accound" });
  }
};

export const login = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = await userCollection.findOne({ name });
    if (!user) {
      return res.send({ msg: "Incorrect name", status: false });
    }
    const isPassworsValid = bcrypt.compare(password, user.password);
    if (!isPassworsValid) {
      return res.send({ msg: "Incorrect password", status: false });
    }
    const accessToken = createAccessToken(user.userId, user.role);
    const refreshToken = createRefreshToken(user.userId);
    await userCollection.findByIdAndUpdate(user._id, {
      refreshToken: refreshToken,
    });
    sendRefreshToken(res, refreshToken);
    sendAccessToken(req, res, accessToken);
    next();
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't login" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/auth/refresh_token" });
    return res.send({
      msg: "You are successfully Logout",
      status: true,
    });
  } catch (err) {
    return res.status(400).send({ msg: "Can't logout" });
  }
};

export const isUserAuth = async (req, res, next) => {
  try {
    const userId = isAuth(req);
    if (userId !== null) {
      next();
    } else {
      res.status(400).send({
        msg: "You aren't authorized to this page.",
      });
    }
  } catch (err) {
    return res.status(400).send({
      msg: "You aren't authorized to this page.",
    });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.send({ accessToken: null });
  }
  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return res.send({ accessToken: null });
  }
  const user = await userCollection.findOne({ userId: payload.userId });
  if (!user) {
    return res.send({ accessToken: null });
  }
  if (token !== user.refreshToken) {
    return res.send({ accessToken: null });
  }
  const accessToken = createAccessToken(user.userId, user.role);
  const refreshToken = createRefreshToken(user.userId);
  await userCollection.updateOne(
    { userId: user.userId },
    { $set: { refreshToken: refreshToken } }
  );
  sendRefreshToken(res, refreshToken);
  return res.send({
    accessToken,
  });
};

export const getAllUser = async (req, res, next) => {
  try {
    const user = await userCollection
      .find(
        {},
        {
          userId: 1,
          name: 1,
          role: 1,
          email: 1,
          joinedOn: 1,
          bio: 1,
          profilePic: 1,
          isDeactivated: 1,
          deactivatedBy: 1,
        }
      )
      .maxTimeMS(20000);
    return res.send(user);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't get the users" });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { userId, name, email, bio, role } = req.body;
    const userNameExists = await userCollection.findOne({ name: name });
    const userEmailExists = await userCollection.findOne({ email: email });
    let user = null;
    if (
      (userNameExists?.userId === userId && userEmailExists?.userId === userId) ||
      (!userNameExists && userEmailExists?.userId === userId) ||
      (!userEmailExists && userNameExists?.userId === userId)
    ) {
      user = await userCollection.findOneAndUpdate(
        { userId: userId },
        {
          name: name,
          email: email,
          bio: bio,
          role: role,
        },
        { new: true }
      );
    } else {
      return res.status(400).send({
        msg: "User credentials already found.",
      });
    }
    return res.send(user);
  } catch (err) {
    next(err);
    return res.status(400).send({
      msg: "Can't update user",
    });
  }
};

export const deactivatedUser = async (req, res, next) => {
  try {
    const { userId, deactivatedBy } = req.body;
    const isUserExists = await userCollection.findOne({ userId: userId });
    const isUserDeactivated = isUserExists.isDeactivated;
    let user;
    if (!isUserDeactivated) {
      user = await userCollection.findOneAndUpdate(
        { userId: userId },
        { $set: { isDeactivated: true, deactivatedBy: deactivatedBy } },
        { new: true }
      );
    } else if (deactivatedBy === isUserExists.deactivatedBy) {
      user = await userCollection.findOneAndUpdate(
        { userId: userId },
        { $set: { isDeactivated: false, deactivatedBy: "" } },
        { new: true }
      );
    } else {
      return res.status(400).send({
        msg: "Can't activate or deactivate user",
      });
    }
    return res.send(user);
  } catch (err) {
    next(err);
    return res.status(400).send({
      msg: "Can't deactivate or activate user",
    });
  }
};
