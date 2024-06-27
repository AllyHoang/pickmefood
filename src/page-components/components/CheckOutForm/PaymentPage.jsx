// pages/index.js
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/page-components/components/CheckOutForm/CheckOutForm";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentPage({ eventId }) {
  const [clientSecret, setClientSecret] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    <div className="App">
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
          />
          {!isLoading ? (
            <button type="submit">Donate</button>
          ) : (
            <button type="button" disabled>
              Loading...
            </button>
          )}
          {message && <div>{message}</div>}
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
          />
        </Elements>
      )}
    </div>
  );
}
