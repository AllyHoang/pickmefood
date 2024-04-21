import { Schema, models, model } from "mongoose";
import { flushAllTraces } from "next/dist/trace";

const UserSchema = new Schema({
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
});

export const UserModel = models?.User || model("User", UserSchema);
