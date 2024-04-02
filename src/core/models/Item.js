import { Schema, models, model } from "mongoose";

const ItemSchema = new Schema(
  {
    itemName: {
      type: String,
      require: true,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    quantity: {
      type: Number,
      require: true,
      default: "",
    },
    expirationDate: {
      type: String,
      required: true,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ItemModel = models?.Item || model("Item", ItemSchema);

export default ItemModel;
