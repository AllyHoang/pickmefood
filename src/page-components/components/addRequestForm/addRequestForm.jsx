import { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TiDeleteOutline } from "react-icons/ti";
import { Badge } from "@/components/ui/badge";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import "mapbox-gl/dist/mapbox-gl.css";
import { CldUploadButton } from "next-cloudinary";
import Link from "next/link";
import { CiTrash } from "react-icons/ci";
import Image from "next/image";
import Breadcrumbs from "@/components/ui/breadcrumbs";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AddRequest({ userId }) {
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [itemName, setName] = useState("");
  const [title, setTitle] = useState("");
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
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

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

  const handleUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setUploadedUrl(uploadedUrl);
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

  const generateReplicateImage = async (prompt) => {
    try {
      const response = await fetch("/api/replicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image with Replicate API");
      }
      let prediction = await response.json();
      console.log(prediction);
      if (response.status !== 201) {
        setError(prediction.detail);
        return;
      }
      setPrediction(prediction);

      while (
        prediction.status !== "succeeded" &&
        prediction.status !== "failed"
      ) {
        await sleep(1000);
        const response = await fetch("/api/replicate/" + prediction.id);
        prediction = await response.json();
        if (response.status !== 200) {
          setError(prediction.detail);
          return;
        }
        console.log({ prediction });
        setPrediction(prediction);
      }
      if (prediction.status == "succeeded") {
        setUploadedUrl(prediction.output[prediction.output.length - 1]);
      }
    } catch (error) {
      console.error("Error generating image with Replicate:", error);
      return null;
    }
  };

  const handleAddItem = () => {
    if (!itemName || !quantity) {
      toast.error("Please fill in all the required fields");
      return;
    }
    const newItem = {
      itemName,
      quantity,
      address: userAddress,
      emoji,
    };
    setItems([...items, newItem]);
    setName("");
    setQuantity("");
    setSelectedOption(null);
  };
  const handleRemoveImage = () => {
    setUploadedUrl(!uploadedUrl);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if an image has been uploaded or generated
      if (!uploadedUrl) {
        // If not, generate the image
        const prompt = `Generate an image that includes the following items: ${items
          .map((item) => item.itemName)
          .join(", ")}`;
        await generateReplicateImage(prompt);
      }

      // Check if items array is empty
      if (items.length === 0) {
        toast.error("Please add at least one item");
        return;
      }

      // Prepare items with additional data
      const itemsWithUserId = items.map((item) => ({
        ...item,
        userId,
        emoji: item.emoji || "", // Ensure emoji is provided
      }));

      // Submit request to API
      const res = await fetch(`/api/requests`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId,
          requests: itemsWithUserId,
          title,
          reason,
          location: userAddress,
          image: uploadedUrl,
        }),
      });

      if (res.ok) {
        toast.success("Create Request Successfully");
        router.push(`/${currentUser?.username}`);
      } else {
        throw new Error("Failed to create request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error submitting request");
    }
  };

  return (
    <div className="flex flex-col overflow-hidden h-screen">
      <div className="base-container flex flex-1 flex-col items-center gap-2 overflow-y-scroll pb-4">
        <ToastContainer />
        <Breadcrumbs
          crumbs={[
            {
              title: "Profile",
              href: `/profile?username=${currentUser?.username}`,
            },
            { title: "Add Request" },
          ]}
          className="self-start text-small-medium"
        />
        <h1 className="self-start text-heading2-bold text-gray-700 mt-2 mb-4">
          Add Request
        </h1>
        <div className="grid grid-cols-2 w-full self-center gap-10">
          <Card className="flex flex-col h-fit w-full">
            <form onSubmit={handleSubmit} className="p-5 bg-white rounded-lg">
              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="name" className="font-medium text-gray-700">
                  Item name
                </label>
                <Select
                  options={foodItems.map((item) => ({
                    value: item.name,
                    label: item.name,
                  }))}
                  value={selectedOption}
                  onChange={handleItemChange}
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label htmlFor="quantity" className="font-medium text-gray-700">
                  Item quantity
                </label>
                <Input
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full mb-2"
                  type="number"
                  placeholder="e.g., 3"
                />
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <label
                  htmlFor="userAddress"
                  className="font-medium text-gray-700"
                >
                  Your address
                </label>
                <Input
                  id="userAddress"
                  value={userAddress}
                  onChange={handleAddressChange}
                  className="w-full mb-4"
                  type="text"
                  placeholder="e.g., 235 Randolph PL, Windsor, Ontario, N9B2T3"
                />

                {addressSuggestions.length > 0 && (
                  <div className="relative w-full">
                    <ul className="absolute z-10 top-0 w-full bg-white border border-gray-300 rounded-lg max-h-48 overflow-y-auto mb-2">
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
                  </div>
                )}
              </div>
              <div
                id="map"
                className="bg-gray-200 rounded-lg shadow-lg h-72 mb-3"
              ></div>
              <div className="flex flex-row justify-between">
                <span
                  role="button"
                  onClick={handleGetUserLocation}
                  className="text-small-medium text-muted-foreground hover:underline pt-0"
                >
                  Get my location
                </span>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="w-fit justify-center bg-sky-400 hover:bg-sky-500"
                >
                  Add Request
                </Button>
              </div>
            </form>
          </Card>
          <Card className="flex flex-col overflow-y-auto h-fit w-full pt-5 px-5 pb-4">
            <div className="mb-2">
              <div className="flex flex-col gap-2 mb-3">
                <p className="font-medium text-gray-700">Basket image</p>
                {!uploadedUrl && (
                  <div>
                  <CldUploadButton
                    className="flex flex-col w-full"
                    options={{ maxFiles: 1 }}
                    folder="images"
                    onSuccess={handleUploadSuccess}
                    onFailure={(error) =>
                      console.error("Cloudinary upload error:", error)
                    }
                    uploadPreset="zoa1vsa7"
                  >
                    <div className="flex flex-row justify-start gap-1">
                      <p className="text-small-medium text-gray-700">
                        Upload image
                      </p>
                      <IoCloudUploadOutline size={22} />
                    </div>
                  </CldUploadButton>
                  <p className="text-small-medium text-muted-foreground mt-1">
                      If you do not upload your photo, system will
                      automatically generate based on your items
                    </p>
                  </div>
                )}
              </div>
              {uploadedUrl && (
                <div className="flex flex-row justify-start gap-1">
                  <div className="w-32 h-32 rounded relative mb-2">
                    <Image
                      fill
                      className="object-cover object-top"
                      src={uploadedUrl || externalImageSource}
                      alt="Photo of basket"
                    />
                  </div>
                  <a href="#" onClick={handleRemoveImage}>
                    <TiDeleteOutline size={24} />
                  </a>
                </div>
              )}
              <div className="flex flex-col gap-2 mb-3">
                <label
                  htmlFor="basketTitle"
                  className="font-medium text-gray-700"
                >
                  Basket title
                </label>
                <Input
                  id="basketTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mb-2"
                  type="text"
                  placeholder="e.g., Request form a broke student"
                />
              </div>
              <div className="flex flex-col gap-2 mb-3">
                <label
                  htmlFor="basketDescription"
                  className="font-medium text-gray-700"
                >
                  Request reason
                </label>
                <textarea
                  id="basketReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border-2 rounded-lg p-2"
                  type="text"
                  placeholder="e.g., I really need these items to survive this week"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-700">
              Items in basket{" "}
              {items.length > 0 && (
                <span className="text-muted-foreground text-lg">
                  ({items.length})
                </span>
              )}
            </h3>
            {items.map((item, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg p-1 mb-2 self-center gap-3 w-full"
              >
                <div className="flex flex-row justify-between p-1">
                  <div className="flex flex-row justify-start gap-2">
                    <Badge className="bg-emerald-100 flex items-center w-fit h-fit m-2">
                      {item.emoji}
                    </Badge>
                    <div className="flex flex-col">
                      <p className="text-gray-700 text-base-medium">
                        {item.itemName}
                      </p>
                      <p className="text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <a onClick={() => handleRemoveItem(index)} className="mr-2">
                      <CiTrash size="25" style={{ color: "8585AB" }} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <footer className="sticky bottom-0 bg-white border-t-2 w-full p-6 shadow-md">
        <div className="flex flex-row justify-end gap-4">
          <Link href={`/${currentUser?.username}`}>
            <Button variant="secondary">Cancel</Button>
          </Link>
          <Button
            onClick={handleSubmit}
            className="w-fit bg-sky-400 hover:bg-sky-500 rounded-lg"
          >
            Create Basket
          </Button>
        </div>
      </footer>
    </div>
  );
}
