import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./mapComponent.module.css"; // Import the CSS module
import { useRouter } from "next/router";
import ToggleView from "../DashboardPage/ToggleView";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; // Slick slider styles
import "slick-carousel/slick/slick-theme.css"; // Slick slider theme styles
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DialogComponent from "../DashboardPage/DialogComponent";
import PaymentPagePlaces from "../CheckOutForm/PaymentPagePlaces";
import useFetchAllBaskets from "@/hook/useFetchAllBaskets";
import { GoSearch } from "react-icons/go";

mapboxgl.accessToken =
  "pk.eyJ1IjoicGlja21lZm9vZCIsImEiOiJjbHZwbHdyMzgwM2hmMmtvNXJ6ZHU2NXh3In0.aITfZvPY-sKGwepyPVPGOg";

const MapComponent = ({ userId }) => {
  const { baskets, isLoading } = useFetchAllBaskets();
  const [map, setMap] = useState(null);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [places, setPlaces] = useState([]);
  const [viewType, setViewType] = useState("map");
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [donationMarkers, setDonationMarkers] = useState([]);
  const [openDialogForBasket, setOpenDialogForBasket] = useState(null);
  const [requestMarkers, setRequestMarkers] = useState([]);
  const [placesMarkers, setPlacesMarkers] = useState([]);
  const router = useRouter();
  const [selectedView, setSelectedView] = useState("Donation");

  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
  };

  const handleToggleView = () => {
    if (viewType === "list") {
      setViewType("map");
      router.push("/map-view", undefined, { shallow: true });
    } else {
      setViewType("list");
      router.push("/dashboard", undefined, { shallow: true });
    }
  };

  const handleOpenDialog = (request) => {
    setOpenDialogForBasket(request);
  };

  const handleCloseModal = () => {
    setOpenDialogForBasket(null);
  };

  useEffect(() => {
    switch (selectedView) {
      case "Donation":
        fetchDonations();
        break;
      case "Request":
        fetchRequests();
        break;
      case "Donation and Request":
        fetchDonations();
        fetchRequests();
        break;
      case "Places":
        fetchPlaces();
        break;
      default:
        break;
    }
  }, [selectedView]);

  useEffect(() => {
    if (selectedView === "Donation") {
      if (donations.length > 0 && map) {
        clearMarkers();
        addMarkersToMap();
      }
    }

    if (selectedView === "Request") {
      if (requests.length > 0 && map) {
        clearMarkers();
        addMarkersToMapRequests();
      }
    }

    if (selectedView === "Donation and Request") {
      if (requests.length > 0 && map) {
        clearMarkers();
        addMarkersToMap();
        addMarkersToMapRequests();
      }
    }

    if (selectedView === "Places") {
      if (places.length > 0 && map) {
        clearMarkers();
        addMarkersToMapPlaces();
      }
    }
  }, [selectedView, donations, requests, places, map]);

  const clearMarkers = () => {
    donationMarkers.forEach((marker) => marker.remove());
    requestMarkers.forEach((marker) => marker.remove());
    placesMarkers.forEach((marker) => marker.remove());
    setDonationMarkers([]);
    setRequestMarkers([]);
    setPlacesMarkers([]);
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch("/api/baskets");
      if (!response.ok) {
        throw new Error("Failed to fetch donations");
      }
      const data = await response.json();
      const geocodedDonations = await geocodeDonations(data.baskets);
      console.log(data.baskets);
      setDonations(geocodedDonations);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/basketrequests");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      const geocodedRequests = await geocodeRequests(data.baskets);
      console.log(geocodedRequests);
      setRequests(geocodedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await fetch("/api/places");
      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      const data = await response.json();
      const geocodedPlaces = await geocodePlaces(data.places);
      console.log(geocodedPlaces);
      setPlaces(geocodedPlaces);
    } catch (error) {
      console.error("Error fetching places:", error);
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

  const geocodePlaces = async (places) => {
    const geocodedPlaces = await Promise.all(
      places.map(async (place) => {
        const coordinates = await geocodeAddress(place.formattedAddress);
        if (coordinates.longitude && coordinates.latitude) {
          return {
            ...place,
            coordinates,
          };
        } else {
          return null;
        }
      })
    );
    console.log(geocodedPlaces);
    return geocodedPlaces.filter((place) => place !== null);
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
    // Group donations by their coordinates
    const donationsByCoordinates = donations.reduce((acc, donation) => {
      const key = `${donation.coordinates.longitude},${donation.coordinates.latitude}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    }, {});

    // Create a marker for each coordinate group
    const markers = Object.keys(donationsByCoordinates).map((key) => {
      const donations = donationsByCoordinates[key];
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      const coordinates = key.split(",").map((str) => parseFloat(str));
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          popup.setHTML(
            `<div>
                <h3>Donations</h3>
                <ul>
                  ${donations
                    .map((donation) => `<li>${donation.item}</li>`)
                    .join("")}
                </ul>
              </div>`
          )
        )
        .addTo(map);

      return marker;
    });

    setDonationMarkers(markers);
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

    // Create a marker for each coordinate group
    const markers = Object.keys(requestsByCoordinates).map((key) => {
      const requests = requestsByCoordinates[key];
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      const coordinates = key.split(",").map((str) => parseFloat(str));
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          popup.setHTML(
            `<div>
                <h3>Requests</h3>
                <ul>
                  ${requests
                    .map((request) => `<li>${request.item}</li>`)
                    .join("")}
                </ul>
              </div>`
          )
        )
        .addTo(map);

      return marker;
    });

    setRequestMarkers(markers);
  };

  const addMarkersToMapPlaces = () => {
    // Create a marker for each place
    const markers = places.map((place) => {
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      const coordinates = [
        place.coordinates.longitude,
        place.coordinates.latitude,
      ];
      const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .setPopup(
          popup.setHTML(
            `<div>
                <h3>Places</h3>
                <p>${place.formattedAddress}</p>
              </div>`
          )
        )
        .addTo(map);

      return marker;
    });

    setPlacesMarkers(markers);
  };

  useEffect(() => {
    initializeMap();
  }, []);

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    setSearchValue(value);
    if (value.trim().length > 0) {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(value)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }
        const data = await response.json();
        setSuggestions(data.results);
        setSearchError("");
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSearchError("Failed to fetch suggestions. Please try again later.");
      }
    } else {
      setSuggestions([]);
      setSearchError("");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleSelectRequest = (request) => {
    setSelectedRequests([request]);
  };

  const handleSelectDonation = (donation) => {
    setSelectedDonations([donation]);
  };

  const handleSelectPlace = (place) => {
    setSelectedPlaces([place]);
  };

  const handleViewTypeChange = (event) => {
    setViewType(event.target.value);
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.sidebar}>
        <ToggleView
          viewType={viewType}
          onViewTypeChange={handleViewTypeChange}
          className={styles.toggleView}
        />
        <div className={styles.searchContainer}>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <GoSearch />
            </button>
          </form>
          {searchError && <p className={styles.error}>{searchError}</p>}
          <div className={styles.suggestions}>
            {suggestions.map((suggestion) => (
              <p key={suggestion.id} className={styles.suggestion}>
                {suggestion.name}
              </p>
            ))}
          </div>
        </div>
        {viewType === "list" && (
          <div className={styles.listContainer}>
            <Slider {...settings}>
              {selectedView === "Donation" &&
                donations.map((donation) => (
                  <div key={donation._id} className={styles.slide}>
                    <h3>{donation.item}</h3>
                    <p>{donation.description}</p>
                    <Button onClick={() => handleSelectDonation(donation)}>
                      Select
                    </Button>
                  </div>
                ))}
              {selectedView === "Request" &&
                requests.map((request) => (
                  <div key={request._id} className={styles.slide}>
                    <h3>{request.item}</h3>
                    <p>{request.description}</p>
                    <Button onClick={() => handleSelectRequest(request)}>
                      Select
                    </Button>
                  </div>
                ))}
              {selectedView === "Donation and Request" &&
                [...donations, ...requests].map((item) => (
                  <div key={item._id} className={styles.slide}>
                    <h3>{item.item}</h3>
                    <p>{item.description}</p>
                    {item.type === "donation" ? (
                      <Button onClick={() => handleSelectDonation(item)}>
                        Select
                      </Button>
                    ) : (
                      <Button onClick={() => handleSelectRequest(item)}>
                        Select
                      </Button>
                    )}
                  </div>
                ))}
              {selectedView === "Places" &&
                places.map((place) => (
                  <div key={place._id} className={styles.slide}>
                    <h3>{place.name}</h3>
                    <p>{place.formattedAddress}</p>
                    <Button onClick={() => handleSelectPlace(place)}>
                      Select
                    </Button>
                  </div>
                ))}
            </Slider>
          </div>
        )}
      </div>
      <div id="map" className={styles.map}></div>
      {openDialogForBasket && (
        <DialogComponent
          isOpen={openDialogForBasket !== null}
          onDismiss={handleCloseModal}
          modalProps={{
            title: "Your Basket",
            subtitle: "Please Select",
            description: "Your Basket",
          }}
        >
          <DialogContent>
            <PaymentPagePlaces />
          </DialogContent>
        </DialogComponent>
      )}
    </div>
  );
};

export default MapComponent;
