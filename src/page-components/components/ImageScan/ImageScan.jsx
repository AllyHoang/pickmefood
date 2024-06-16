import React, { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import styles from "./ImageScan.module.css";
import { useImage } from "@/lib/ImageContext";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ImageScan = () => {
  const { setImageUrl } = useImage();
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useReplicate, setUseReplicate] = useState(false); // State for the Replicate checkbox
  const [useCloudinary, setUseCloudinary] = useState(false);
  const [firstImageUploaded, setFirstImageUploaded] = useState(false); // Track first image upload
  const [secondImageUploaded, setSecondImageUploaded] = useState(false); // Track second image upload
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const itemsPerPage = 10;

  const runClarifai = async () => {
    const PAT = "dda115b63573404e9acee82bb952af34";
    const USER_ID = "clarifai";
    const APP_ID = "main";
    const MODEL_ID = "food-item-recognition";
    const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";
    const DEFAULT_IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

    const imageUrl = uploadedImage || DEFAULT_IMAGE_URL;

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Key ${PAT}`,
        "Content-Type": "application/json",
      },
      body: raw,
    };

    try {
      const response = await fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        requestOptions
      );
      const data = await response.json();
      console.log(data);

      // Extract detected items from 'data' and update 'detectedItems' state
      const concepts = data.outputs[0].data.concepts.map(
        (concept) => concept.name
      );
      setDetectedItems(concepts);
      setCurrentPage(0); // Reset to first page on new scan
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleItemCheck = (item) => {
    setConfirmedItems((prev) => new Set(prev).add(item));
  };

  const handleItemUncheck = (item) => {
    setConfirmedItems((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(item);
      return updatedSet;
    });
  };

  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < detectedItems.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
      if (prediction.status === "succeeded") {
        setImageUrl(prediction.output[prediction.output.length - 1]);
      }
    } catch (error) {
      console.error("Error generating image with Replicate:", error);
      return null;
    }
  };

  const handleFirstUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setUploadedImage(uploadedUrl);
    setFirstImageUploaded(true);
  };

  const handleSecondUploadSuccess = (result) => {
    const uploadedUrl = result?.info?.secure_url;
    setUploadedImage(uploadedUrl);
    setFirstImageUploaded(true);
    setSecondImageUploaded(true);
  };

  const redirectToConfirmationPage = async () => {
    if (useReplicate) {
      const prompt = `Generate an image that includes the following items: ${[
        ...confirmedItems,
      ].join(", ")}`;
      generateReplicateImage(prompt);
    }

    setImageUrl(uploadedImage);

    router.push({
      pathname: "/confirmation",
      query: {
        confirmedItems: JSON.stringify([...confirmedItems]),
      },
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Image Recognition</h1>
      <div className={styles.uploadSection}>
        {!firstImageUploaded && ( // Render first Cloudinary upload button if first image is not uploaded
          <CldUploadButton
            options={{ maxFiles: 1 }}
            folder="images"
            onSuccess={handleFirstUploadSuccess}
            onFailure={(error) =>
              console.error("Cloudinary upload error:", error)
            }
            uploadPreset="zoa1vsa7"
          >
            <p className={styles.uploadButton}>Upload Image</p>
          </CldUploadButton>
        )}
        {firstImageUploaded &&
          useCloudinary &&
          !secondImageUploaded && ( // Render second Cloudinary upload button if first image uploaded and useCloudinary checked
            <CldUploadButton
              options={{ maxFiles: 1 }}
              folder="images"
              onSuccess={handleSecondUploadSuccess}
              onFailure={(error) =>
                console.error("Cloudinary upload error:", error)
              }
              uploadPreset="zoa1vsa7"
            >
              <p className={styles.uploadButton}>Upload Another Image</p>
            </CldUploadButton>
          )}
        <button
          onClick={runClarifai}
          disabled={!uploadedImage}
          className={`${styles.runButton} ${
            !uploadedImage ? styles.runButtonDisabled : ""
          }`}
        >
          Scan
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          {uploadedImage && (
            <div className={styles.imageContainer}>
              <img
                src={uploadedImage}
                alt="Uploaded"
                className={styles.image}
              />
            </div>
          )}
        </div>
        {detectedItems.length > 0 && (
          <div className={styles.rightSection}>
            <div className={styles.section}>
              <h2>Detected Items</h2>
              <ul className={styles.list}>
                {detectedItems
                  .slice(
                    currentPage * itemsPerPage,
                    (currentPage + 1) * itemsPerPage
                  )
                  .map((item, index) => (
                    <li key={item} className={styles.listItem}>
                      <input
                        type="checkbox"
                        id={`item-${index}`}
                        checked={confirmedItems.has(item)}
                        onChange={(e) =>
                          e.target.checked
                            ? handleItemCheck(item)
                            : handleItemUncheck(item)
                        }
                        className={styles.checkbox}
                      />
                      <label htmlFor={`item-${index}`} className={styles.label}>
                        {item}
                      </label>
                    </li>
                  ))}
              </ul>
              <div className={styles.paginationButtons}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={styles.paginationButton}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={
                    (currentPage + 1) * itemsPerPage >= detectedItems.length
                  }
                  className={styles.paginationButton}
                >
                  Next
                </button>
              </div>
            </div>
            <div className={styles.section}>
              <h2>Confirmed Items</h2>
              <ul className={styles.list}>
                {[...confirmedItems].map((item) => (
                  <li key={item} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
              {confirmedItems.size > 0 && (
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id="useReplicate"
                    checked={useReplicate}
                    onChange={(e) => setUseReplicate(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="useReplicate" className={styles.replicate}>
                    Use Replicate to generate image?
                  </label>
                  <input
                    type="checkbox"
                    id="useCloudinary"
                    checked={useCloudinary}
                    onChange={(e) => setUseCloudinary(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <label htmlFor="useCloudinary" className={styles.replicate}>
                    Upload another image?
                  </label>
                </div>
              )}
              <button
                onClick={redirectToConfirmationPage}
                className={styles.confirmationButton}
              >
                Go to Confirmation Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageScan;
