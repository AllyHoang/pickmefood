import { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { Button } from "@/components/ui/button";
import MapComponent from "../MapDonation/mapComponent";
import ToggleView from "./ToggleView";
import { useRouter } from "next/router";
import PointBadge from "./PointBadge";
import DashboardHeading from "./DashboardHeading";
import useFetchAllBaskets from "@/hook/useFetchAllBaskets";
import DialogComponent from "./DialogComponent";
import DrawerComponent from "./DrawerComponent";
import { Status } from "@/lib/utils";
import Link from "next/link";
import { useSelector } from "react-redux";
import PreferenceModal from "./PreferenceModal";
import CardComponent from "./CardComponent";
import useUser from "@/hook/useUser";
import { BiMap } from "react-icons/bi";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function DashboardPage({ userId }) {
  const [selectedBasket, setSelectedBasket] = useState(null);
  const router = useRouter();
  const [viewType, setViewType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'donations', or 'requests'
  const { baskets, isLoading } = useFetchAllBaskets();
  const [openDialog, setOpenDialog] = useState(false);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [weights, setWeights] = useState({
    items: 0.6,
    urgency: 0.3,
    points: 0.1,
  });

  const handleOpenPreferenceModal = () => {
    setIsPreferenceModalOpen(true);
  };

  const handleClosePreferenceModal = () => {
    setIsPreferenceModalOpen(false);
  };

  const handleSavePreferences = (newWeights) => {
    setWeights(newWeights);
    // You may also want to re-calculate matches with the new weights here
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

  const handleCloseModal = () => {
    setOpenDialog(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredBaskets = baskets.filter((basket) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      basket.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      basket.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  useEffect(() => {
    console.log(router.query);
    if (router.query.id) {
      const basket = baskets.find((basket) => basket._id === router.query.id);
      setSelectedBasket(basket);
    }
  }, [router.query.id, baskets])

  useEffect(() => {
    const fetchMatches = async () => {
      const responseDonation = await fetch(
        `/api/matching-algorithm/${userId}/donation`
      );
      const responseRequest = await fetch(
        `/api/matching-algorithm/${userId}/request`
      );
      const dataDonation = await responseDonation.json();
      const dataRequest = await responseRequest.json();
      const data = [...dataDonation, ...dataRequest];
      setMatches(data);
    };

    fetchMatches();
  }, []);

  return (
    <div>
      {viewType === "list" ? (
        <>
          <div className="container mx-auto px-4 mt-6">
            <div className="grid grid-cols-3 items-center gap-4 mb-5">
              {/* Heading */}
              <DashboardHeading userId={userId}></DashboardHeading>
              {/* Point Badge */}
              <PointBadge userId ={userId}></PointBadge>
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
          </div>
          <div className="max-w-screen-2xl mx-auto w-full pb-4 mt-10">
            <Card className="border-none drop-shadow-sm ">
              <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                <CardTitle className="text-heading3-bold line-clamp-1">
                  Top Match
                </CardTitle>
                <div className="flex justify-center align-middle gap-2">
                  <Button className="bg-sky-400" size="sm">
                    View Matches
                  </Button>
                  <Button
                    className=""
                    size="sm"
                    onClick={handleOpenPreferenceModal}
                  >
                    Change Preference
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="w-full">
                <div className="grid grid-cols-2 gap-4">
                  {matches?.map((match) => {
                    return (
                      <CardComponent
                        basket={match}
                        setOpenDialog={setOpenDialog}
                        selectedBasket={selectedBasket}
                        key={match._id}
                        className="flex flex-col bg-white rounded-lg shadow-lg"
                      ></CardComponent>
                    );
                  })}
                  {/* Dialog UI */}
                  {selectedBasket && openDialog && (
                    <DialogComponent
                      itemKey={JSON.stringify(selectedBasket)}
                      openDialog={openDialog}
                      handleCloseModal={handleCloseModal}
                      otherBasket={selectedBasket}
                    ></DialogComponent>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {filteredBaskets?.map((basket) => {
              return (
                <CardComponent
                  basket={basket}
                  setOpenDialog={setOpenDialog}
                  selectedBasket={selectedBasket}
                  key={basket._id}
                  className="flex flex-col bg-white rounded-lg shadow-lg"
                ></CardComponent>
              );
            })}
            {/* Dialog UI */}

            {selectedBasket && openDialog && (
              <DialogComponent
                itemKey={JSON.stringify(selectedBasket)}
                openDialog={openDialog}
                handleCloseModal={handleCloseModal}
                otherBasket={selectedBasket}
              ></DialogComponent>
            )}
          </div>
        </>
      ) : (
        <div>
          {/* Render the map view component or layout here */}
          <MapComponent />
        </div>
      )}
      <PreferenceModal
        isOpen={isPreferenceModalOpen}
        onRequestClose={handleClosePreferenceModal}
        onSave={handleSavePreferences}
      />
    </div>
  );
}

export default DashboardPage;
