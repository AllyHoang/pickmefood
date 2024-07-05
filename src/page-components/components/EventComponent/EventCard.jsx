// src/components/EventCard.jsx

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PaymentPage from "../CheckOutForm/PaymentPage";
import { useRouter } from "next/router";

const EventCard = ({ event, userId }) => {
  const {
    image,
    eventName,
    expirationDate,
    description,
    money,
    location,
    organizationName,
    organizationId,
    _id,
    progress,
  } = event;
  const [progressStick, setProgress] = useState(0);
  const [remainingMoney, setRemainingMoney] = useState(money);
  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const [isChatLive, setIsChatLive] = useState(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection opened");
      const message = {
        type: "clientMessage",
        content: "Hello from EventCard",
      };
      socket.send(JSON.stringify(message));
      console.log("Sent message to WebSocket server:", message);
    };

    socket.onmessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const message = JSON.parse(event.data);
          console.log("Received message from WebSocket server:", message);
          if (message.eventId) {
            setEventId(message.eventId);
            setIsChatLive(message.isChatLive);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      } else if (event.data instanceof Blob) {
        // Handle Blob data, if necessary
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const message = JSON.parse(reader.result);
            console.log(
              "Received message from WebSocket server (Blob):",
              message
            );
            if (message.eventId) {
              setEventId(message.eventId);
              setIsChatLive(message.isChatLive);
            }
          } catch (error) {
            console.error("Error parsing JSON from Blob:", error);
          }
        };
        reader.readAsText(event.data);
      } else {
        console.warn("Unsupported message type:", typeof event.data);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/events/${_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }
        const data = await response.json();
        const currentProgress = (progress / money) * 100;
        setProgress(currentProgress);
        setRemainingMoney(money - progress);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [_id, money]);

  const routeToChannel = () => {
    // Example: Redirect to a specific route based on the event _id
    router.push(`/channel/Summer Festival`);
  };

  return (
    <div className="event-card bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={image}
        alt={eventName}
        className="card-image w-full h-48 object-cover"
      />
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h2 className="card-title text-xl font-semibold text-gray-800">
            {eventName}
          </h2>
          <div className="date-box bg-white text-gray-700 border border-gray-300 px-2 py-1 rounded shadow-sm">
            <span className="text-xs">{expirationDate}</span>
          </div>
          {isChatLive && _id === eventId && (
            <button
              className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
              onClick={routeToChannel}
            >
              LIVE
            </button>
          )}
        </div>
        <p className="card-organization text-sm text-gray-600 mb-1">
          {organizationName}
        </p>
        <p className="card-location text-sm text-gray-600 mb-1">{location}</p>
        <p className="card-description text-sm text-gray-600 mb-2 flex-grow">
          {description}
        </p>
        <div className="mb-4">
          <div className="card-progress h-4 bg-gray-200 rounded-full mb-1">
            <div
              className="card-progress-bar h-full bg-blue-500 rounded-full"
              style={{ width: `${progressStick}%` }}
            ></div>
          </div>
          <p className="card-funding-info text-sm text-gray-700">
            To be funded: ${remainingMoney} (${progress.toFixed(2)}% funded)
          </p>
        </div>
        <Dialog>
          <DialogTrigger>
            <Button className="bg-sky-400 hover:bg-sky-500">Donate</Button>
          </DialogTrigger>
          <DialogContent className="min-w-fit w-3/4 h-4/5">
            <PaymentPage
              eventId={_id}
              userId={userId}
              event={event}
            ></PaymentPage>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventCard;
