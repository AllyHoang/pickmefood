import { Schema, models, model } from "mongoose";
import mongoose from "mongoose";

const ReceiptSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  organization: [
    {
      organzationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Places",
      },
      organizationName: {
        type: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  cardDetails: [
    {
      last4Digits: {
        type: Number,
      },
      brand: {
        type: String,
      },
    },
  ],
  paymentIntentId: {
    type: String,
  },
  type: {
    type: String,
  },
});

export const ReceiptModel = models?.Receipt || model("Receipt", ReceiptSchema);
