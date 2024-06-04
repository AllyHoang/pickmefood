import { Schema, models, model } from "mongoose";
const FoodSchema = new Schema({
  name: String,
  emoji: String,
});

const FoodModel = models?.Food || model("Food", FoodSchema);

export default FoodModel;
