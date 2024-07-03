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
            <div className={styles.donationDetails} key={index}>
              <button
                className={styles.addButton}
                onClick={() => setOpenDialog(true)}
              >
                Request
              </button>
              {donation && openDialogForBasket === donation && (
                <DialogComponent
                  itemKey={JSON.stringify(donation)}
                  openDialog={Boolean(openDialogForBasket)}
                  handleCloseModal={handleCloseModal}
                  otherBasket={donation}
                />
              )}
              <div className={styles.requestItem}>
                <p className={styles.title}>{donation.title}</p>
                <p>{donation.description}</p>
                <p>
                  Expiration Date:{" "}
                  {new Date(
                    donation.items[0].expirationDate
                  ).toLocaleDateString()}
                </p>
                <p>Location: {donation.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedPlaces.map((place, index) => (
        <div className={styles.sidebarPlaces}>
          <div key={index} className={styles.placeWrapper}>
            <div className={styles.placeDetails}>
              <p className={styles.titlePlace}>{place.displayName.text}</p>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedPlaces([])}
              >
                &times;
              </button>
            </div>
            <Dialog>
              <DialogTrigger>
                <Button className={styles.addPlaceButton}>Donate</Button>
              </DialogTrigger>
              <DialogContent className="min-w-fit w-3/4 h-4/5">
                <PaymentPagePlaces
                  userId={userId}
                  placeId={place._id}
                  placeName={place.displayName.text}
                />
              </DialogContent>
            </Dialog>
            <p className={styles.location}>
              <svg
                className={styles.locationIcon}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                width="30px"
                height="30px"
              >
                <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              {place.formattedAddress}
            </p>
            {place.photos && place.photos.length > 0 && (
              <div className={styles.photoSlider}>
                <Slider {...settings}>
                  {place.photos.map((photo, photoIndex) => (
                    <div key={photoIndex} className={styles.slide}>
                      <img
                        src={`https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=400&maxWidthPx=400&key=AIzaSyDlHBXX4KF-W6Dbn4DZySC6y4kfCd3ffeM`}
                        alt={`Photo ${photoIndex}`}
                        className={styles.photo}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="absolute top-5 left-5 z-10 flex items-center justify-start space-x-6">
        <ToggleView viewType={viewType} handleToggleView={handleToggleView} />
        <form className="flex items-center gap-5" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Enter Zipcode, City, or State..."
            className="pl-10 pr-4 py-2 w-[500px] border border-gray-300 rounded-xl"
          />
          <button
            type="submit"
            className="absolute left-64 pl-3 flex items-center pointer-events-none"
          >
            <GoSearch className="h-5 w-5 text-gray-500" />
          </button>
        </form>
      </div>
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
      <div className="absolute top-[25px] right-[20px] h-20">
        <select
          className="ml-4 p-2 border border-gray-300 rounded"
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
        >
          <option value="Donation" className="font-bold">
            Donation
          </option>
          <option value="Request" className="font-bold">
            Request
          </option>
          <option value="Donation and Request" className="font-bold">
            Donation and Request
          </option>
          <option value="Places" className="font-bold">
            Places
          </option>
        </select>
      </div>
    </div>
  );
};

export default MapComponent;
