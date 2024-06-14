// components/AddItemForm.js
import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddItemForm.module.css";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HiOutlineTrash } from "react-icons/hi";
import "mapbox-gl/dist/mapbox-gl.css";

export default function AddItem({ userId }) {
  const [itemName, setName] = useState("");
  const [emoji, setEmoji] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [items, setItems] = useState([]);
  const router = useRouter();

  mapboxgl.accessToken =
    "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

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
    async function fetchFoodData() {
      try {
        const res = await fetch(`/api/food`, {
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
    setSelectedOption(selectedOption);
    setName(selectedOption.value);
    const selectedFoodItem = foodItems.find(
      (item) => item.name === selectedOption.value
    );
    setEmoji(selectedFoodItem.emoji);
  };

  const handleAddItem = () => {
    if (!itemName || !quantity || !expirationDate) {
      toast.error("Please fill in all the required fields");
      return;
    }
    const newItem = {
      itemName,
      description,
      quantity,
      expirationDate,
      address: userAddress,
      emoji: emoji,
    };

    setItems([...items, newItem]);
    setName("");
    setDescription("");
    setQuantity("");
    setExpirationDate(null);
    setSelectedOption(null);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
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
      location: userAddress, // Ensure location is provided for each item
    }));

    try {
      const res = await fetch(`/api/items`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          items: itemsWithUserIdAndLocation,
        }),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        throw new Error("Failed to create a basket");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="flex flex-col items-center w-full p-2 gap-2 min-w-fit max-h-max overflow-hidden">
      <ToastContainer />

      <div className="flex justify-between w-full max-w-fit gap-6 flex-grow overflow-y-auto">
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

            <label
              htmlFor="description"
              className="font-bold text-gray-700 mb-2"
            >
              Item description (optional):
            </label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4"
              type="text"
              placeholder="Ex: Delicious but I don't want it"
            />
            <div className="flex flex-row gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="quantity"
                  className="font-bold text-gray-700 mb-2"
                >
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
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="expirationDate"
                  className="font-bold text-gray-700 mb-2"
                >
                  Item expiration date:
                </label>
                <DatePicker
                  selected={expirationDate}
                  onChange={(date) => setExpirationDate(date)}
                  dateFormat="MM/dd/yyyy"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                />
              </div>
            </div>

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
                Add Item
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
                <p className="text-gray-600">
                  Expiration Date: {item.expirationDate.toLocaleDateString()}
                </p>
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
            Create Basket
          </Button>
        </Card>
      </div>
    </div>
  );
}
