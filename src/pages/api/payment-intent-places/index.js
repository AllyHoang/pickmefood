import Stripe from "stripe";
import connectToDB from "@/core/db/mongodb";
import PlacesModel from "@/core/models/Places";
import { UserModel } from "@/core/models/User";
import { ReceiptModel } from "@/core/models/Receipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { amount, placeId, placeName, userId } = req.body;

    try {
      // Fetch the event by eventId
      const place = await PlacesModel.findById(placeId);

      if (!place) {
        return res.status(404).json({ error: "Place not found" });
      }

      // Create payment intent in Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "usd",
        metadata: { placeId: place._id.toString() }, // Optional: store eventId as metadata
      });

      await UserModel.findByIdAndUpdate(userId, {
        $inc: { points: (amount / 10) * 5 },
      });

      // Check if the user already exists in the donors array
      const existingDonor = place.donors.find(
        (donor) => donor.userId.toString() === userId
      );

      if (existingDonor) {
        // Update the donation amount for the existing donor
        await PlacesModel.findOneAndUpdate(
          { _id: placeId },
          {
            $inc: {
              "donors.$.amount": amount, // Increment existing donor's amount
              donationAmount: amount, // Increment total donation amount
            },
          },
          { new: true }
        );
      } else {
        // Add a new donor entry
        await PlacesModel.findByIdAndUpdate(
          placeId,
          {
            $push: {
              donors: {
                userId,
                amount,
              },
            },
            $inc: {
              donationAmount: amount, // Increment total donation amount
            },
          },
          { new: true }
        );
      }
      // Create a new receipt
      const receipt = new ReceiptModel({
        userId,
        amount,
        organization: [
          {
            organzationId: placeId,
            organizationName: placeName, // Assuming `name` exists on event
          },
        ],
        cardDetails: [], // This will be filled in later when confirming the payment
        paymentIntentId: paymentIntent.id,
        type: "Place",
      });

      await receipt.save();

      res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error processing payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
