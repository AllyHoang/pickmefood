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
import CardComponent from "./CardComponent";
import useUser from "@/hook/useUser";

function DashboardPage({ userId }) {
  const [selectedBasket, setSelectedBasket] = useState(null);
  const router = useRouter();
  const [viewType, setViewType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'donations', or 'requests'
  const { baskets, isLoading } = useFetchAllBaskets();
  const [openDialog, setOpenDialog] = useState(false);

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

  useEffect(() => {
    console.log(router.query);
    if (router.query.id) {
      const basket = baskets.find((basket) => basket._id === router.query.id);
      setSelectedBasket(basket);
    }
  }, [router.query.id, baskets]);

  return (
    <div>
      {viewType === "list" ? (
        <>
          <div className="container mx-auto px-4 mt-6">
            <div className="grid grid-cols-3 items-center gap-4 mb-5">
              {/* Heading */}
              <DashboardHeading userId={userId}></DashboardHeading>
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

          <div className="grid grid-cols-2 gap-4">
            {baskets?.map((basket) => (
              <CardComponent
                key={basket._id}
                basket={basket}
                setOpenDialog={setOpenDialog}
                selectedBasket={selectedBasket}
              ></CardComponent>
            ))}
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
    </div>
  );
}

export default DashboardPage;
