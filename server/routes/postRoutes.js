import express from "express";
import {
  getAllPost,
  addPost,
  addEmotes,
  addComments,
  updatePost,
  deletePost,
  retweetPost,
} from "../controllers/postControllers.js";
import { isUserAuth } from "../controllers/userControllers.js";
import { isAuthorizedForPost } from "../utils/isAuth.js";

const postRouter = express.Router();
postRouter.get("/getAllPost", getAllPost);
postRouter.post("/addPost", isUserAuth, addPost);
postRouter.post("/addEmotes", isUserAuth, addEmotes);
postRouter.post("/addComments", isUserAuth, addComments);
postRouter.post("/updatePost", isUserAuth, isAuthorizedForPost, updatePost);
postRouter.post("/deletePost", isUserAuth, isAuthorizedForPost, deletePost);
postRouter.post("/retweetPost", isUserAuth, retweetPost);
export default postRouter;
