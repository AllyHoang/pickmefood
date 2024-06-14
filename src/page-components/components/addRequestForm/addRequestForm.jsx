import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddRequestForm.module.css";
import Select from "react-select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";
import "mapbox-gl/dist/mapbox-gl.css";

export default function AddRequest({ userId }) {
  const [itemName, setName] = useState("");
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [items, setItems] = useState([]);
  const router = useRouter();

  mapboxgl.accessToken =
    "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Default center coordinates
      zoom: 9, // Default zoom level
    });

    setMap(mapInstance);

    return () => mapInstance.remove(); // Cleanup
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

  const handleItemChange = (selectedOption) => {
    if (selectedOption && selectedOption.value === "Add new item") {
      setShowNewItemInput(true);
      setSelectedOption(null);
      setName("");
    } else {
      setShowNewItemInput(false);
      setSelectedOption(selectedOption);
      setName(selectedOption ? selectedOption.value : "");

      const selectedFoodItem = foodItems.find(
        (item) => item.name === selectedOption.value
      );
      setEmoji(selectedFoodItem ? selectedFoodItem.emoji : "");
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleNewItemSubmit = async () => {
    if (!newItemName.trim()) {
      toast.error("Item name cannot be empty");
      return;
    }

    const capitalizedItemName =
      newItemName.charAt(0).toUpperCase() + newItemName.slice(1);

    // Check if the item already exists
    if (
      foodItems.some(
        (item) => item.name.toLowerCase() === capitalizedItemName.toLowerCase()
      )
    ) {
      toast.error("Item already exists");
      return;
    }

    try {
      // Find the emoji
      const emojiResponse = await fetch(
        `https://api.api-ninjas.com/v1/emoji?name=${newItemName}`,
        {
          headers: {
            "X-Api-Key": "KqQt1GmjjWZnOrsfFONHLg==TiI6oxPyCe2ozyMh",
          },
        }
      );

      if (!emojiResponse.ok) {
        throw new Error("Failed to fetch emoji");
      }

      const emojiData = await emojiResponse.json();
      const emoji = emojiData.length > 0 ? emojiData[0].character : "";

      // Post the new item
      const res = await fetch(`http://localhost:3000/api/food`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: capitalizedItemName,
          emoji: emoji,
        }),
      });

      if (res.ok) {
        setFoodItems([
          ...foodItems,
          { name: capitalizedItemName, emoji: emoji },
        ]);
        setSelectedOption({
          value: capitalizedItemName,
          label: `${capitalizedItemName}`,
        });
        setEmoji(emoji);
        setShowNewItemInput(false);
        setName(capitalizedItemName);
        toast.success("Item added successfully");
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Error adding item");
    }
  };

  const handleAddItem = () => {
    if (!itemName || !quantity) {
      toast.error("Please fill in all the required fields");
      return;
    }
    const newItem = {
      itemName,
      reason,
      quantity,
      address: userAddress,
      emoji,
    };
    setItems([...items, newItem]);
    setName("");
    setReason("");
    setQuantity("");
    setSelectedOption(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const itemsWithUserIdAndLocation = items.map((item) => ({
      ...item,
      userId,
      location: userAddress,
    }));

    try {
      const res = await fetch(`/api/requests`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          requests: itemsWithUserIdAndLocation,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create an item");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating item");
    }
  };

  return (
    <div className="flex flex-col items-center w-fit p-2 gap-2 min-w-fit max-h-max overflow-hidden">
      <ToastContainer />

      <div className="flex justify-between w-full gap-6 flex-grow overflow-y-auto">
        <Card className="flex-1 flex-col lg:w-1/3 h-auto lg:h-auto max-h-screen">
          <form onSubmit={handleSubmit} className="p-5 bg-white rounded-lg">
            <label htmlFor="name" className="font-bold text-gray-700 mb-2">
              Item name:
            </label>
            <Select
              options={foodItems.map((item) => ({
                value: item.name,
                label: item.name,
              }))}
              value={selectedOption}
              onChange={handleItemChange}
              className="w-full mb-4"
            />

            <label htmlFor="reason" className="font-bold text-gray-700 mb-2">
              Reason for item (optional):
            </label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mb-4"
              type="text"
              placeholder="Ex: I need it for groceries"
            />

            <label htmlFor="quantity" className="font-bold text-gray-700 mb-2">
              Item quantity:
            </label>
            <Input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full mb-4"
              type="text"
              placeholder="Ex: 1,2"
            />

            <label
              htmlFor="userAddress"
              className="font-bold text-gray-700 mb-2"
            >
              Your Address:
            </label>
            <Input
              id="userAddress"
              value={userAddress}
              onChange={handleAddressChange}
              className="w-full mb-4"
              type="text"
              placeholder="Enter your address"
            />
            <ul className="bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto mb-4">
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
            <div
              id="map"
              className="bg-gray-200 rounded-lg shadow-lg h-72 mb-4"
            ></div>
            <div className="flex flex-row gap-6">
              <Button
                type="button"
                onClick={handleGetUserLocation}
                className="w-1/2 bg-sky-400 shadow-md shadow-sky-500/50 text-white font-bold py-2 px-4 rounded mb-4"
              >
                Get My Location
              </Button>
              <Button
                type="button"
                onClick={handleAddItem}
                className="w-1/2 justify-center bg-sky-400 shadow-md shadow-sky-500/50 text-white font-bold py-2 px-4 rounded"
              >
                Add Request
              </Button>
            </div>
          </form>
        </Card>

        <Card className="flex-grow overflow-y-auto p-5 bg-white rounded-lg shadow-md max-w-[30%] max-h-fit w-fit">
          <h3 className="text-lg font-bold mb-2 text-gray-700">
            Items in Basket:
          </h3>
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-1 mb-4 flex flex-col items-center gap-2"
            >
              <div className="flex-grow ml-4">
                <p className="font-bold text-lg mb-2">
                  {item.itemName} {item.emoji}
                </p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Reason: {item.reason}</p>
              </div>

              <Button
                onClick={() => handleRemoveItem(index)}
                className="bg-black p-1"
                style={{ width: "30px", height: "30px" }}
              >
                <HiOutlineTrash size="18" />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleSubmit}
            className="w-full bg-sky-400 shadow-md shadow-sky-500/50 text-white font-bold py-2 px-4 rounded"
          >
            Submit Request
          </Button>
        </Card>
      </div>
    </div>
  );
}
