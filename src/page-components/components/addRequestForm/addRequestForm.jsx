// AddRequestForm.js

import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { useRouter } from "next/router";
import styles from "./AddRequestForm.module.css";

// Add your Mapbox access token

export default function AddRequest({ userId }) {
  const [itemName, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const router = useRouter();
  const mapContainerRef = useRef(null);
  const addressInputRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [0, 0],
      zoom: 1,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for your address",
      types: "address,poi",
      render: function (item) {
        return `<div class='geocoder-dropdown-item'>
                <span class='geocoder-dropdown-text'>
                ${item.place_name}
                </span>
            </div>`;
      },
    });

    geocoder.on("result", (result) => {
      setUserAddress(result.result.place_name);
      addressInputRef.current.value = result.result.place_name;
    });

    map.addControl(geocoder);

    return () => map.remove();
  }, []);

  // Function to handle obtaining user's location
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

  // Function to reverse geocode user's coordinates
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0].place_name;
      setUserAddress(address);
      addressInputRef.current.value = address; // Set the value of the address input field
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!itemName || !quantity) {
      alert("Please fill in the missing boxes");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/api/activeRequest/${userId}`,
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
            userAddress,
          }),
        }
      );

      if (res.ok) {
        router.push("/active-request");
      } else {
        throw new Error("Failed to create a request");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>
          🥰What item would you like to request?🥰
        </h2>
        <label htmlFor="name" className={styles["label-text"]}>
          Item name:
        </label>
        <input
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={itemName}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: Banana"
        />

        <label htmlFor="description" className={styles["label-text"]}>
          Item description (optional):
        </label>
        <input
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: I want banana imported from Vietnam."
        />

        <label htmlFor="quantity" className={styles["label-text"]}>
          Item quantity:
        </label>
        <input
          id="quantity"
          onChange={(e) => setQuantity(e.target.value)}
          value={quantity}
          className={styles["input-field"]}
          type="text"
          placeholder="Ex: 1,2"
        />

        {/* Input field for user address */}
        <label htmlFor="userAddress" className={styles["label-text"]}>
          Your Address:
        </label>
        <div className={styles["address-input-container"]}>
          <input
            id="userAddress"
            ref={addressInputRef}
            className={styles["input-field"]}
            type="text"
            placeholder="Your address"
          />
          <button
            type="button"
            className={styles["get-location-button"]}
            onClick={handleGetUserLocation}
          >
            Get My Location
          </button>
        </div>

        {/* Container element for the map */}
        <div className={styles["map-container"]} ref={mapContainerRef}></div>

        <button type="submit" className={styles["submit-button"]}>
          Add Request
        </button>
      </form>
    </div>
  );
}
