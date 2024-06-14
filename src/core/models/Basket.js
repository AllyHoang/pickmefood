import mongoose from "mongoose";
const { Schema } = mongoose;

const BasketSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }], // Reference to Item model
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
});

// Use mongoose.models to avoid model re-compilation
const BasketModel =
  mongoose.models.Basket || mongoose.model("Basket", BasketSchema);

export default BasketModel;
