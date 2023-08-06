import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deactivateUserRoute,
  getAllUsersRoute,
  updateUserRoute,
} from "../utils/APIRoutes";
import axios from "axios";

const initialState = {
  user: [],
  status: "idle", // loading, succeeded, failed
  error: null,
};

export const getAllUsers = createAsyncThunk("getAllUsers", async () => {
  try {
    const res = await axios.get(getAllUsersRoute);
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const updateUser = createAsyncThunk("updateUser", async (updateUser) => {
  try {
    const res = await axios.post(updateUserRoute, updateUser.details, {
      headers: { authorization: `Bearer ${updateUser.token}` },
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response.data.msg);
  }
});

export const deactivateUser = createAsyncThunk(
  "deactivatedUser",
  async (deactivateUser) => {
    console.log("user",deactivateUser);
    try {
      const res = await axios.post(
        deactivateUserRoute,
        deactivateUser.details,
        {
          headers: { authorization: `Bearer ${deactivateUser.token}` },
        }
      );
      return res.data;
    } catch (err) {
      throw new Error(err.response.data.msg);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { userId } = action.payload;
        const updatedUsers = state.user.map((user) =>
          user.userId === userId ? action.payload : user
        );
        return {
          ...state,
          user: updatedUsers,
        };
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { userId } = action.payload;
        const updatedUsers = state.user.map((user) =>
          user.userId === userId ? action.payload : user
        );
        return {
          ...state,
          user: updatedUsers,
        };
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllUser = (state) => state.user.user;
export const getUserStatus = (state) => state.user.status;
export const getUserError = (state) => state.user.error;

export const getUserInfoById = (state, userId) =>
  state.user.user.find((user) => user.userId === userId);
export const getUserNameById = (state, userId) =>
  state.user.user.find((user) => user.userId === userId)?.name;

export default userSlice.reducer;
