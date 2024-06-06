// components/MyDonationsRequests.js
import React, { useState, useEffect } from "react";
import Link from "next/link";
import RemoveBtn from "../RemoveButton";
import { HiPencilAlt } from "react-icons/hi";
import MyCard from "./MyCard";
import { GoSearch } from "react-icons/go";

const ActiveCardsList = ({ userId }) => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch(`http://localhost:3000/api/activeItem/${userId}`, {
            cache: "no-store",
          }),
          fetch(`http://localhost:3000/api/activeRequest/${userId}`, {
            cache: "no-store",
          }),
        ]);

        if (!donationRes.ok || !requestRes.ok) {
          throw new Error("Failed to fetch items");
        }
        const [donationData, requestData] = await Promise.all([
          donationRes.json(),
          requestRes.json(),
        ]);

        const combinedItems = [
          ...donationData.items.map((item) => ({ ...item, type: "Donation" })),
          ...requestData.requests.map((item) => ({ ...item, type: "Request" })),
        ];

        await setItems(combinedItems);
      } catch (error) {
        console.log(error);
      }
    };
    fetchItems();
  }, []);

  if (!items) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-8 w-10/12 p-3">
      {items.map((item) => (
        <MyCard key={item._id} item={item} /> // Use the Card component
      ))}
    </div>
  );
};

export default ActiveCardsList;
