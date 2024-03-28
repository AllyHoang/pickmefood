import { Schema, models, model } from "mongoose";

const UserSchema = new Schema({
  userId: {
    type: String,
    require: true,
    default: "",
  },
  email: {
    type: String,
    require: true,
    default: "",
  },
});

export const UserModel = models?.User || model("User", UserSchema);
