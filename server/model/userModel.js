import mongoose from "mongoose";
import ROLE from "../utils/Role.js";

const useSchema = new mongoose.Schema({
  userId: {
    type: String,
    requied: true,
  },
  name: {
    type: String,
    requied: true,
  },
  role: {
    type: String,
    default: ROLE.USER,
  },
  email: {
    type: String,
    requied: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    requied: true,
    min: 8,
  },
  joinedOn: {
    type: String,
    requied: true,
  },
  bio: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
    default: "",
  },
  profilePic: {
    type: String,
    default: "",
  },
  isDeactivated: {
    type: Boolean,
    default: false,
  },
  deactivatedBy: {
    type: String,
    default: "",
  },
});

const userCollection = mongoose.model("Users", useSchema);

export default userCollection;
