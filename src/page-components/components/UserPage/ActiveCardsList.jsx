// components/MyDonationsRequests.js
import React, { useState, useEffect } from "react";
import MyCard from "./MyCard";
import useFetchUserBaskets from "@/hook/useFetchUserBaskets";
import { useRouter } from "next/router";
import MyCardReceipt from "./MyCardReceipt";

const ActiveCardsList = ({
  userId,
  loggedInUserId,
  type,
  searchTerm,
  userData,
}) => {
  const { donationBaskets, requestBaskets, loading, error } =
    useFetchUserBaskets(userId);
  const [selectedBasket, setSelectedBasket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch(`/api/receipts/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch receipts");
        }
        const data = await response.json();
        setReceiptData(data.receipts); // Set receipt data to state
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    if (userId) {
      fetchReceipts(); // Fetch receipts when userId is available
    }
  }, [userId]);

  useEffect(() => {
    if (router.query.id) {
      const basket = [...donationBaskets, ...requestBaskets].find(
        (basket) => basket._id === router.query.id
      );
      setSelectedBasket(basket);
    }
  }, [router.query.id, donationBaskets, requestBaskets]);

  const baskets = type === "Donation" ? donationBaskets : requestBaskets;

  const filteredBaskets = baskets.filter((basket) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const content = type === "Donation" ? basket.description : basket.reason;
    return (
      basket.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      content.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const filteredReceipts = receiptData
    ? receiptData.filter((receipt) =>
        receipt.organization[0].organizationName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="grid grid-cols-3 gap-8 w-full p-3">
      {type !== "Receipts" &&
        filteredBaskets.map((basket) => (
          <MyCard
            key={basket._id}
            basket={basket}
            setOpenDialog={setOpenDialog}
            selectedBasket={selectedBasket}
            loggedInUserId={loggedInUserId}
            userId={userId}
            type={type}
            userData={userData}
          />
        ))}
      {type === "Receipts" &&
        filteredReceipts.map((receipt) => (
          <MyCardReceipt
            key={receipt._id}
            receipt={receipt}
            userId={userId}
            type={type}
          />
        ))}
    </div>
  );
};

export default ActiveCardsList;
