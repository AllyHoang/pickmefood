import mongoose from "mongoose";
import { Schema, models, model } from "mongoose";
const FoodSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
});

const FoodModel = models?.Food || model("Food", FoodSchema);

export default FoodModel;
