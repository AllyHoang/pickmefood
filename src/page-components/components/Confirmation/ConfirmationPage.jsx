import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import mapboxgl from "mapbox-gl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ConfirmationPage.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { useImage } from "@/lib/ImageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const ConfirmationPage = ({ userId }) => {
  const { imageUrl } = useImage();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { confirmedItems } = router.query;
  console.log(userId);
  const parsedItems = confirmedItems ? JSON.parse(confirmedItems) : [];
  const [userAddress, setUserAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [itemDetails, setItemDetails] = useState(
    parsedItems.map((item) => ({
      item,
      quantity: "",
      expirationDate: null,
      emoji: "",
    }))
  );

  console.log("UserId: " + userId);
  const [foodItems, setFoodItems] = useState([]);
  const [donationMode, setDonationMode] = useState(true); // true for donation, false for request
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [basketDescription, setBasketDescription] = useState(""); // For donation
  const [basketReason, setBasketReason] = useState(""); // For request

  const mapContainerRef = useRef(null);

  mapboxgl.accessToken =
    "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
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
          marker.remove(); // Remove existing marker
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
    setUserAddress(address);

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
    setUserAddress(address);
    setAddressSuggestions([]);

    // Call reverse geocoding function with the selected address
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

      // Update the map with the new coordinates
      if (map) {
        map.setCenter([longitude, latitude]);
        map.setZoom(15);

        if (marker) {
          marker.remove(); // Remove existing marker
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
    async function fetchFoodData() {
      try {
        const res = await fetch(`http://localhost:3000/api/food`, {
          cache: "no-store",
        });
        const data = await res.json();
        setFoodItems(data.foods);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }

    fetchFoodData();
  }, []);

  const handleModeToggle = () => {
    setDonationMode(!donationMode);
  };

  const handleInputChange = (index, field, value) => {
    const newDetails = [...itemDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setItemDetails(newDetails);
  };

  const handleSaveItem = () => {
    const currentItem = itemDetails[activeItemIndex];
    const itemName = capitalizeFirstLetter(parsedItems[activeItemIndex]);
    const foodItem = foodItems.find(
      (food) => food.name.toLowerCase() === itemName.toLowerCase()
    );
    const emoji = foodItem ? foodItem.emoji : "";
    const updatedItems = [...items];
    updatedItems[activeItemIndex] = {
      ...currentItem,
      itemName: itemName,
      emoji: emoji,
      mode: donationMode ? "donation" : "request",
    };
    setItems(updatedItems);
    toast.success(`Item ${itemName} saved successfully`);
  };

  const handleSubmit = async () => {
    const itemsWithUserId = items.map((item) => ({
      ...item,
      userId, // Include userId for each item
    }));

    try {
      const endpoint = donationMode ? `/api/items` : `/api/requests`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId, // Include userId in the request body
          [donationMode ? "items" : "requests"]: itemsWithUserId,
          [donationMode ? "description" : "reason"]: donationMode
            ? basketDescription
            : basketReason, // Add basketDescription or basketReason based on mode
          image: imageUrl,
          title,
          location: userAddress,
        }),
      });

      if (res.ok) {
        toast.success("Items submitted successfully");
        donationMode ? router.push("/userpage") : router.push("/userpage");
      } else {
        throw new Error("Failed to submit items");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting items");
    }
  };

  // Helper function to capitalize the first letter of each word
  const capitalizeFirstLetter = (string) => {
    if (typeof string != "string" || !string.length) {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="flex flex-row justify-center gap-8">
      <ToastContainer />
      <div className="flex flex-col gap-4">
        <div
          className="bg-gray-200 rounded-lg shadow-lg h-64"
          style={{ width: "34rem" }}
          ref={mapContainerRef}
          id="map"
        ></div>

        <Card className="px-4 py-4 flex flex-col" style={{ width: "34rem" }}>
          <label htmlFor="userAddress" className="text-gray-700 font-bold mb-2">
            Your Address:
          </label>
          <Input
            id="userAddress"
            value={userAddress}
            onChange={handleAddressChange}
            className="w-full p-2 border border-gray-300 rounded"
            type="text"
            placeholder="Enter your address"
          />
          <ul className="space-y-1">
            {addressSuggestions.map((address, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(address)}
                className="cursor-pointer p-2 border border-gray-300 rounded"
              >
                {address}
              </li>
            ))}
          </ul>
          <Button onClick={handleGetUserLocation} className="bg-sky-400 mt-3">
            Get My Location
          </Button>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Card className="px-4 py-4" style={{ width: "34rem" }}>
          <h1 className="text-gray-700 font-bold">Item Selection</h1>
          <div className="mt-2 flex gap-3 flex-wrap">
            {parsedItems.map((item, index) => (
              <Button
                key={index}
                className={`${
                  activeItemIndex === index
                    ? "bg-black text-white"
                    : "bg-white text-black border-1"
                }`}
                onClick={() => setActiveItemIndex(index)}
              >
                {capitalizeFirstLetter(item)}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-4 flex flex-col gap-2" style={{ width: "34rem" }}>
          <div className="flex flex-col gap-2">
            <label htmlFor="basketTitle" className="text-gray-700 font-bold">
              Basket Title:
            </label>
            <Input
              id="basketTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Enter a name"
              type="text"
            />
            <label className="text-gray-700 font-bold">
              {donationMode ? "Basket Description" : "Basket Reason"}:
            </label>
            <Input
              value={donationMode ? basketDescription : basketReason}
              onChange={(e) =>
                donationMode
                  ? setBasketDescription(e.target.value)
                  : setBasketReason(e.target.value)
              }
              placeholder={
                donationMode ? "Enter a description" : "Enter a reason"
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex flex-row gap-4">
            <div>
              <label className="block text-gray-700 mb-2 font-bold">
                {capitalizeFirstLetter(parsedItems[activeItemIndex])}
              </label>
              <Input
                type="text"
                placeholder="Quantity"
                value={itemDetails[activeItemIndex]?.quantity || ""}
                onChange={(e) =>
                  handleInputChange(activeItemIndex, "quantity", e.target.value)
                }
                className="p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              {donationMode && (
                <>
                  <label
                    htmlFor="expirationDate"
                    className="block text-gray-700 mb-2 font-bold"
                  >
                    Expiration Date:
                  </label>
                  <DatePicker
                    selected={
                      itemDetails[activeItemIndex]?.expirationDate || null
                    }
                    onChange={(date) =>
                      handleInputChange(activeItemIndex, "expirationDate", date)
                    }
                    dateFormat="MM/dd/yyyy"
                    className="w-full h-9 p-2 border border-gray-300 rounded"
                    placeholder="Choose a date"
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {/* <Button onClick={handleModeToggle} className="bg-sky-400">
                Switch to {donationMode ? "Request" : "Donation"} Mode
              </Button> */}
            <Button onClick={handleSaveItem} className="bg-sky-400 w-1/2">
              Save Item
            </Button>
            <Button onClick={handleSubmit} className="bg-sky-400 w-1/2">
              Submit Items
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConfirmationPage;
