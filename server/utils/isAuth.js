import pkg from "jsonwebtoken";
import jwtDecode from "jwt-decode";
import ROLE from "./Role.js";
const { verify } = pkg;

export const isAuth = (req) => {
  const authorization = req.headers["authorization"];
  if (!authorization) throw new Error("You need to login");
  const token = authorization.split(" ")[1];
  const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  return userId;
};

export const isAuthorizedForUser = async (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  const {userId, role} = jwtDecode(token);
  if (userId === req.body.userId || role===ROLE.ADMIN) {
    next();
  } else {
    return res
      .status(400)
      .send({msg: "You aren't authorized to update user details." });
  } 
};

export const isAuthorizedForPost = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];
  const {userId, role} = jwtDecode(token);
  if (userId === req.body.editor || role===ROLE.ADMIN || role===ROLE.EDITOR) {
    next();
  } else {
    return res
      .status(400)
      .send({ status: false, msg: "You aren't authorized to change post details." });
  } 
}
