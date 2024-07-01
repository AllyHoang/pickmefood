// pages/api/confirm-payment.js
import Stripe from "stripe";
import connectToDB from "@/core/db/mongodb";
import { ReceiptModel } from "@/core/models/Receipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === "POST") {
    const { paymentIntentId } = req.body;

    try {
      // Retrieve the PaymentIntent
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      if (!paymentIntent) {
        return res.status(404).json({ error: "PaymentIntent not found" });
      }

      // Retrieve the PaymentMethod to get card details
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentIntent.payment_method
      );

      if (!paymentMethod || paymentMethod.type !== "card") {
        return res.status(400).json({ error: "Payment method is not a card" });
      }

      // Extract card details
      const { brand, last4 } = paymentMethod.card;
      console.log(brand, last4);

      // Update the existing receipt with card details
      const updatedReceipt = await ReceiptModel.findOneAndUpdate(
        { paymentIntentId }, // Find receipt by paymentIntentId
        {
          $push: {
            cardDetails: {
              last4Digits: last4,
              brand: brand,
            },
          },
        },
        { new: true }
      );

      if (!updatedReceipt) {
        return res.status(404).json({ error: "Receipt not found" });
      }

      res.json({ receipt: updatedReceipt });
    } catch (error) {
      console.error("Error retrieving payment method details:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
