// pages/api/create-payment-intent.js
import Stripe from "stripe";
import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";
import { ReceiptModel } from "@/core/models/Receipt";
import { UserModel } from "@/core/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { amount, eventId, userId, organizationName, organizationId } =
      req.body;

    try {
      // Fetch the event by eventId
      const event = await EventModel.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Update progress in the event document
      const updatedProgress = event.progress + amount;
      event.progress = updatedProgress;
      await event.save();

      // Create payment intent in Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: "usd",
        metadata: { eventId: event._id.toString(), userId }, // Store eventId and userId as metadata
      });

      await UserModel.findByIdAndUpdate(userId, {
        $inc: { points: (amount / 10) * 5 },
      });

      // Create a new receipt
      const receipt = new ReceiptModel({
        userId,
        amount,
        organization: [
          {
            organzationId: organizationId,
            organizationName: organizationName, // Assuming `name` exists on event
          },
        ],
        cardDetails: [], // This will be filled in later when confirming the payment
        paymentIntentId: paymentIntent.id,
        type: "Event",
      });

      await receipt.save();

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        receiptId: receipt._id,
      });
    } catch (error) {
      console.error("Error processing payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
