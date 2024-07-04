import React, { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/router";
import styles from "./ImageScan.module.css";
import { useImage } from "@/lib/ImageContext";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ConfirmationPage from "../Confirmation/ConfirmationPage";
import Image from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import AddItem from "../addItemForm/addItemForm";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { useSelector } from "react-redux";

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
  const [scanning, setScanning] = useState(false);
  const {confirmedItems: confirmedItemsFromQuery} = router.query;
  const { currentUser } = useSelector((state) => state.user);

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
      setScanning(true);
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
    } finally {
      setScanning(false);
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

  return confirmedItemsFromQuery ? (
    <AddItem
      userId={userId}
      itemsFromQuery={confirmedItemsFromQuery}
      externalImageSource={uploadedImage}
    />
  ) : (
    <div className="flex flex-col gap-6 overflow-auto h-full pb-16">
<div className="base-container">
        <Breadcrumbs
          crumbs={[
            {
              title: "Profile",
              href: `/profile?username=${currentUser?.username}`,
            },
            { title: "Add Donation With Image" },
          ]}
          className="text-small-medium mt-8"
        />
      </div>
      <div className="flex flex-col items-center h-full gap-4">
      <h1 className="text-heading2-bold text-gray-700 pt-5">Scan your photo</h1>
      <h2 className="text-body-medium text-gray-700">
        We will detect items from your uploaded photo, then use them to create
        donation
      </h2>
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
          href="/video-scan"
          className="underline underline-offset-2 hover:text-blue-400"
        >
          {" "}
          or do a video scan
        </a>
      </p>
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
          <Button className="bg-sky-400 hover:bg-sky-600">
            Upload your photo
          </Button>
        </CldUploadButton>
      )}
      {firstImageUploaded && !secondImageUploaded && (
        <CldUploadButton
          options={{ maxFiles: 1 }}
          folder="images"
          onSuccess={handleSecondUploadSuccess}
          onFailure={(error) =>
            console.error("Cloudinary upload error:", error)
          }
          uploadPreset="zoa1vsa7"
        >
          <Button className="w-fit bg-slate-100 text-gray-700 hover:bg-slate-300 rounded-lg">
            Upload again
          </Button>
        </CldUploadButton>
      )}

      <div className="grid grid-cols-2 max-w-[90%] self-center w-full flex-1 gap-8 p-8">
        {uploadedImage && (
          <div className="col-span-1">
            <div className="w-full h-full relative">
              <Image
                src={uploadedImage}
                alt="Your uploaded photo"
                fill
                className="object-fill rounded object-top"
              />
            </div>
          </div>
        )}
        {uploadedImage && detectedItems.length === 0 ? (
          <div className="border-dashed border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500 text-base-light">
              Please note that your photo may be cropped for display purposes
            </p>
            <p className="text-gray-500 text-base-light">
              All scanned items will appear here
            </p>
            {scanning ? (
              <AiOutlineLoading3Quarters className="text-muted-foreground mt-3 animate-spin" />
            ) : (
              <Button onClick={runClarifai} className="bg-sky-400 mt-1">
                Scan Image
              </Button>
            )}
          </div>
        ) : (
          <div>
            {detectedItems.length > 0 && (
              <div className="flex flex-col w-full gap-8">
                <Card className="flex flex-col max-h-72 overflow-hidden">
                  <div className="flex flex-col items-center pt-4 pb-3">
                    <p className="text-base-bold">Detected items</p>

                    <p className="text-small-medium text-muted-foreground">
                      Tick to choose the items
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-scroll px-6">
                    <ul className="list-none p-0 m-0">
                      {detectedItems.map((item, index) => (
                        <li
                          key={item}
                          className={`flex items-center ${
                            index !== detectedItems.length - 1
                              ? "border-b border-gray-300 py-2"
                              : "pt-2 pb-3"
                          }`}
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
                  </div>
                </Card>
                <Card className="flex flex-col flex-1 max-h-72 overflow-hidden">
                  <p className="text-base-bold flex flex-col items-center pt-4 pb-3">
                    Confirm items
                  </p>
                  <div className="flex-1 overflow-y-scroll px-6 max-h-64">
                    {[...confirmedItems].length === 0 ? (
                      <div className="h-full flex flex-col justify-center">
                        <p className="text-center text-muted-foreground">
                          Please choose at least one item.
                        </p>
                      </div>
                    ) : (
                      <ul className="list-none p-0 m-0">
                        {[...confirmedItems].reverse().map((item, index) => (
                          <li
                            key={item}
                            className={`flex items-center ${
                              index !== [...confirmedItems].length - 1
                                ? "border-b border-gray-300 py-2"
                                : "pt-2 pb-4"
                            }`}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Button
                    onClick={redirectToConfirmationPage}
                    className="bg-sky-400 hover:bg-sky-600 m-4"
                    disabled={[...confirmedItems].length === 0}
                  >
                    Go to confirmation page
                  </Button>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  )
    
  
};

export default ImageScan;
