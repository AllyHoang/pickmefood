import React, { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const EditEventForm = ({ userId, eventId }) => {
  const [eventName, setEventName] = useState("");
  const [money, setMoney] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [customOrganization, setCustomOrganization] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details");
        }
        const eventData = await response.json();
        console.log(eventData);
        console.log(eventData.data.event);
        setEventName(eventData.data.event.eventName);
        setMoney(eventData.data.event.money);
        setExpirationDate(eventData.data.event.expirationDate);
        setOrganizationName(eventData.data.event.organizationName);
        setLocation(eventData.data.event.location);
        setDescription(eventData.data.event.description);
        setImage(eventData.data.event.image);

        // Fetch places data
        const placesResponse = await fetch(`/api/places`, {
          cache: "no-store",
        });
        const placesData = await placesResponse.json();
        setPlaces(placesData.places);
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleItemChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setOrganizationName(selectedOption.value);
  };

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setLocation(address);

    try {
      // Your address suggestions fetching logic
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedEvent = {
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
      const response = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      if (response.ok) {
        router.push("/my-event");
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="flex-grow p-6 overflow-hidden">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-hidden">
        <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Money and Expiration Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6">
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
                  Date
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
            </div>

            {/* Organization */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="organization"
              >
                Organization
              </label>
              <Select
                options={[
                  ...places.map((place) => ({
                    value: place.displayName.text,
                    label: place.displayName.text,
                  })),
                  { value: "custom", label: "Enter custom organization" },
                ]}
                value={
                  selectedOption
                    ? {
                        value: organizationName,
                        label: organizationName,
                      }
                    : null
                }
                onChange={(option) => {
                  setSelectedOption(option);
                  if (option.value === "custom") {
                    setOrganizationName("");
                  } else {
                    setOrganizationName(option.value);
                  }
                }}
                className="w-full"
              />
              {selectedOption?.value === "custom" && (
                <div className="mt-2">
                  <Input
                    placeholder="Enter custom organization name"
                    value={customOrganization}
                    onChange={(e) => setCustomOrganization(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-4">
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

            {/* Location */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <Input
                id="location"
                value={location}
                onChange={handleAddressChange}
                className="w-full mb-2"
                type="text"
                placeholder="Enter your address"
              />
              <ul className="bg-white rounded-lg max-h-48 overflow-y-auto">
                {addressSuggestions.map((address, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(address)}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Image URL
              </label>
              <div className="mt-1 flex flex-col items-start">
                <CldUploadButton
                  options={{ maxFiles: 1 }}
                  folder="profile_images"
                  onSuccess={(result) =>
                    setImage(result?.info?.secure_url || "")
                  }
                  onFailure={(error) =>
                    console.error("Cloudinary upload error:", error)
                  }
                  uploadPreset="zoa1vsa7"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
                >
                  Upload Image
                </CldUploadButton>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center">
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
                type="submit"
              >
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEventForm;
