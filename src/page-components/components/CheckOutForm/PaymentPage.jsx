// pages/index.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/page-components/components/CheckOutForm/CheckOutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentPage({ eventId, userId, event }) {
  const [clientSecret, setClientSecret] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { organizationName, organizationId } = event;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Fetch the client secret from the API using the user-specified amount
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(parseFloat(donationAmount)),
        eventId,
        userId,
        organizationId,
        organizationName,
      }), // Convert to cents
    });

    const data = await response.json();
    if (data.error) {
      setMessage(data.error);
      setIsLoading(false);
    } else {
      setClientSecret(data.clientSecret);
      setMessage("");
    }
  };

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  return (
    <div className="text-center">
      {!clientSecret ? (
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Enter donation amount"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            required
            min="1"
            step="any"
            disabled={isLoading}
            className="w-full h-40 text-8xl rounded-lg border-2 border-gray-300 px-6 py-4 outline-none focus:border-blue-500 text-center text-gray-900 font-bold"
          />
          <br />
          {!isLoading ? (
            <button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Donate
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 bg-gray-400 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
            >
              Loading...
            </button>
          )}
          {message && <div className="mt-4 text-red-500">{message}</div>}
        </form>
      ) : (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            setClientSecret={setClientSecret}
            setMessage={setMessage}
            setIsLoading={setIsLoading}
            donationAmount={donationAmount}
            stripePromise={stripePromise}
            eventId={eventId}
            organizationId={organizationId}
            organizationName={organizationName}
          />
        </Elements>
      )}
    </div>
  );
}
