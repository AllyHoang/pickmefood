import { Schema, models, model } from "mongoose";

const ItemSchema = new Schema({
  itemId: {
    type: String,
    require: true,
    default: "",
  },
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
  datePosted: {
    type: Date,
    default: Date.now
  },
  expirationDate: {
    type: String,
    required: true,
    default: ""
  },
});

export const ItemModel = models?.Item || model("Item", ItemSchema);
