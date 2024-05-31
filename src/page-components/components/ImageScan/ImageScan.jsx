import React, { useState } from "react";
import { CldUploadButton } from "next-cloudinary";

const ClarifaiComponent = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState([]);

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

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Clarifai Image Recognition</h1>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <CldUploadButton
          options={{ maxFiles: 1 }}
          folder="images"
          onSuccess={(result) => setImageUrl(result?.info?.secure_url)}
          onFailure={(error) =>
            console.error("Cloudinary upload error:", error)
          }
          uploadPreset="zoa1vsa7"
        >
          <p>Upload Image</p>
        </CldUploadButton>
        <button onClick={runClarifai} disabled={!imageUrl}>
          Run Clarifai
        </button>
      </div>
      {imageUrl && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: "100%" }} />
        </div>
      )}
      <div style={{ marginBottom: "20px" }}>
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
      <div>
        <h2>Confirmed Items</h2>
        <ul>
          {confirmedItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClarifaiComponent;
