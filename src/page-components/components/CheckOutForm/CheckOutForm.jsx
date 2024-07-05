// components/CheckoutForm.js
import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { Router } from "lucide-react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutForm({
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
  const router = useRouter();

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
        return_url: "http://localhost:3000/events", // Replace with your return URL
      },
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
        toast.success("Payment successful!");
        router.push(`/events`);
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
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4`}
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
