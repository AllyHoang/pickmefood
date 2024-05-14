import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddItemForm.module.css";

// Add your Mapbox access token here

export default function AddItem({ userId }) {
  const [itemName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
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
        const data = await response.json();
        setFoodItems(data.foodItems);
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    }

    fetchFoodData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !quantity || !expirationDate) {
      toast.error("Please fill in all the required fields");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/activeItem/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId,
            itemName,
            description,
            quantity,
            expirationDate,
            userAddress,
          }),
        }
      );

      if (res.ok) {
        router.push("/active-donation");
      } else {
        throw new Error("Failed to create an item");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>
          🥰 What item would you like to donate? 🥰
        </h2>
        <label htmlFor="name" className={styles["label-text"]}>
          Item name:
        </label>
        <select
          id="name"
          value={itemName}
          onChange={(e) => setName(e.target.value)}
          className={styles["input-field"]}
        >
          <option value="">Select item</option>
          {foodItems.map((category) => (
            <optgroup key={category.category} label={category.category}>
              {category.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
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
        <input
          id="expirationDate"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          className={styles["input-field"]}
          type="text"
          placeholder="Format: 04/05/24"
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

        <div id="map" className={styles.map}></div>

        <button type="submit" className={styles["submit-button"]}>
          Add Item
        </button>
      </form>
    </div>
  );
}
