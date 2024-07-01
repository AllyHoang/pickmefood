// components/CheckoutForm.js
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Breadcrumbs from "@/components/ui/breadcrumbs";

export default function CheckoutFormPlaces({
  clientSecret,
  setClientSecret,
  setMessage,
  setIsLoading,
  donationAmount,
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

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/maps", // Replace with your return URL
      }, // To handle async payments (such as 3D Secure) without redirecting
      redirect: "if_required", // To handle async payments (such as 3D Secure) without redirecting
    });

    if (error) {
      setPaymentError(error.message);
      setIsLoadingPayment(false);
    } else {
      // Send paymentIntentId to your server
      const response = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId: paymentIntent.id,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setPaymentError(data.error);
      } else {
        setMessage("Payment successful!");
      }
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

        {stripe && elements && (
          <PaymentElement options={paymentElementOptions} />
        )}

        <button
          type="submit"
          disabled={!clientSecret || isLoadingPayment}
          className={`w-full py-2 px-4 mt-4 rounded-lg text-white ${
            isLoadingPayment
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition ease-in-out duration-300"
          }`}
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
