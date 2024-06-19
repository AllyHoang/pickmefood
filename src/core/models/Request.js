import { Schema, models, model } from "mongoose";

const RequestSchema = new Schema(
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

    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
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

const RequestModel = models?.Request || model("Request", RequestSchema);
export default RequestModel;
