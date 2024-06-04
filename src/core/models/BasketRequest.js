import mongoose from "mongoose";
const { Schema } = mongoose;

const BasketRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming you have a User model
  requests: [{ type: Schema.Types.ObjectId, ref: "Request" }], // Reference to Item model
});

const BasketRequest =
  mongoose.models.Basket ||
  mongoose.model("BasketRequest", BasketRequestSchema);

export default BasketRequest;
