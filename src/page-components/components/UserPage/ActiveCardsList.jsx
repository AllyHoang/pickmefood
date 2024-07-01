// components/MyDonationsRequests.js
import React, { useState, useEffect } from "react";
import MyCard from "./MyCard";
import useFetchUserBaskets from "@/hook/useFetchUserBaskets";
import { Router } from "lucide-react";
import { useRouter } from "next/router";

const ActiveCardsList = ({ userId, loggedInUserId, type }) => {
  const { donationBaskets, requestBaskets, loading, error } =
    useFetchUserBaskets((userId = userId));
  const baskets = [...donationBaskets, ...requestBaskets];
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
  }, [router.query.id, baskets]);

  return (
    <div className="grid grid-cols-2 gap-8 w-full p-3">
      {type === "Donation"
        ? donationBaskets?.map((basket) => (
            <MyCard
              key={basket._id}
              basket={basket}
              setOpenDialog={setOpenDialog}
              selectedBasket={selectedBasket}
              loggedInUserId={loggedInUserId}
              userId={userId}
              type="Donation"
            />
          ))
        : requestBaskets?.map((basket) => (
            <MyCard
              key={basket._id}
              basket={basket}
              setOpenDialog={setOpenDialog}
              selectedBasket={selectedBasket}
              loggedInUserId={loggedInUserId}
              userId={userId}
              type="Request"
            />
          ))}
    </div>
  );
};

export default ActiveCardsList;
