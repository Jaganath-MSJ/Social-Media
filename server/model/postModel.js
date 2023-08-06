import mongoose from "mongoose";

const commentsSchema = new mongoose.Schema({
  autorId: {
    type: String,
    requied: true,
  },
  comment: {
    type: String,
    requied: true,
  },
  createdOn: {
    type: String,
    requied: true,
  },
});

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    requied: true,
  },
  autorId: {
    type: String,
    requied: true,
  },
  title: {
    type: String,
    requied: true,
  },
  content: {
    type: String,
    requied: true,
  },
  postedOn: {
    type: String,
    requied: true,
  },
  like: [
    {
      type: String,
    },
  ],
  disLike: [
    {
      type: String,
    },
  ],
  comments: [commentsSchema],
  share: [
    {
      type: String,
    },
  ],
  isRetweet: {
    type: Boolean,
    default: false,
  },
  retweetBy: {
    type: String,
  },
  originalPostId: {
    type: String,
  },
});

const postCollection = mongoose.model("Posts", postSchema);

export default postCollection;
