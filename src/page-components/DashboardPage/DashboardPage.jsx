import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { getAllDonations } from "../../../dummy-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("donations"); // 'donations' or 'requests'

  const donations = getAllDonations().filter((donation) =>
    donation.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {};

  const handleToggleView = () => {
    setViewType(viewType === "donations" ? "requests" : "donations");
  };

  const truncateDescription = (description, maxWords) => {
    const words = description.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-start text-gray-800 my-8">
        Welcome back, Thuc Anh!
      </h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded"
          />
          <Button className="px-4 py-2 text-white rounded transition-colors">
            Search
          </Button>

          <Button
            onClick={() => {
              /* logic to handle adding a donation */
            }}
            className="px-4 py-2 text-white rounded transition-colors"
          >
            <Link href="/addItem/page">Add Donation</Link>
          </Button>
        </div>

        {/* <button
          onClick={handleToggleView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Toggle View: {viewType === "donations" ? "Requests" : "Donations"}
        </button> */}
      </div>
      <div className="grid grid-cols-2 gap-8 m-10">
        {donations.map((donation) => (
          <Card
            key={donation.id}
            className="flex flex-col bg-white rounded-lg shadow-md"
          >
            <CardHeader className="flex-col gap-4 items-start">
              <Badge
                variant="secondary"
                className="px-3 py-1 rounded-full text-sm font-large text-s"
              >
                {donation.type === "Request"
                  ? `${donation.type} 🤲`
                  : `${donation.type} 🚀`}
              </Badge>

              <div className="flex flex-row gap-4 items-center">
                {/* <Avatar>
                  <AvatarImage
                    src={`/images/${donation.image}`}
                    alt="Donation Image"
                  />
                  <AvatarFallback>{donation.title.slice(0, 2)}</AvatarFallback>
                </Avatar> */}
                <div>
                  <CardTitle className="text-xl">{donation.title}</CardTitle>
                  <CardDescription>{donation.ownerName}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p>{truncateDescription(donation.description, 17)}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <p className="font-semibold"> ○ {donation.location} </p>
              <p className="font-semibold">
                {" "}
                {donation.type === "Donation"
                  ? `○ Expires: ${donation.expiryDate}`
                  : ``}{" "}
              </p>

              <Drawer direction="right">
                <DrawerTrigger asChild>
                  <Button>View Details</Button>
                </DrawerTrigger>
                <DrawerContent className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] mt-24 fixed bottom-0 right-0"></DrawerContent>
              </Drawer>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
