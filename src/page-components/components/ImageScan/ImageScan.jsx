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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ImageScan = ({ userId }) => {
  const { setImageUrl } = useImage();
  const [detectedItems, setDetectedItems] = useState([]);
  const [confirmedItems, setConfirmedItems] = useState(new Set());
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useReplicate, setUseReplicate] = useState(false); // State for the Replicate checkbox
  const [firstImageUploaded, setFirstImageUploaded] = useState(false); // Track first image upload
  const [secondImageUploaded, setSecondImageUploaded] = useState(false); // Track second image upload
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [scanningItem, setScanningItem] = useState(false);

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
      setScanningItem(true);
      const response = await fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        requestOptions
      );
      const data = await response.json();
      // Extract detected items from 'data' and update 'detectedItems' state
      const concepts = data.outputs[0].data.concepts.map(
        (concept) => concept.name
      );
      setDetectedItems(concepts);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setScanningItem(false);
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
    <div className="flex flex-col gap-6 overflow-auto h-full pb-8">
      <div className="mx-auto flex flex-col items-center gap-2 mt-4">
        <h1 className="text-heading2-bold text-gray-700">Scan your photo</h1>
        <p className="text-body-medium font-normal">
          We will detect items from your photo and use them to create a
          donation.
        </p>
        <p className="text-muted-foreground">
          Want a different way? Try creating manually or do a video scan.
        </p>
      </div>
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
            <Button className="bg-sky-400 hover:bg-sky-700">
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
            <Button variant="outline">Upload again</Button>
          </CldUploadButton>
        )}
      </div>
      <div className="grid grid-cols-2 max-w-[90%] self-center gap-8 w-full flex-1 mt-2">
        {uploadedImage && (
          <div className="col-span-1">
            <div className="w-full h-full relative">
              <Image
                src={uploadedImage}
                alt="Your uploaded photo"
                fill
                className="object-cover rounded object-top"
              />
            </div>
          </div>
        )}
        {uploadedImage && detectedItems.length === 0 ? (
          <div className="border border-dashed flex flex-col gap-1 items-center justify-center rounded p-8">
            <p className="text-muted-foreground text-center">
              Please note, your photo may be cropped for display purposes.
            </p>
            <p className="text-muted-foreground text-center">
              All scanned items will appear here.
            </p>
            {scanningItem ? (
              <AiOutlineLoading3Quarters className="animate-spin text-muted-foreground mt-4" />
            ) : (
              <Button onClick={runClarifai} className="bg-sky-400 mt-4">
                Scan photo
              </Button>
            )}
          </div>
        ) : (
          <div>
            {detectedItems.length > 0 && (
              <div className="flex flex-col gap-8 h-full">
                <Card className="flex flex-col max-h-72 overflow-hidden">
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
                <Card className="flex flex-col flex-1 overflow-hidden">
                  <CardHeader className="text-base-bold">
                    <CardTitle>Confirmed items</CardTitle>
                  </CardHeader>
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
                  <Dialog>
                    <DialogTrigger>
                      <Button
                        onClick={redirectToConfirmationPage}
                        className=" bg-sky-400 mb-4 w-[93%]"
                        disabled={[...confirmedItems].length === 0}
                      >
                        Go to confirmation page
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
        )}
      </div>
    </div>
  );
};

export default ImageScan;
