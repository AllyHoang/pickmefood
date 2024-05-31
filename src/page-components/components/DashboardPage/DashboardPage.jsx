import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
// import Drawer from "./Drawer"; // Import the drawer component
import { getDonations, getRequests } from "../../../../dummy-data";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewType, setViewType] = useState("both"); // 'donations', 'requests', or 'both'
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // State for selected item
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for drawer open/close

  // Testing mock data
  const donations = getDonations();
  const requests = getRequests();

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleToggleView = (newViewType) => {
    setViewType(newViewType);
  };

  const truncateDescription = (description, maxWords) => {
    if (!description) return "No description";
    const words = description.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedItem(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const combined_items = viewType === "both" ? [...donations, ...requests] : viewType === "donations" ? donations : requests;

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

        <div className="flex items-center">
          <label htmlFor="viewType" className="mr-2">Filter:</label>
          <select
            id="viewType"
            value={viewType}
            onChange={(e) => handleToggleView(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="both">All Donations & Requests</option>
            <option value="donations">Donations Only</option>
            <option value="requests">Requests Only</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 m-10">
      {combined_items.map((item) => (
  <Card
    key={item.id}
    className="flex flex-col bg-white rounded-lg shadow-md"
  >
    <CardHeader className="flex-col gap-4 items-start">
      <Badge
        variant="secondary"
        className="px-3 py-1 rounded-full text-sm font-large text-s"
      >
        {item.type === "Donation" ? `donation 🤲` : `request 🚀`}
      </Badge>

      <div className="flex flex-row gap-4 items-center">
        <div>
          <CardTitle className="text-xl">{item.title}</CardTitle>
          <CardDescription>{item.ownerName}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p>{truncateDescription(item.description !== "" ? item.description : item.reason, 17)}</p>
    </CardContent>
    <CardFooter className="flex justify-between">
      <p className="font-semibold"> ○ {item.location} </p>
      <p className="font-semibold">
        {" "}
        {item.type === "Donation"
          ? `○ Expires: ${item.expiryDate}`
          : ``}{" "}
      </p>

      <Drawer direction="right">
        <DrawerTrigger asChild>
          <Button onClick={() => handleViewDetails(item)}>View Details</Button>
        </DrawerTrigger>
        <DrawerContent className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] mt-24 fixed bottom-0 right-0">
          <DrawerDetail item={selectedItem} onClose={handleCloseDrawer} />
        </DrawerContent>
      </Drawer>
    </CardFooter>
  </Card>
))}

      </div>
    </div>
  );
}

export default DashboardPage;
