import { Schema, models, model } from "mongoose";
import { flushAllTraces } from "next/dist/trace";

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: true,
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
  location: {
    type: String,
    default: "",
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
});

export const UserModel = models?.User || model("User", UserSchema);
