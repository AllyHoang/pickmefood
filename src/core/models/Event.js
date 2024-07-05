import { Schema, models, model } from "mongoose";
import mongoose from "mongoose";

const EventSchema = new Schema(
  {
    eventName: {
      type: String,
      required: true,
      default: "",
    },
    money: {
      type: Number,
      required: true,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
    },
    expirationDate: {
      type: Date,
      default: null,
    },
    organizationName: {
      type: String,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Places",
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
      type: String,
    },
    channel: [
      {
        playbackUrl: {
          type: String,
        },
        streamKey: {
          type: String,
        },
        ingestServer: {
          type: String,
        },
      },
    ],
    chatRoom: [
      {
        roomIdentifier: {
          type: String,
        },
      },
    ],
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
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    likedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Reference to the User model
        },
        state: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const EventModel = models?.Event || model("Event", EventSchema);

export default EventModel;
