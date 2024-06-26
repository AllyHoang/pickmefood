import React, { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import styles from "./ImageScan.module.css";
import { useImage } from "@/lib/ImageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ConfirmationPage from "../Confirmation/ConfirmationPage";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ImageScan = ({ userId }) => {
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

  console.log(userId);

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
      pathname: "",
      query: {
        confirmedItems: JSON.stringify([...confirmedItems]),
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 overflow-auto">
      <h1
        className="self-start font-bold text-gray-700"
        style={{ fontSize: "20px" }}
      >
        Scan Image To Add Donation🤳🏽
      </h1>
      <div className="self-center flex gap-4">
        {!firstImageUploaded && (
          <CldUploadButton
            options={{ maxFiles: 1 }}
            folder="images"
            onSuccess={handleFirstUploadSuccess}
            onFailure={(error) =>
              console.error("Cloudinary upload error:", error)
            }
            uploadPreset="zoa1vsa7"
          >
            <Button className="bg-sky-400">Upload Image</Button>
          </CldUploadButton>
        )}
        {firstImageUploaded && useCloudinary && !secondImageUploaded && (
          <CldUploadButton
            options={{ maxFiles: 1 }}
            folder="images"
            onSuccess={handleSecondUploadSuccess}
            onFailure={(error) =>
              console.error("Cloudinary upload error:", error)
            }
            uploadPreset="zoa1vsa7"
          >
            <Button className="bg-sky-400">Upload Another Image</Button>
          </CldUploadButton>
        )}
        {uploadedImage && (
          <Button onClick={runClarifai} className="bg-sky-400">
            Scan Image
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 max-w-[90%] self-center gap-4">
        <Card className="max-h-72 overflow-hidden">
          {uploadedImage && (
            <div className="overflow-hidden">
              <img src={uploadedImage} alt="Uploaded" />
            </div>
          )}
        </Card>

        <div>
          {detectedItems.length > 0 && (
            <div className="flex flex-col gap-3">
              <Card className="flex flex-col mx-3 max-h-72 overflow-auto">
                <h2 className="text-xl self-center font-bold my-2">
                  Detected Items
                </h2>
                <ul className="list-none p-0 m-0">
                  {detectedItems
                    .slice(
                      currentPage * itemsPerPage,
                      (currentPage + 1) * itemsPerPage
                    )
                    .map((item, index) => (
                      <li
                        key={item}
                        className="flex items-center pl-4 py-2 border-b border-gray-300"
                      >
                        <input
                          type="checkbox"
                          id={`item-${index}`}
                          checked={confirmedItems.has(item)}
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
                <div className="flex justify-between my-3 mx-3">
                  <Button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className="bg-sky-400 text-white rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextPage}
                    disabled={
                      (currentPage + 1) * itemsPerPage >= detectedItems.length
                    }
                    className="bg-sky-400 text-white rounded transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </Card>
              <Card className="flex flex-col mx-3 mb-3">
                <h2 className="text-xl self-center font-bold my-2">
                  Confirmed Items
                </h2>
                <ul className="list-none p-0 m-0">
                  {[...confirmedItems].map((item) => (
                    <li
                      key={item}
                      className="py-2 border-b pl-4 border-gray-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
                {confirmedItems.size > 0 && (
                  <div className="mt-4 pl-4 mb-2">
                    <input
                      type="checkbox"
                      id="useReplicate"
                      checked={useReplicate}
                      onChange={(e) => setUseReplicate(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="useReplicate" className="text-gray-700">
                      Use Replicate to generate image?
                    </label>
                    <div className="mt-2">
                      <input
                        type="checkbox"
                        id="useCloudinary"
                        checked={useCloudinary}
                        onChange={(e) => setUseCloudinary(e.target.checked)}
                        className="mr-2"
                      />
                      <label htmlFor="useCloudinary" className="text-gray-700">
                        Upload another image?
                      </label>
                    </div>
                  </div>
                )}

                <Dialog>
                  <DialogTrigger>
                    <Button
                      onClick={redirectToConfirmationPage}
                      className=" bg-sky-400 mb-4 w-[93%]"
                    >
                      Go to Confirmation Page
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[80%] min-h-fit overflow-auto">
                    <ConfirmationPage userId={userId}></ConfirmationPage>
                  </DialogContent>
                </Dialog>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageScan;
