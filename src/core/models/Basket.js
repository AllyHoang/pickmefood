import { Status } from "@/lib/utils";
import mongoose from "mongoose";
const { Schema } = mongoose;

const BasketSchema = new Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  description: {
    type: String,
    trim: true, // Remove whitespace from the description
  },
  location: {
    type: String,
    required: true,
    default: "",
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // Reference to Item model
  status: {
    type: String,
    enum: Object.values(Status),
    default: Status.INITIATED,
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|webp)$/i.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid image URL!`,
    },
  },
  type: {
    type: String,
    default: "Donation",
    immutable: true, // This makes the field unchangeable after the document is created
  },
  pendingTransactions: {
    type: Number,
    default: 0, 
    min: 0, 
    max: 4
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use mongoose.models to avoid model re-compilation
const BasketModel =
  mongoose.models.Basket || mongoose.model("Basket", BasketSchema);

export default BasketModel;

