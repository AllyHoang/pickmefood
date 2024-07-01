// src/components/AddEventForm.jsx
import mapboxgl from "mapbox-gl";
import React, { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import Select from "react-select";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddEventForm = ({ userId }) => {
  const [eventName, setEventName] = useState("");
  const [money, setMoney] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [image, setImage] = useState("");
  const [places, setPlaces] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const router = useRouter();

  mapboxgl.accessToken =
    "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

  const handleItemChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    setName(selectedOption.value);
  };

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40],
      zoom: 9,
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  const handleGetUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;
      setUserAddress(address);

      if (map) {
        map.flyTo({ center: [longitude, latitude], zoom: 15 });

        if (marker) {
          marker.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);
        setMarker(newMarker);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const handleAddressChange = async (e) => {
    const address = e.target.value;
    setLocation(address);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const suggestions = data.features.map((feature) => feature.place_name);
      setAddressSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const handleSuggestionClick = (address) => {
    setLocation(address);
    setAddressSuggestions([]);
    reverseGeocodeSelectedAddress(address);
  };

  const reverseGeocodeSelectedAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const coordinates = data.features[0].center;
      const [longitude, latitude] = coordinates;

      if (map) {
        map.setCenter([longitude, latitude]);
        map.setZoom(15);

        if (marker) {
          marker.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map);
        setMarker(newMarker);
      }
    } catch (error) {
      console.error("Error reverse geocoding selected address:", error);
    }
  };

  useEffect(() => {
    async function fetchPlacesData() {
      try {
        const res = await fetch(`/api/places`, {
          cache: "no-store",
        });
        const data = await res.json();
        setPlaces(data.places);
        console.log(data.places);
        console.log(places);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }

    fetchPlacesData();
  }, []);

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
            <Select
              options={places.map((place) => ({
                value: place.displayName.text,
                label: place.displayName.text,
              }))}
              value={selectedOption}
              onChange={handleItemChange}
              className="w-full mb-2"
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
              className="w-full mb-4"
              type="text"
              placeholder="Enter your address"
            />
            <ul className="bg-white rounded-lg max-h-48 overflow-y-auto mb-4">
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
            <Button
              type="button"
              onClick={handleGetUserLocation}
              className="w-1/2 bg-sky-400 shadow-md shadow-sky-500/50 text-white  py-2 px-4 rounded mb-4"
            >
              Get My Location
            </Button>
          </div>
        </form>
        <div
          id="map"
          className="bg-gray-200 rounded-lg shadow-lg h-72 mb-4"
        ></div>
      </div>
    </div>
  );
};

export default AddEventForm;
