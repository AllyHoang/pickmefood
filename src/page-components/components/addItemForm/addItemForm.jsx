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
        router.push("/active-donation");
      } else {
        throw new Error("Failed to create a basket");
      }
    } catch (error) {
      console.error("Error:", error);
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
          options={foodItems.map((item) => ({
            value: item.name,
            label: item.name,
          }))}
          value={selectedOption}
          onChange={handleItemChange}
        />
        <label htmlFor="description" className={styles["label-text"]}>
          Item description (optional):
        </label>
        <input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: Delicious but I don't want it"
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

        <label htmlFor="expirationDate" className={styles["label-text"]}>
          Item expiration date:
        </label>
        <DatePicker
          selected={expirationDate}
          onChange={(date) => setExpirationDate(date)}
          dateFormat="MM/dd/yyyy"
          className={styles["input-field-date"]}
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
          type="button"
          onClick={handleAddItem}
          className={styles["submit-button"]}
        >
          Add Item
        </button>
      </form>

      <div className={styles["items-list"]}>
        <h3>Items in Basket:</h3>
        {items.map((item, index) => (
          <div key={index} className={styles["item-card"]}>
            <div className={styles["item-details"]}>
              <p className={styles["item-name"]}>{item.itemName}</p>
              <p className={styles["item-quantity"]}>
                Quantity: {item.quantity}
              </p>
              <p className={styles["item-expiration"]}>
                Expiration Date: {item.expirationDate.toLocaleDateString()}
              </p>
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
          Create Basket
        </button>
      </div>
      <div id="map" className={styles.map}></div>
    </div>
  );
}
