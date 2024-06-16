import { Schema, models, model } from "mongoose";

const ItemSchema = new Schema(
  {
    itemName: {
      type: String,
      require: true,
      default: "",
    },
    emoji: {
      type: String,
      require: true,
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
    userId: {
      type: String,
      required: true,
      default: "",
    },
    location: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ItemModel = models?.Item || model("Item", ItemSchema);

export default ItemModel;
