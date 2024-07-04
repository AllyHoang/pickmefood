import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import { useRouter } from "next/navigation"; // Import useRouter from Next.js
import useUser from "@/hook/useUser";

function EditBasketForm({ basket, userId }) {
  const router = useRouter();
  const { user, error } = useUser(userId); // Fetch user data here
  const [title, setTitle] = useState(basket?.title || "");
  const [description, setDescription] = useState(
    basket?.type === "Donation" ? basket?.description : basket?.reason || ""
  );
  const [location, setLocation] = useState(basket?.location || "");
  const [items, setItems] = useState(
    basket?.type === "Donation" ? basket?.items : basket.requests || []
  );
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(items);
  const [foodItems, setFoodItems] = useState([]);
  const [names, setNames] = useState([]);
  const [emojis, setEmojis] = useState([]);

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

  useEffect(() => {
    const initialSelectedOptions = items.map((item) => {
      const foodItem = foodItems.find((food) => food.name === item.itemName);
      return {
        value: item.itemName,
        label: item.itemName,
        emoji: foodItem ? foodItem.emoji : "",
      };
    });

    setSelectedOptions(initialSelectedOptions);
    setNames(items.map((item) => item.itemName));
    setEmojis(items.map((item) => item.emoji));
  }, [items, foodItems]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  mapboxgl.accessToken =
    "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

  const handleItemChange = (selectedOption, index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = selectedOption;
    const newNames = [...names];
    newNames[index] = selectedOption.value;
    const newEmojis = [...emojis];
    const selectedFoodItem = foodItems.find(
      (item) => item.name === selectedOption.value
    );
    newEmojis[index] = selectedFoodItem.emoji;
    setNames(newNames);
    setEmojis(newEmojis);
    setSelectedOptions(newSelectedOptions);

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      itemName: selectedOption.value,
      emoji: selectedOption.emoji, // assuming selectedOption has an emoji property
    };
    setItems(newItems);
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
  };

  const handleSave = async () => {
    try {
      const payload = {
        title,
        description,
        location,
        items,
      };

      if (basket.type === "Donation") {
        payload.description = description;
      } else if (basket.type === "Request") {
        payload.reason = description;
      }

      let response;
      if (basket.type === "Donation") {
        response = await fetch(`/api/changeBaskets/${basket._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else if (basket.type === "Request") {
        response = await fetch(`/api/changeBasketRequests/${basket._id}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (response.ok) {
        const updatedBasket = await response.json();
        router.refresh(); // Use username from useUser hook
      } else {
        const errorData = await response.json();
        console.error("Error updating basket:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating basket:", error);
    }
  };

  return (
    <div>
      <h2 className="text-heading2-bold mb-4 text-sky-500">Edit Basket</h2>
      <label className="block mb-3 font-medium">
        <p className="text-lg font-semibold text-gray-800 mb-2"> Title </p>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block mb-3 ">
        <p className="text-lg font-semibold text-gray-800 mb-2"> Description</p>
        <textarea
          className="w-full border rounded p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <label className="block mb-3 font-medium">
        <p className="text-lg font-semibold text-gray-800 mb-2"> Location</p>

        <input
          type="text"
          className="w-full border rounded p-2"
          value={location}
          onChange={handleAddressChange}
        />
      </label>
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

      <h3 className="text-heading3-bold mb-4">Items</h3>

      {items?.map((item, index) => (
        <div key={index} className="flex gap-5">
          <label className="w-44">
            <p className="text-lg font-semibold text-gray-800 mb-2"> Title </p>
            <Select
              options={foodItems.map((choice) => ({
                value: choice.name,
                label: choice.name,
                emoji: choice.emoji,
              }))}
              value={selectedOptions[index]}
              onChange={(selectedOption) =>
                handleItemChange(selectedOption, index)
              }
              className="w-full mb-2"
            />
          </label>
          <label className="w-14">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              {" "}
              Quantity{" "}
            </p>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={item.quantity}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].quantity = e.target.value;
                setItems(newItems);
              }}
            />
          </label>
          {basket?.type === "Donation" && (
            <label className="block mb-2">
              Expiry Date
              <input
                type="date"
                className="w-full border rounded p-2"
                value={item.expirationDate}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[index].expirationDate = e.target.value;
                  setItems(newItems);
                }}
              />
            </label>
          )}
        </div>
      ))}
      <div className="flex justify-end gap-2">
        <Button className="bg-sky-400" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default EditBasketForm;
