import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddRequestForm.module.css";
import Select from "react-select";

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
        router.push("/active-request");
      } else {
        throw new Error("Failed to create an item");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error creating item");
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <label htmlFor="name" className={styles["label-text"]}>
          Item name:
        </label>
        <Select
          options={[
            ...foodItems.map((item) => ({
              value: item.name,
              label: item.name,
            })),
            { value: "Add new item", label: "Add new item" },
          ]}
          value={selectedOption}
          onChange={handleItemChange}
          styles={{
            width: "200px",
          }}
        />
        {showNewItemInput && (
          <div className={styles["new-item-container"]}>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Enter new item name"
              className={styles["input-field"]}
            />
            <button
              type="button"
              onClick={handleNewItemSubmit}
              className={styles["submit-button"]}
            >
              Add New Item
            </button>
          </div>
        )}
        <label htmlFor="reason" className={styles["label-text"]}>
          Reason for item (optional):
        </label>
        <input
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: I need it for groceries"
        />

        <label htmlFor="quantity" className={styles["label-text"]}>
          Item quantity:
        </label>
        <input
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: 1,2"
        />

        <label htmlFor="userAddress" className={styles["label-text"]}>
          Your Address:
        </label>
        <input
          id="userAddress"
          value={userAddress}
          onChange={handleAddressChange}
          className={styles["input-field"]}
          type="text"
          placeholder="Enter your address"
        />
        <ul className={styles.suggestions}>
          {addressSuggestions.map((address, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(address)}
              className={styles.suggestion}
            >
              {address}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={handleGetUserLocation}
          className={`${styles["get-location-button"]} ${styles["blue-text"]}`}
        >
          Get My Location
        </button>
        <button
          type="submit"
          onClick={handleAddItem}
          className={styles["submit-button"]}
        >
          Add Request
        </button>
      </form>
      <div className={styles["items-list"]}>
        <h3>Items in Basket:</h3>
        {items.map((item, index) => (
          <div key={index} className={styles["item-card"]}>
            <div className={styles["item-details"]}>
              <p className={styles["item-name"]}>
                {item.itemName} {item.emoji}
              </p>
              <p className={styles["item-quantity"]}>
                Quantity: {item.quantity}
              </p>
              <p className={styles["item-reason"]}>Reason: {item.reason}</p>
            </div>
            <button
              onClick={() => handleRemoveItem(index)}
              className={styles["remove-button"]}
            >
              Remove
            </button>
          </div>
        ))}
        <button onClick={handleSubmit} className={styles["submit-button"]}>
          Submit Basket
        </button>
      </div>
      <div id="map" className={styles.map}></div>
    </div>
  );
}
