import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { RxClock } from "react-icons/rx";
// import { IoIosArrowBack } from "react-icons/io";
import { GoSearch } from "react-icons/go";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BiMap } from "react-icons/bi";
import MapComponent from "../MapDonation/mapComponent";
import ToggleView from "./ToggleView";
import { useRouter } from "next/router";
import PointBadge from "./PointBadge";
import DashboardHeading from "./DashboardHeading";
import useFetchAll from "@/hook/useFetchAll";
import DialogComponent from "./DialogComponent";
import DrawerComponent from "./DrawerComponent";


function DashboardPage({ userId }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const router = useRouter();
  const [viewType, setViewType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'donations', or 'requests'
  const {items, isLoading } = useFetchAll();
  const [openDialog, setOpenDialog] = useState(false);


const handleToggleView = () => {
  if (viewType === "list") {
    setViewType("map");
    router.push('/map-view', undefined, { shallow: true });
  } else {
    setViewType("list");
    router.push('/dashboard', undefined, { shallow: true });
  }
};
  

  const handleSearchSubmit = () => {};
  
  const handleCloseModal = () =>{
    setOpenDialog(false);
  }

  const truncateDescription = (description, maxWords) => {
    const words = description.split(" ");
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return description;
  };


  useEffect(() => {
    if (router.query.id) {
      const item = items.find(item => item._id === router.query.id);
      setSelectedItem(item);
    }
  }, [router.query.id, items]);



  return (
    <div>
  {viewType === "list" ?
  <><div className="container mx-auto px-4 mt-6">
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
            <ToggleView viewType={viewType} handleToggleView={handleToggleView}></ToggleView>
            {/* Search Bar */}
            <div className="flex-grow flex items-center gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl" />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GoSearch className="h-5 w-5 text-gray-500" />
                </div>
              </div>
              <Button className="px-4 py-2 text-white bg-sky-500 hover:bg-sky-400 rounded transition duration-150 ease-in-out">
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
        </div><div className="grid grid-cols-2 gap-8">
            {items?.map((item) => (
              <Card
                key={item.id}
                className="flex flex-col bg-white rounded-lg shadow-lg"
              >
                <CardHeader className="flex-col gap-4 items-start">
                  <Badge
                    variant={`${item.type === "Request" ? "primary" : "secondary"}`}
                    className={`px-3 py-1 rounded-full text-sm font-large text-s ${item.type === "Request" ? "bg-sky-100" : "bg-emerald-100"}`}
                  >
                    {item.type === "Request"
                      ? `${item.type} 🤲`
                      : `${item.type} 🚀`}
                  </Badge>

                  <div className="flex flex-row gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={`/images/${item.image}`}
                        alt="Donation Image" />
                      <AvatarFallback>{item.type === "Donation" ? item?.description.slice(0, 2) : item?.reason.slice(0, 2)}</AvatarFallback>

                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{item?.title}</CardTitle>
                      <CardDescription>{item?.ownerName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{truncateDescription(item.type === "Donation" ? item?.description : item?.reason, 15)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-1 align-center">
                    <BiMap></BiMap>
                    <p className="font-medium text-sm"> {item?.location} </p>
                  </div>

                  <p className="font-medium text-sm">
                    {" "}
                    {item.type === "Donation"
                      ? `○ Expires: ${item?.expiryDate}`
                      : ``}{" "}
                  </p>
                  <DrawerComponent id={item._id} handleOpenDialog={setOpenDialog} selectedItem={selectedItem}></DrawerComponent>
                </CardFooter>
              </Card>
              
            ))}
;
            {/* Dialog UI */}
            {selectedItem && openDialog &&  <DialogComponent itemKey={JSON.stringify(selectedItem)} openDialog={openDialog} handleCloseModal={handleCloseModal} otherItem={selectedItem}></DialogComponent>}

          </div></> :
    <div>
      {/* Render the map view component or layout here */}
      <MapComponent/>
    </div>
  }
</div>
  );
}

export default DashboardPage;
