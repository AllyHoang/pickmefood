import { Schema, models, model } from "mongoose";
import mongoose from "mongoose";

// Define a new Mongoose Schema
const PlacesSchema = new Schema(
  {
    donationAmount: {
      type: Number,
    },
    donors: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        amount: {
          type: Number,
        },
      },
    ],
    formattedAddress: {
      type: String,
      required: true,
    },
    displayName: {
      text: {
        type: String,
        required: true,
      },
      languageCode: {
        type: String,
        required: true,
        default: "en", // Default language code to English
      },
    },
    photos: [
      {
        name: {
          type: String,
          required: true,
        },
        widthPx: {
          type: Number,
        },
        heightPx: {
          type: Number,
        },
        authorAttributions: [
          {
            displayName: {
              type: String,
            },
            uri: {
              type: String,
              validate: {
                validator: (v) =>
                  /^\/\/maps\.google\.com\/maps\/contrib\/\d+$/.test(v),
                message: (props) =>
                  `${props.value} is not a valid Google Maps contributor URI`,
              },
            },
            photoUri: {
              type: String,
              validate: {
                validator: (v) =>
                  /^\/\/lh3\.googleusercontent\.com\/a-\/.+=s\d+-p-k-no-mo$/.test(
                    v
                  ),
                message: (props) =>
                  `${props.value} is not a valid Google Maps photo URI`,
              },
            },
          },
        ],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Define the Mongoose model based on the schema
const PlacesModel = models?.Places || model("Places", PlacesSchema);

export default PlacesModel;
