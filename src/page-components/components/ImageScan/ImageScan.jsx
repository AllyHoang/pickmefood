import React, { useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import styles from "./ImageScan.module.css";

const ImageScan = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  const itemsPerPage = 10;

  const runClarifai = async () => {
    const PAT = "dda115b63573404e9acee82bb952af34";
    const USER_ID = "clarifai";
    const APP_ID = "main";
    const MODEL_ID = "food-item-recognition";
    const MODEL_VERSION_ID = "1d5fd481e0cf4826aa72ec3ff049e044";
    const IMAGE_URL = "https://samples.clarifai.com/metro-north.jpg";

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageUrl || IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
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
    if (!confirmedItems.includes(item)) {
      setConfirmedItems([...confirmedItems, item]);
    }
  };

  const handleItemUncheck = (item) => {
    setConfirmedItems(confirmedItems.filter((i) => i !== item));
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

  const redirectToConfirmationPage = () => {
    router.push({
      pathname: "/confirmation",
      query: { confirmedItems: JSON.stringify(confirmedItems) },
    });
  };

  const paginatedItems = detectedItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Image Recognition</h1>
      <div className={styles.uploadSection}>
        <CldUploadButton
          options={{ maxFiles: 1 }}
          folder="images"
          onSuccess={(result) => setImageUrl(result?.info?.secure_url)}
          onFailure={(error) =>
            console.error("Cloudinary upload error:", error)
          }
          uploadPreset="zoa1vsa7"
        >
          <p className={styles.uploadButton}>Upload Image</p>
        </CldUploadButton>
        <button
          onClick={runClarifai}
          disabled={!imageUrl}
          className={`${styles.runButton} ${
            !imageUrl ? styles.runButtonDisabled : ""
          }`}
        >
          Scan
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.leftSection}>
          {imageUrl && (
            <div className={styles.imageContainer}>
              <img src={imageUrl} alt="Uploaded" className={styles.image} />
            </div>
          )}
        </div>
        {detectedItems.length > 0 && (
          <div className={styles.rightSection}>
            <div className={styles.section}>
              <h2>Detected Items</h2>
              <ul className={styles.list}>
                {paginatedItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    <input
                      type="checkbox"
                      id={`item-${index}`}
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
                {confirmedItems.map((item, index) => (
                  <li key={index} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
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
