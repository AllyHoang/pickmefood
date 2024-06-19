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

export default function ConfirmationPage({ userId }) {
  const { imageUrl } = useImage();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const { confirmedItems } = router.query;
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
    const itemsWithUserIdAndLocation = items.map((item) => ({
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
          [donationMode ? "items" : "requests"]: itemsWithUserIdAndLocation,
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
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className={styles.confirmationContainer}>
      <ToastContainer />
      <div className={styles.leftPanel}>
        <div className={styles.mapContainer}>
          <div id="map" ref={mapContainerRef} className={styles.map}></div>
        </div>
        <div className={styles.addressContainer}>
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
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.tabsAndCard}>
          <div className={styles.itemTabsContainer}>
            <div className={styles.itemTitle}>
              <p>Item Tabs</p>
            </div>
            <div className={styles.itemTabs}>
              {parsedItems.map((item, index) => (
                <button
                  key={index}
                  className={`${styles.itemTab} ${
                    activeItemIndex === index ? styles.active : ""
                  }`}
                  onClick={() => setActiveItemIndex(index)}
                >
                  {capitalizeFirstLetter(item)}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.itemCard}>
            <label htmlFor="basketTitle" className={styles["label-text"]}>
              Basket name:
            </label>
            <input
              id="basketTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles["input-field"]}
              placeholder={"Enter a name"}
              type="text"
            />
            <div className={styles.basketDescription}>
              <label className={styles["label-text"]}>
                {donationMode ? "Basket Description" : "Basket Reason"}:
              </label>
              <input
                value={donationMode ? basketDescription : basketReason}
                onChange={(e) =>
                  donationMode
                    ? setBasketDescription(e.target.value)
                    : setBasketReason(e.target.value)
                }
                placeholder={
                  donationMode ? "Enter a description" : "Enter a reason"
                }
                className={styles["input-field"]}
              />
            </div>
          </div>
          <div className={styles.itemCard}>
            <div className={styles.itemTitle2}>
              <p>{capitalizeFirstLetter(parsedItems[activeItemIndex])}</p>
            </div>
            <input
              type="text"
              placeholder="Quantity"
              value={itemDetails[activeItemIndex]?.quantity || ""}
              onChange={(e) =>
                handleInputChange(activeItemIndex, "quantity", e.target.value)
              }
              className={styles.inputField}
            />
            {donationMode && (
              <>
                <label
                  htmlFor="expirationDate"
                  className={styles["label-text"]}
                >
                  Expiration date:
                </label>
                <DatePicker
                  selected={
                    itemDetails[activeItemIndex]?.expirationDate || null
                  }
                  onChange={(date) =>
                    handleInputChange(activeItemIndex, "expirationDate", date)
                  }
                  dateFormat="MM/dd/yyyy"
                  className={styles["input-field-date"]}
                />
              </>
            )}
            <div className={styles.donationModeButton}>
              <button
                onClick={handleModeToggle}
                className={styles.toggleButton}
              >
                Switch to {donationMode ? "Request" : "Donation"} Mode
              </button>
              <button onClick={handleSaveItem} className={styles.saveButton}>
                Save Item
              </button>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={handleSubmit} className={styles.submitButton}>
            Submit Items
          </button>
        </div>
      </div>
    </div>
  );
}
