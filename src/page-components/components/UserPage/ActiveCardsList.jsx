// components/MyDonationsRequests.js
import React, { useState, useEffect } from "react";
import MyCard from "./MyCard";
import useFetchUserBaskets from "@/hook/useFetchUserBaskets";
import { Router } from "lucide-react";
import { useRouter } from "next/router";

const ActiveCardsList = ({ userId, loggedInUserId, type, searchTerm }) => {
  const { donationBaskets, requestBaskets, loading, error } =
    useFetchUserBaskets((userId = userId));
  // const baskets = [...donationBaskets, ...requestBaskets];
  const [selectedBasket, setSelectedBasket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  if (!donationBaskets || !requestBaskets) {
    return <div>Loading...</div>;
  }

  useEffect(() => {
    if (router.query.id) {
      const basket = baskets.find((basket) => basket._id === router.query.id);
      setSelectedBasket(basket);
    }
  }, [router.query.id]);

  const baskets = type === "Donation" ? donationBaskets : requestBaskets;

  const filteredBaskets = baskets.filter((basket) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const content = type === "Donation" ? basket.description : basket.reason;
    return (
      basket.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      content.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <div className="grid grid-cols-3 gap-8 w-full p-3">
      {filteredBaskets.map((basket) => (
        <MyCard
          key={basket._id}
          basket={basket}
          setOpenDialog={setOpenDialog}
          selectedBasket={selectedBasket}
          loggedInUserId={loggedInUserId}
          userId={userId}
          type={type}
        />
      ))}
    </div>
  );
};

export default ActiveCardsList;
