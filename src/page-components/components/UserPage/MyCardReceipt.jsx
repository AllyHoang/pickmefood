// components/MyCardReceipt.js
import React from "react";
import { Card, CardFooter, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const MyCardReceipt = ({ receipt }) => {
  const formatDate = (date) => {
    return format(new Date(date), "MMMM d, yyyy HH:mm:ss");
  };

  return (
    <Card
      key={receipt?._id}
      className="flex flex-col bg-white rounded-2xl shadow-lg gap-4 p-4 h-full"
    >
      <div className="flex gap-3">
        <Badge className="bg-emerald-100 text-black text-small-medium">
          {receipt.type === "Place"
            ? `${receipt.type} 🤲`
            : `${receipt.type} 🚀`}
        </Badge>
      </div>
      <CardTitle className="text-heading3-bold ">
        {receipt?.organization[0]?.organizationName}
      </CardTitle>
      <div className="flex justify-between">
        <div className="flex gap-3 flex-wrap">
          {receipt?.cardDetails?.map((detail, index) => (
            <Badge
              key={index}
              className="bg-sky-100 text-black text-small-medium"
            >
              {`${
                detail.brand.charAt(0).toUpperCase() + detail.brand.slice(1)
              } ending in ${detail.last4Digits}`}
            </Badge>
          ))}
        </div>
      </div>
      <Separator />
      <CardFooter>
        <p className="text-gray-600 text-sm">
          Amount: ${receipt.amount}
          <br />
          Created At: {formatDate(receipt.createdAt)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MyCardReceipt;
