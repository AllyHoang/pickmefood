import { Schema, models, model } from "mongoose";

const RequestSchema = new Schema(
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

const RequestModel = models?.Request || model("Request", RequestSchema);
export default RequestModel;
