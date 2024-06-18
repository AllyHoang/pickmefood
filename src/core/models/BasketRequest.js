import { Status } from "@/lib/utils";
import mongoose from "mongoose";
const { Schema, models } = mongoose;

const BasketRequestSchema = new Schema({
  title: {
    type: String,
    required: true, // Title is required
    trim: true, // Remove whitespace from the title
  },
  reason: {
    type: String,
    trim: true, // Remove whitespace from the description
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  requests: [{ type: Schema.Types.ObjectId, ref: "Request" }], // Reference to Request model
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
        ); // Basic regex to validate image URLs
      },
      message: (props) => `${props.value} is not a valid image URL!`,
    },
  },
  type: {
    type: String,
    default: "Request",
    immutable: true  // This makes the field unchangeable after the document is created
  },
});

// Use mongoose.models to avoid model re-compilation
const BasketRequest =
  models.BasketRequest || mongoose.model("BasketRequest", BasketRequestSchema);

export default BasketRequest;
