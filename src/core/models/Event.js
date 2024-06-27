import { Schema, models, model } from "mongoose";

const EventSchema = new Schema(
  {
    eventName: {
      type: String,
      require: true,
      default: "",
    },
    money: {
      type: Number,
      require: true,
      default: "",
    },
    progress: {
      type: Number,
      default: 0,
    },
    expirationDate: {
      type: String,
      default: "",
    },
    organizationName: {
      type: String,
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
    description: {
      type: String, // Remove whitespace from the description
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
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const EventModel = models?.Event || model("Event", EventSchema);

export default EventModel;
