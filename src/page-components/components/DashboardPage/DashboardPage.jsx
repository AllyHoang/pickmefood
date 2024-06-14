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
import { RxClock } from "react-icons/rx";
import { GoSearch } from "react-icons/go";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getAllDonations } from "../../../../dummy-data";
import { RxSewingPin } from "react-icons/rx";
import { RxPerson } from "react-icons/rx";
import { BiMap } from "react-icons/bi";
import MapComponent from "../MapDonation/mapComponent";
import ToggleView from "./ToggleView";
import { useRouter } from "next/router";
import PointBadge from "./PointBadge";
import DashboardHeading from "./DashboardHeading";

function DashboardPage({ userId }) {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const router = useRouter();
  const [viewType, setViewType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'donations', or 'requests'
  const items = getAllDonations();
  const filteredItems = items.filter((item) => {
    return (
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === "all" ||
        item.type.toLowerCase() === filterType.toLowerCase())
    );
  });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleView = () => {
    if (viewType === "list") {
      setViewType("map");
      router.push("/map-view", undefined, { shallow: true });
    } else {
      setViewType("list");
      router.push("/dashboard", undefined, { shallow: true });
    }
  };

  const handleSearchSubmit = () => {};

  const truncateDescription = (description, maxWords) => {
    const words = description.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };

  return (
    <div>
      {viewType === "list" ? (
        <>
          <div className="container mx-auto px-4 mt-6">
            <div className="grid grid-cols-3 items-center gap-4 mb-5">
              {/* Heading */}
              <DashboardHeading></DashboardHeading>
              {/* Point Badge */}
              <PointBadge></PointBadge>
            </div>
            <div className="flex justify-between items-center mb-6">
              {/* Toggle View From Map to List and vice */}
              {/* <ToggleView></ToggleView> */}
              {/* View Type Toggle */}
              <ToggleView
                viewType={viewType}
                handleToggleView={handleToggleView}
              ></ToggleView>
              {/* Search Bar */}
              <div className="flex-grow flex items-center gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GoSearch className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
                <Button className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-400 rounded transition duration-150 ease-in-out">
                  Search
                </Button>
              </div>

              {/* Filter Dropdown */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="ml-4 p-2 border border-gray-300 rounded"
              >
                <option value="all">All</option>
                <option value="donation">Donations</option>
                <option value="request">Requests</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            {filteredItems.map((donation) => (
              <Card
                key={donation.id}
                className="flex flex-col bg-white rounded-lg shadow-lg"
              >
                <CardHeader className="flex-col gap-4 items-start">
                  <Badge
                    variant={`${
                      donation.type === "Request" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-full text-sm font-large text-s ${
                      donation.type === "Request"
                        ? "bg-sky-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    {donation.type === "Request"
                      ? `${donation.type} 🤲`
                      : `${donation.type} 🚀`}
                  </Badge>

                  <div className="flex flex-row gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={`/images/${donation.image}`}
                        alt="Donation Image"
                      />
                      <AvatarFallback>
                        {donation.title.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">
                        {donation.title}
                      </CardTitle>
                      <CardDescription>{donation.ownerName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{truncateDescription(donation.description, 15)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-1 align-center">
                    <BiMap></BiMap>
                    <p className="font-medium text-sm"> {donation.location} </p>
                  </div>

                  <p className="font-medium text-sm">
                    {" "}
                    {donation.type === "Donation"
                      ? `○ Expires: ${donation.expiryDate}`
                      : ``}{" "}
                  </p>
                  <Drawer direction="right">
                    <DrawerTrigger asChild>
                      <Button
                        onClick={() => setSelectedDonation(donation)}
                        className=""
                      >
                        View Details
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent
                      title={selectedDonation?.title}
                      className="bg-white flex flex-col rounded-t-lg shadow-xl transition-all duration-300 h-full w-[400px] mt-24 fixed bottom-0 right-0"
                    >
                      <div className="p-4 bg-white shadow-lg rounded-lg">
                        {selectedDonation?.image && (
                          <div className="overflow-hidden rounded-t-lg">
                            <img
                              src={`/images/${selectedDonation?.image}`}
                              alt="Donation"
                              className="w-full object-cover hover:scale-105 transition-scale duration-300"
                              style={{ height: "200px" }}
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h2
                              className={`text-2xl text-heading4-bold font-bold  ${
                                donation.type === "Request"
                                  ? "text-sky-600"
                                  : "text-emerald-600"
                              }`}
                            >
                              {selectedDonation?.title}
                            </h2>
                          </div>
                          <p className="text-gray-500">
                            {selectedDonation?.description}
                          </p>
                          <div className="mt-4">
                            <div className="flex justify-between align-middle">
                              <p className="flex items-center text-gray-800 font-bold">
                                <RxPerson className="mr-2" size="20px" />
                                {selectedDonation?.type === "Request"
                                  ? "Requester"
                                  : "Donor"}
                                :
                              </p>
                              <span>{selectedDonation?.ownerName}</span>
                            </div>
                            <div className="flex justify-between align-middle ">
                              <p className="flex items-center text-gray-800 font-bold">
                                <RxSewingPin className="mr-2" size="20px" />
                                <span className="font-bold">Location:</span>
                              </p>
                              <span>{selectedDonation?.location}</span>
                            </div>
                            {selectedDonation?.expiryDate && (
                              <div className="flex justify-between align-middle ">
                                <p className="flex items-center text-gray-800 font-bold">
                                  <RxClock className="mr-2" size="20px" />
                                  Expires:
                                </p>
                                <span>{selectedDonation?.expiryDate}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4">
                            {selectedDonation?.type === "Request" ? (
                              <button className="w-full bg-sky-500 hover:bg-sky-400 text-white py-2 rounded transition duration-150 ease-in-out">
                                Donate 🚀
                              </button>
                            ) : (
                              <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-2 rounded transition duration-150 ease-in-out">
                                Request 🤲
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div>
          {/* Render the map view component or layout here */}
          <MapComponent />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
