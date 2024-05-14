import { Schema, models, model } from "mongoose";

const FoodSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
      default: "",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const FoodModel = models?.Food || model("Food", FoodSchema);

export default FoodModel;
