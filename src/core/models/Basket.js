import mongoose from "mongoose";
const { Schema } = mongoose;

const BasketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Assuming you have a User model
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // Reference to Item model
});

const BasketModel =
  mongoose.models.Basket || mongoose.model("Basket", BasketSchema);

export default BasketModel;
