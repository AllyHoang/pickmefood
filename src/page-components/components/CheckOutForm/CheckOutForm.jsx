// components/CheckoutForm.js
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function CheckoutForm({
  clientSecret,
  setClientSecret,
  setMessage,
  setIsLoading,
  donationAmount,
  stripePromise,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoadingPayment(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/events", // Replace with your return URL
      },
    });

    if (error) {
      setPaymentError(error.message);
      setIsLoadingPayment(false);
    } else {
      setMessage("Payment successful!");
      setIsLoadingPayment(false);
    }
  };

  const paymentElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: true,
  };

  // Breadcrumb items for the checkout form page
  const crumbs = [
    { title: "Events", href: "/events" },
    { title: "Donate", href: "/stripe" },
    { title: "Checkout" },
  ];

  return (
    <div>
      <Breadcrumbs crumbs={crumbs} />

      <form onSubmit={handleSubmit}>
        <div>
          <strong>Donation Amount:</strong> ${donationAmount}
        </div>

        {stripe &&
          elements && ( // Ensure stripe and elements are loaded before rendering PaymentElement
            <PaymentElement options={paymentElementOptions} />
          )}

        <button
          type="submit"
          disabled={!clientSecret || isLoadingPayment}
          style={{ marginTop: "20px" }}
        >
          {isLoadingPayment ? "Processing..." : "Pay now"}
        </button>

        {paymentError && (
          <div style={{ color: "red", marginTop: "12px" }}>{paymentError}</div>
        )}
      </form>
    </div>
  );
}
