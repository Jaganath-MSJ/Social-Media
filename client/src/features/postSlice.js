import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import {
  addCommentsRoute,
  addEmotesRoute,
  addPostRoute,
  deletePostRoute,
  getAllPostsRoute,
  retweetPostRoute,
  updatePostRoute,
} from "../utils/APIRoutes";
import axios from "axios";

const initialState = {
  post: [],
  status: "idle", // loading, succeeded, failed
  error: null,
};

export const getAllPosts = createAsyncThunk("getAllPosts", async () => {
  try {
    const res = await axios.get(getAllPostsRoute);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const addPost = createAsyncThunk("addPost", async (initialPost) => {
  try {
    const res = await axios.post(addPostRoute, initialPost.details, {
      headers: { authorization: `Bearer ${initialPost.token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const addEmotes = createAsyncThunk("addEmotes", async (initialEmote) => {
  try {
    const res = await axios.post(addEmotesRoute, initialEmote.details, {
      headers: { authorization: `Bearer ${initialEmote.token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const addComment = createAsyncThunk(
  "addComment",
  async (initialComment) => {
    try {
      const res = await axios.post(addCommentsRoute, initialComment.details, {
        headers: { authorization: `Bearer ${initialComment.token}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.msg);
    }
  }
);

export const updatePost = createAsyncThunk("updatePost", async (updatePost) => {
  try {
    const res = await axios.post(updatePostRoute, updatePost.details, {
      headers: { authorization: `Bearer ${updatePost.token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const deletePost = createAsyncThunk("deletePost", async (deletePost) => {
  try {
    const res = await axios.post(deletePostRoute, deletePost.details, {
      headers: { authorization: `Bearer ${deletePost.token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const rewteetPost = createAsyncThunk(
  "rewteetPost",
  async (rewteetPost) => {
    try {
      console.log("2");
      const res = await axios.post(retweetPostRoute, rewteetPost.details, {
        headers: { authorization: `Bearer ${rewteetPost.token}` },
      });
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.msg);
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    postAdd: {
      reducer(state, action) {
        state.post.push(action.payload);
      },
      prepare(autorId, title, conetent) {
        return {
          payload: {
            autorId,
            title,
            conetent,
            postedOn: new Date().toISOString(),
          },
        };
      },
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.post = action.payload;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPosts = state.post.concat(action.payload);
        return {
          ...state,
          post: updatedPosts,
        };
      })
      .addCase(addPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addEmotes.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const updatedPosts = state.post.map((post) =>
          post.postId === postId ? action.payload : post
        );
        return {
          ...state,
          post: updatedPosts,
        };
      })
      .addCase(addEmotes.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId } = action.payload;
        const updatedPosts = state.post.map((post) =>
          post.postId === postId ? action.payload : post
        );
        return {
          ...state,
          post: updatedPosts,
        };
      })
      .addCase(addComment.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { postId } = action.payload;
        const updatedPosts = state.post.map((post) =>
          post.postId === postId ? action.payload : post
        );
        return {
          ...state,
          post: updatedPosts,
        };
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedPosts = state.post.filter(
          (post) => post.postId !== action.payload
        );
        return {
          ...state,
          post: updatedPosts,
        };
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(rewteetPost.fulfilled, (state, action) => {
        const { postId, postRetweet, retweetBy } = action.payload;
        const updatedPosts = state.post.map((post) =>
          post.postId === postId ? action.payload.post : post
        );
        let postUpdate;
        if (postRetweet === null) {
          postUpdate = updatedPosts.filter(
            (post) =>
              !(post.originalPostId === postId && retweetBy === post.retweetBy)
          );
        } else {
          postUpdate = updatedPosts.concat(postRetweet);
        }
        return {
          ...state,
          post: postUpdate,
        };
      })
      .addCase(rewteetPost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllPost = (state) => state.post.post;
export const getPostStatus = (state) => state.post.status;
export const getPostError = (state) => state.post.error;

export const selectPostById = (state, postId) =>
  state.post.post.find((post) => post.postId === postId);
export const selectUserPostByUserId = createSelector(
  [selectAllPost, (state, userId) => userId],
  (posts, userId) =>
    posts.filter(
      (post) =>
        (post.autorId === userId && !post.isRetweet) ||
        post.retweetBy === userId
    )
);
export const selectUserLikesByUserId = createSelector(
  [selectAllPost, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.like.includes(userId))
);
export const selectUserRepliesByUserId = createSelector(
  [selectAllPost, (state, userId) => userId],
  (posts, userId) => {
    return posts.filter((post) => {
      return post.comments.find((comment) => comment.autorId === userId);
    });
  }
);

export const { postAdd } = postSlice.actions;

export default postSlice.reducer;
