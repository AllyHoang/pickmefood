import { Schema, models, model } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
  profileImage: {
    type: String,
    default: "",
  },
  chats: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    default: [],
  },
});

export const UserModel = models?.User || model("User", UserSchema);