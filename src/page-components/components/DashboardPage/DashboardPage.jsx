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

  useEffect(() => {
    console.log(router.query);
    if (router.query.id) {
      const basket = baskets.find((basket) => basket._id === router.query.id);
      setSelectedBasket(basket);
    }
  }, [router.query.id, baskets]);

  useEffect(() => {
    const fetchMatches = async () => {
      const responseDonation = await fetch(
        `/api/matching-algorithm/${currentUser.id}/donation`
      );
      const responseRequest = await fetch(
        `/api/matching-algorithm/${currentUser.id}/request`
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
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {matches?.map((match) => (
                    <Card
                      key={match._id}
                      className="flex flex-col bg-white rounded-lg shadow-lg"
                    >
                      <CardHeader className="flex-col gap-4 items-start">
                        <Badge
                          variant={`${
                            match.type === "Request" ? "primary" : "secondary"
                          }`}
                          className={`px-3 py-1 rounded-full text-sm font-large text-s ${
                            match.type === "Request"
                              ? "bg-sky-100"
                              : "bg-emerald-100"
                          }`}
                        >
                          {match.type === "Request"
                            ? `${match.type} 🤲`
                            : `${match.type} 🚀`}
                        </Badge>

                        <div className="flex flex-row gap-4 items-center">
                          <Avatar>
                            <AvatarImage
                              src={`${match?.userId?.profileImage}`}
                              alt="Donation Image"
                            />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-xl">
                              {match?.title}
                            </CardTitle>
                            <CardDescription>
                              {match.type === "Donation"
                                ? match?.description?.slice(0, 2)
                                : match?.reason?.slice(0, 2)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>
                          {truncateDescription(
                            match.type === "Donation"
                              ? match?.description
                              : match?.reason,
                            15
                          )}
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex items-center gap-1 align-center">
                          <BiMap></BiMap>
                          <p className="font-medium text-sm">
                            {" "}
                            {match?.location}{" "}
                          </p>
                        </div>
                        {match.status === "initiated" ||
                        match?.status == undefined ? (
                          <DrawerComponent
                            id={match._id}
                            handleOpenDialog={setOpenDialog}
                            selectedBasket={selectedBasket}
                          />
                        ) : match.status === "accepted" ? (
                          <Button className="bg-green-500">Accepted</Button>
                        ) : match.status === "canceled" ? (
                          <Button className="bg-red-500">Canceled</Button>
                        ) : (
                          <Link
                            href={{ pathname: "/notifications" }}
                            shallow={true}
                          >
                            <Button className="bg-sky-500">Let's chat</Button>
                          </Link>
                        )}
                      </CardFooter>
                    </Card>
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
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {baskets?.map((basket) => (
              <CardComponent
                key={basket._id}
                className="flex flex-col bg-white rounded-lg shadow-lg"
              >
                <CardHeader className="flex-col gap-4 items-start">
                  <Badge
                    variant={`${
                      basket.type === "Request" ? "primary" : "secondary"
                    }`}
                    className={`px-3 py-1 rounded-full text-sm font-large text-s ${
                      basket.type === "Request"
                        ? "bg-sky-100"
                        : "bg-emerald-100"
                    }`}
                  >
                    {basket.type === "Request"
                      ? `${basket.type} 🤲`
                      : `${basket.type} 🚀`}
                  </Badge>

                  <div className="flex flex-row gap-4 items-center">
                    <Avatar>
                      <AvatarImage
                        src={`${basket?.userId?.profileImage}`}
                        alt="Donation Image"
                      />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{basket?.title}</CardTitle>
                      <CardDescription>
                        {basket.type === "Donation"
                          ? basket?.description?.slice(0, 2)
                          : basket?.reason?.slice(0, 2)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    {truncateDescription(
                      basket.type === "Donation"
                        ? basket?.description
                        : basket?.reason,
                      15
                    )}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-1 align-center">
                    <BiMap></BiMap>
                    <p className="font-medium text-sm"> {basket?.location} </p>
                  </div>
                  {basket.status === "initiated" ||
                  basket?.status == undefined ? (
                    <DrawerComponent
                      id={basket._id}
                      handleOpenDialog={setOpenDialog}
                      selectedBasket={selectedBasket}
                    />
                  ) : basket.status === "accepted" ? (
                    <Button className="bg-green-500">Accepted</Button>
                  ) : basket.status === "canceled" ? (
                    <Button className="bg-red-500">Canceled</Button>
                  ) : (
                    <Link href={{ pathname: "/notifications" }} shallow={true}>
                      <Button className="bg-sky-500">Let's chat</Button>
                    </Link>
                  )}
                </CardFooter>
              </Card>
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
  <PreferenceModal
        isOpen={isPreferenceModalOpen}
        onRequestClose={handleClosePreferenceModal}
        onSave={handleSavePreferences}
      />  
    </div>
  );
}

export default DashboardPage;
