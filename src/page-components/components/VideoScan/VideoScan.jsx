// VideoScan.js

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import styles from "./VideoScan.module.css";
import { useImage } from "@/lib/ImageContext";
import { CldUploadButton } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RxCross2 } from "react-icons/rx";
import AddItem from "../addItemForm/addItemForm";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { useSelector } from "react-redux";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let socket;

const VideoScan = ({ userId }) => {
  const { setImageUrl } = useImage();
  const [connected, setConnected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [uploadImageChecked, setUploadImageChecked] = useState(false);
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // Renamed state variable
  const router = useRouter();
  const { currentUser } = useSelector((state) => state.user);
  const [beginCamera, setBeginCamera] = useState(false);

  const { confirmedItems: confirmedItemsFromQuery } = router.query;

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
    });

    socket.on("video_frame", (data) => {
      if (videoRef.current) {
        videoRef.current.src = `data:image/jpeg;base64,${data.frame}`;
      }
      setDetectedItems(data.detected_items);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const startVideo = () => {
    if (connected) {
      setBeginCamera(true);
      setProcessing(true);
      socket.emit("start_video");
    }
  };

  const stopVideo = () => {
    if (connected) {
      setProcessing(false);
      socket.emit("stop_video");
    }
  };

  const handleItemCheck = (item) => {
    if (!confirmedItems.includes(item)) {
      setConfirmedItems([...confirmedItems, item]);
    }
  };

  const handleItemUncheck = (item) => {
    setConfirmedItems(confirmedItems.filter((i) => i !== item));
  };

  const handleRemoveItem = (item) => {
    setConfirmedItems(confirmedItems.filter((i) => i !== item));
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
        setImageUrl(prediction.output[prediction.output.length - 1]);
      }
    } catch (error) {
      console.error("Error generating image with Replicate:", error);
      return null;
    }
  };

  const handleCheckboxChange = (e) => {
    setUploadImageChecked(e.target.checked);
  };

  const navigateToConfirmation = async () => {
    setProcessing(false);
    socket.emit("stop_video");
    router.push({
      pathname: "",
      query: {
        confirmedItems: JSON.stringify([...confirmedItems]),
      },
    });
  };

  const handleUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setImageUrl(uploadedUrl);
    setGeneratedImageUrl(uploadedUrl);
  };

  return confirmedItemsFromQuery ? (
    <AddItem userId={userId} itemsFromQuery={confirmedItemsFromQuery} />
  ) : (
    <div className="flex flex-col gap-6 overflow-auto h-full pb-16">
      <div className="base-container">
        <Breadcrumbs
          crumbs={[
            {
              title: "Profile",
              href: `/profile?username=${currentUser?.username}`,
            },
            { title: "Add Donation With Video" },
          ]}
          className="text-small-medium mt-8"
        />
      </div>
      <div className="mx-auto flex flex-col items-center gap-2 mt-6">
        <h1 className="text-heading2-bold text-gray-700">Scan with video</h1>
        <p className="text-body-medium font-normal">
          We will detect items from your webcam and use them to create a
          donation.
        </p>
        <p className="text-base-light text-gray-500">
          Want a different way? Try
          <a
            href="/add-item"
            className="underline underline-offset-2 hover:text-blue-400"
          >
            {" "}
            creating manually
          </a>
          <a
            href="/image-scan"
            className="underline underline-offset-2 hover:text-blue-400"
          >
            {" "}
            or do a image scan
          </a>
        </p>
      </div>
      <div className="flex items-center gap-2 mx-auto">
        <Button
          className="bg-sky-400 hover:bg-sky-500"
          onClick={startVideo}
          disabled={processing}
        >
          {processing ? "Scanning..." : "Start camera"}
        </Button>
        <Button
          variant="destructive"
          onClick={stopVideo}
          disabled={!processing}
        >
          Pause camera
        </Button>
      </div>
      <div className="grid grid-cols-2 base-container self-center gap-8 w-full flex-1 mt-2">
        <div className="col-span-1">
          {!beginCamera ? (
            <div className="h-full border border-dashed flex flex-col gap-1 items-center justify-center rounded p-8">
              <p className="text-muted-foreground text-center">
                When you start the camera, the live view will be here.
              </p>
              <Button
                className="bg-sky-400 hover:bg-sky-500 mt-4"
                onClick={startVideo}
              >
                Start camera
              </Button>
            </div>
          ) : (
            <div className={styles.videoContainer}>
              <img
                ref={videoRef}
                alt="Video Stream"
                className={styles.videoStream}
              />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-8 h-full">
          <Card className="flex flex-col max-h-72 h-[35%] overflow-hidden">
            <CardHeader className="text-base-bold pb-2">
              <CardTitle>Detected items</CardTitle>
              <CardDescription
                className="text-small-medium"
                style={{ fontWeight: "400" }}
              >
                <p className="text-muted-foreground">
                  Tick to choose the items
                </p>
              </CardDescription>
            </CardHeader>
            <div className="flex-1 overflow-y-scroll px-6">
              {detectedItems.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    When detected, the items will automatically appear here.
                  </p>
                </div>
              ) : (
                <ul className="list-none p-0 m-0">
                  {detectedItems.map((item, index) => (
                    <li
                      key={index}
                      className={`flex items-center ${
                        index !== detectedItems.length - 1
                          ? "border-b border-gray-300 py-2"
                          : "pt-2 pb-3"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`item-${index}`}
                        onChange={(e) =>
                          e.target.checked
                            ? handleItemCheck(item)
                            : handleItemUncheck(item)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor={`item-${index}`}
                        className="text-gray-700"
                      >
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
          <Card className="flex flex-col flex-1 overflow-hidden">
            <CardHeader className="text-base-bold">
              <CardTitle>Confirmed items</CardTitle>
            </CardHeader>
            <div className="flex-1 overflow-y-scroll px-6 max-h-64">
              {confirmedItems.length === 0 ? (
                <div className="h-full flex flex-col justify-center">
                  <p className="text-center text-muted-foreground">
                    Please choose at least one item.
                  </p>
                </div>
              ) : (
                <ul className="list-none p-0 m-0">
                  {confirmedItems.map((item, index) => (
                    <li
                      key={item}
                      className={`flex items-center gap-2 ${
                        index !== confirmedItems.length - 1
                          ? "border-b border-gray-300 py-2"
                          : "pt-2 pb-4"
                      }`}
                    >
                      <RxCross2
                        className="text-red-500"
                        role="button"
                        onClick={() => handleRemoveItem(item)}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <Button
              onClick={navigateToConfirmation}
              className="bg-sky-400 mx-6 mt-auto mb-4"
              disabled={[...confirmedItems].length === 0}
            >
              Go to confirmation page
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoScan;
