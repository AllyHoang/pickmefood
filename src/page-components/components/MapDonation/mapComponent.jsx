import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./mapComponent.module.css"; // Import the CSS module
import { useRouter } from "next/router";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [donationMarkers, setDonationMarkers] = useState([]);
  const [requestMarkers, setRequestMarkers] = useState([]);
  const router = useRouter();
  const [showDonations, setShowDonations] = useState(true); // State to toggle between rendering donations and requests

  useEffect(() => {
    if (showDonations) {
      fetchDonations();
    } else {
      fetchRequests();
    }
  }, [showDonations]);

  useEffect(() => {
    if (showDonations) {
      if (donations.length > 0 && map) {
        clearMarkers();
        addMarkersToMap();
      }
    } else {
      if (requests.length > 0 && map) {
        clearMarkers();
        addMarkersToMapRequests();
      }
    }
  }, [showDonations, donations, requests, map]);

  const clearMarkers = () => {
    donationMarkers.forEach((marker) => marker.remove());
    requestMarkers.forEach((marker) => marker.remove());
    setDonationMarkers([]);
    setRequestMarkers([]);
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch donations");
      }
      const data = await response.json();
      const geocodedDonations = await geocodeDonations(data.items);
      setDonations(geocodedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/requests");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      const geocodedRequests = await geocodeRequests(data.requests);
      console.log(geocodedRequests);
      setRequests(geocodedRequests);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const geocodeRequests = async (requests) => {
    const geocodedRequests = await Promise.all(
      requests.map(async (request) => {
        const coordinates = await geocodeAddress(request.location);
        if (coordinates.longitude && coordinates.latitude) {
          return {
            ...request,
            coordinates,
          };
        } else {
          return null;
        }
      })
    );
    return geocodedRequests.filter((request) => request !== null);
  };

  const geocodeDonations = async (donations) => {
    const geocodedDonations = await Promise.all(
      donations.map(async (donation) => {
        const coordinates = await geocodeAddress(donation.location);
        if (coordinates.longitude && coordinates.latitude) {
          return {
            ...donation,
            coordinates,
          };
        } else {
          return null;
        }
      })
    );
    return geocodedDonations.filter((donation) => donation !== null);
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          address
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        return { longitude, latitude };
      } else {
        return { longitude: null, latitude: null };
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      return { longitude: null, latitude: null };
    }
  };

  const initializeMap = () => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-74.5, 40], // Default center coordinates
      zoom: 9, // Default zoom level
    });

    mapInstance.on("load", () => {
      setMap(mapInstance);
    });

    // Clean up on component unmount
    return () => mapInstance.remove();
  };

  const addMarkersToMap = () => {
    // Group requests by their coordinates
    const donationsByCoordinates = donations.reduce((acc, donation) => {
      const key = `${donation.coordinates.longitude},${donation.coordinates.latitude}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    }, {});

    const newDonationMarkers = Object.entries(donationsByCoordinates).map(
      ([coordinates, donationsAtLocation]) => {
        const [longitude, latitude] = coordinates.split(",").map(Number);

        const marker = new mapboxgl.Marker({
          color: "#efaeb1", // Change this color to the desired marker color
        })
          .setLngLat([longitude, latitude])
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedDonations(donationsAtLocation);
        });

        return marker;
      }
    );

    setDonationMarkers(newDonationMarkers);
  };

  const addMarkersToMapRequests = () => {
    // Group requests by their coordinates
    const requestsByCoordinates = requests.reduce((acc, request) => {
      const key = `${request.coordinates.longitude},${request.coordinates.latitude}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(request);
      return acc;
    }, {});

    const newRequestMarkers = Object.entries(requestsByCoordinates).map(
      ([coordinates, requestsAtLocation]) => {
        const [longitude, latitude] = coordinates.split(",").map(Number);

        const marker = new mapboxgl.Marker({
          color: "#95d3b7", // Change this color to the desired marker color
        })
          .setLngLat([longitude, latitude])
          .addTo(map);

        marker.getElement().addEventListener("click", () => {
          setSelectedRequests(requestsAtLocation);
        });

        return marker;
      }
    );

    setRequestMarkers(newRequestMarkers);
  };

  const handleSearchChange = async (e) => {
    setSearchValue(e.target.value);
    setSearchError("");

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          e.target.value
        )}.json?access_token=${
          mapboxgl.accessToken
        }&autocomplete=true&types=postcode,place`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        setSuggestions(data.features.map((feature) => feature.place_name));
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchValue) {
      setSearchError("Please enter a Zipcode, City, or State");
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchValue
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [longitude, latitude] = data.features[0].center;
        map.flyTo({ center: [longitude, latitude], zoom: 12 });
      } else {
        setSearchError("Location not found");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchError("Failed to search location");
    }
  };

  useEffect(() => {
    initializeMap();
  }, []);

  return (
    <div className={styles.container}>
      <div id="map" className={styles.mapContainer}></div>
      {selectedRequests.length > 0 && (
        <div className={styles.sidebar}>
          <button
            className={styles.closeButton}
            onClick={() => setSelectedRequests([])}
          >
            &times;
          </button>
          {selectedRequests.map((request, index) => (
            <div className={styles.requestDetails}>
              <div key={index} className={styles.requestItem}>
                <p className={styles.title}>{request.itemName}</p>
                <p>Location: {request.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedDonations.length > 0 && (
        <div className={styles.sidebar}>
          <button
            className={styles.closeButton}
            onClick={() => setSelectedDonations([])}
          >
            &times;
          </button>
          {selectedDonations.map((donation, index) => (
            <div className={styles.donationDetails}>
              <button className={styles.addButton}>Request</button>
              <div key={index} className={styles.requestItem}>
                <p className={styles.title}>{donation.itemName}</p>
                <p>
                  Expiration Date:{" "}
                  {new Date(donation.expirationDate).toLocaleDateString()}
                </p>
                <p>Location: {donation.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Enter Zipcode, City, or State..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => {
                setSearchValue(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {searchError && <p className={styles.error}>{searchError}</p>}
      <button
        onClick={() => setShowDonations((prev) => !prev)}
        className={showDonations ? styles.donationButton : styles.requestButton}
      >
        {showDonations ? "Donations" : "Requests"}
      </button>
    </div>
  );
};

export default MapComponent;
