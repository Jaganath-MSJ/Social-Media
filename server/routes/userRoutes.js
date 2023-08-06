import express from "express";
import {
  register,
  login,
  logout,
  isUserAuth,
  refreshToken,
  getAllUser,
  updateUser,
  deactivatedUser,
} from "../controllers/userControllers.js";
import { isAuthorizedForUser } from "../utils/isAuth.js";

const userRouter = express.Router();
userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.post("/isUserAuth", isUserAuth);
userRouter.post("/refresh_token", refreshToken);
userRouter.get("/getAllUsers", getAllUser);
userRouter.post("/updateUser", isUserAuth, isAuthorizedForUser, updateUser);
userRouter.post("/deactivateUser", isUserAuth, isAuthorizedForUser, deactivatedUser);
export default userRouter;
