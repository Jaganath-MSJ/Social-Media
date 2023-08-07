import { nanoid } from "nanoid";
import userCollection from "../model/userModel.js";
import postCollection from "../model/postModel.js";

export const getAllPost = async (req, res, next) => {
  try {
    const deactivatedUsers = await userCollection.find(
      { isDeactivated: true },
      { userId: 1, _id: 0 }
    );
    const userIdIsDeactived = deactivatedUsers.map((user) => user.userId);
    const allPosts = await postCollection.find({
      autorId: { $nin: userIdIsDeactived },
    });
    return res.send(allPosts);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't get the posts" });
  }
};

export const addPost = async (req, res, next) => {
  try {
    const { autorId, title, content, postedOn } = req.body;
    const post = await postCollection.create({
      postId: nanoid(),
      autorId,
      title,
      content,
      postedOn,
    });
    if (!post) {
      return res.status(400).send({ msg: "Can't add post" });
    }
    return res.send(post);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't add post" });
  }
};

export const addEmotes = async (req, res, next) => {
  try {
    const { postId, emote, autorId } = req.body;
    const postPresent = await postCollection.findOne({ postId: postId });
    const emojiArray = postPresent[emote] || [];
    const userIndex = emojiArray.indexOf(autorId);
    let post;
    if (userIndex === -1) {
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $push: { [emote]: autorId },
        },
        { new: true }
      );
    } else {
      emojiArray.splice(userIndex, 1);
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $set: { [emote]: emojiArray },
        },
        { new: true }
      );
    }
    return res.send(post);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't add reactions" });
  }
};

export const addComments = async (req, res, next) => {
  try {
    const { postId, autorId, comment, createdOn } = req.body;
    const post = await postCollection.findOneAndUpdate(
      { postId: postId },
      {
        $push: {
          comments: {
            autorId: autorId,
            comment: comment,
            createdOn: createdOn,
          },
        },
      },
      { new: true }
    );
    if (!post) {
      return res.status(400).send({ msg: "Can't add comment" });
    }
    return res.send(post);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't add comment" });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { postId, title, content } = req.body;
    const post = await postCollection.findOneAndUpdate(
      { postId: postId },
      {
        $set: {
          title: title,
          content: content,
        },
      },
      { new: true }
    );
    if (!post) {
      return res.status(400).send({ msg: "Can't update the post" });
    }
    return res.send(post);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't updated the post" });
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    await postCollection.deleteOne({ postId: postId });
    return res.send(postId);
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't delete post" });
  }
};

export const retweetPost = async (req, res, next) => {
  try {
    const { postId, autorId, title, content, postedOn, retweetBy } = req.body;
    const postPresent = await postCollection.findOne({ postId: postId });
    const rewteetArray = postPresent.share || [];
    const userIndex = rewteetArray.indexOf(retweetBy);
    let postRetweet = null,
      post;
    if (userIndex === -1) {
      postRetweet = await postCollection.create({
        postId: nanoid(),
        autorId,
        title,
        content,
        postedOn,
        isRetweet: true,
        retweetBy: retweetBy,
        originalPostId: postId,
      });
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $push: { share: retweetBy },
        },
        { new: true }
      );
    } else {
      await postCollection.deleteOne({
        $and: [{ originalPostId: postId }, { retweetBy: retweetBy }],
      });
      rewteetArray.splice(userIndex, 1);
      post = await postCollection.findOneAndUpdate(
        { postId: postId },
        {
          $set: { share: rewteetArray },
        },
        { new: true }
      );
    }
    return res.send({ post, postRetweet, postId, retweetBy });
  } catch (err) {
    next(err);
    return res.status(400).send({ msg: "Can't rewteet" });
  }
};
