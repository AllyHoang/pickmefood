import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import styles from "./VideoScan.module.css";
import { useImage } from "@/lib/ImageContext";
import { CldUploadButton } from "next-cloudinary";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let socket;

const VideoScan = () => {
  const { setImageUrl } = useImage();
  const [connected, setConnected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const videoRef = useRef(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null); // Renamed state variable
  const router = useRouter();

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

  const navigateToConfirmation = async () => {
    if (confirmedItems.length > 0 && generatedImageUrl == null) {
      const prompt = `Generate an image that includes the following items: ${confirmedItems.join(
        ", "
      )}`;
      generateReplicateImage(prompt);
    }
    setProcessing(false);
    socket.emit("stop_video");
    router.push({
      pathname: "/confirmation",
      query: { confirmedItems: JSON.stringify(confirmedItems) },
    });
  };

  const handleUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setImageUrl(uploadedUrl);
    setGeneratedImageUrl(uploadedUrl);
  };

  return (
    <div className={styles.videoScanContainer}>
      <h1 className={styles.title}>Real-Time Object Detection</h1>
      <div className={styles.buttons}>
        <button
          onClick={startVideo}
          disabled={processing}
          className={styles.startButton}
        >
          {processing ? "Scanning..." : "Start Video"}
        </button>
        <button
          onClick={stopVideo}
          disabled={!processing}
          className={styles.stopButton}
        >
          Stop Video
        </button>
      </div>
      <div className={styles.videoContainer}>
        <img ref={videoRef} alt="Video Stream" className={styles.videoStream} />
      </div>
      <div className={styles.detectedItems}>
        <h2>Detected Items</h2>
        <ul>
          {detectedItems.map((item, index) => (
            <li key={index}>
              <input
                type="checkbox"
                id={`item-${index}`}
                onChange={(e) =>
                  e.target.checked
                    ? handleItemCheck(item)
                    : handleItemUncheck(item)
                }
              />
              <label htmlFor={`item-${index}`}>{item}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.confirmedItems}>
        <h2>Confirmed Items</h2>
        <ul>
          {confirmedItems.map((item, index) => (
            <li key={index} className={styles.confirmedItem}>
              <div className={styles.confirmedItemContent}>
                <span>{item}</span>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.uploadReplicateSection}>
          <CldUploadButton
            options={{ maxFiles: 1 }}
            folder="images"
            onSuccess={handleUploadSuccess}
            onFailure={(error) =>
              console.error("Cloudinary upload error:", error)
            }
            uploadPreset="zoa1vsa7"
          >
            <div className={styles.uploadButton}>Upload Image</div>
          </CldUploadButton>
          <p className={styles.orText}>or</p>
          <button
            onClick={navigateToConfirmation}
            className={styles.replicateButton}
          >
            Use Replicate to Generate
          </button>
        </div>
        <button
          onClick={navigateToConfirmation}
          className={styles.confirmButton}
        >
          Go to Confirmation Page
        </button>
      </div>
    </div>
  );
};

export default VideoScan;
