import Stripe from "stripe";
import connectToDB from "@/core/db/mongodb";
import EventModel from "@/core/models/Event";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { amount, eventId } = req.body;

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
        metadata: { eventId: event._id.toString() }, // Optional: store eventId as metadata
      });

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
