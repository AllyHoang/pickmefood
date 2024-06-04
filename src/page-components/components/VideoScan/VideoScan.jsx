import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter for navigation
import io from "socket.io-client";
import styles from "./VideoScan.module.css"; // Import the CSS module

let socket;

export default function VideoScan() {
  const [connected, setConnected] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const videoRef = useRef(null);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    socket = io("http://localhost:5000"); // Make sure this matches your Flask app's URL

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

  const navigateToConfirmation = () => {
    setProcessing(false);
    socket.emit("stop_video");
    router.push({
      pathname: "/confirmation",
      query: { confirmedItems: JSON.stringify(confirmedItems) },
    });
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
              {item}
              <button
                onClick={() => handleRemoveItem(item)}
                className={styles.removeButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={navigateToConfirmation} className={styles.confirmButton}>
        Confirm Items
      </button>
    </div>
  );
}
