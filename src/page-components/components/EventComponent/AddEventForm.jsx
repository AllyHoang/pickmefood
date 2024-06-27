// src/components/AddEventForm.jsx

import React, { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";

const AddEventForm = ({ userId }) => {
  const [eventName, setEventName] = useState("");
  const [money, setMoney] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEvent = {
      eventName,
      money: parseFloat(money),
      expirationDate,
      organizationName,
      location,
      description,
      image,
      userId,
    };

    try {
      // Submit event data to backend API endpoint
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        router.push("/events");
      }

      if (!response.ok) {
        throw new Error("Failed to add new event");
      }

      // Clear form fields after successful submission
      setEventName("");
      setMoney("");
      setExpirationDate("");
      setOrganizationName("");
      setLocation("");
      setDescription("");
      setImage("");

      // Notify parent component about the new event added
      onAddEvent(newEvent);
    } catch (error) {
      console.error("Error adding new event:", error);
      // Handle error states or notifications as needed
    }
  };

  return (
    <div className="flex-grow p-6 overflow-y-hidden ">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-y-hidden">
        <h2 className="text-2xl font-bold mb-4">Add New Event</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6">
          {/* Event Name */}
          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="eventName"
            >
              Event Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="eventName"
              type="text"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
            />
          </div>

          {/* Money */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="money"
            >
              Money
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="money"
              type="number"
              placeholder="Enter money"
              value={money}
              onChange={(e) => setMoney(e.target.value)}
              required
            />
          </div>

          {/* Expiration Date */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="expirationDate"
            >
              Expiration Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="expirationDate"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              required
            />
          </div>

          {/* Organization */}
          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="organization"
            >
              Organization
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="organization"
              type="text"
              placeholder="Enter organization name"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="location"
            >
              Location
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="location"
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="col-span-2 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Image URL
            </label>
            <div className="mt-1">
              <CldUploadButton
                options={{ maxFiles: 1 }}
                folder="profile_images"
                onSuccess={(result) => setImage(result?.info?.secure_url || "")}
                onFailure={(error) =>
                  console.error("Cloudinary upload error:", error)
                }
                uploadPreset="zoa1vsa7"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Upload Image
              </CldUploadButton>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-end">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventForm;
