import { useEffect, useRef, useState } from "react";
import { GoSearch } from "react-icons/go";
import { Button } from "@/components/ui/button";
import MapComponent from "../MapDonation/mapComponent";
import ToggleView from "./ToggleView";
import { useRouter } from "next/router";
import PointBadge from "./PointBadge";
import DashboardHeading from "./DashboardHeading";
import useFetchAllBaskets from "@/hook/useFetchAllBaskets";
import DialogComponent from "./DialogComponent";
import { useSelector } from "react-redux";
import PreferenceModal from "./PreferenceModal";
import CardComponent from "./CardComponent";
import PaginationComponent from "../Pagination/Pagination";
import TopMatchComponent from "./TopMatchComponent";
import LoadingPage from "../LoadingPage";

function DashboardPage({ userId }) {
  const [selectedBasket, setSelectedBasket] = useState(null);
  const router = useRouter();
  const [viewType, setViewType] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'donations', or 'requests'
  const { baskets, isLoading:isLoadingAllBaskets } = useFetchAllBaskets();
  const [openDialog, setOpenDialog] = useState(false);
  const { loading, error, currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [weights, setWeights] = useState({
    items: 0.6,
    urgency: 0.3,
    points: 0.1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 10;

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
      basket?.title?.toLowerCase().includes(lowerCaseSearchTerm) &&
      (filterType === "all" || basket.type === filterType)
    );
  });

  const filteredMatches = matches.filter((match) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return (
      match?.title?.toLowerCase().includes(lowerCaseSearchTerm) &&
      (filterType === "all" || match.type === filterType)
    );
  });

  useEffect(() => {
    console.log(router.query);
    if (router.query.id) {
      const basket = baskets.find((basket) => basket._id === router.query.id);
      setSelectedBasket(basket);
    }
  }, [router.query.id, baskets]);


  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);  // Start loading before the fetch calls
      try {
        // Fetch donation data
        const responseDonation = await fetch(`/api/matching-algorithm/${userId}/donation`);
        if (!responseDonation.ok) {
          throw new Error('Failed to fetch donation data');
        }
        const dataDonation = await responseDonation.json();

        // Fetch request data
        const responseRequest = await fetch(`/api/matching-algorithm/${userId}/request`);
        if (!responseRequest.ok) {
          throw new Error('Failed to fetch request data');
        }
        const dataRequest = await responseRequest.json();

        // Combine data from both requests
        const data = [...dataDonation, ...dataRequest];
        setMatches(data);
      } catch (error) {
        console.error('Error fetching match data:', error);
        // Handle errors here, e.g., set error state, show notification, etc.
      } finally {
        setIsLoading(false);  // Stop loading regardless of the result
      }
    };

    fetchMatches();
  }, [userId]);  // Including userId as a dependency if it might change and re-trigger the effect


  const totalCards = matches.length + baskets.length;

  const paginatedMatches = matches.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  // const paginatedBaskets = baskets.slice(
  //   (currentPage - 1) * cardsPerPage,
  //   currentPage * cardsPerPage
  // );

  return (
    <>
      {(isLoadingAllBaskets || isLoading) ? (
        <LoadingPage />
      ) : (
        <div className="base-container">
          {viewType === "list" ? (
            <>
              <div className="container mx-auto px-4 mt-6 hide-scrollbar">
                <div className="grid grid-cols-3 items-center gap-4 mb-5">
                  <DashboardHeading userId={userId} />
                  <PointBadge userId={userId} />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <ToggleView
                    viewType={viewType}
                    handleToggleView={handleToggleView}
                  />
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
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="ml-4 p-2 border border-gray-300 rounded-xl"
                  >
                    <option value="all">All</option>
                    <option value="Donation">Donations</option>
                    <option value="Request">Requests</option>
                  </select>
                </div>
              </div>

              <p className="text-heading3-bold mt-6 mb-6">Top Matches</p>
              <TopMatchComponent
                matches={filteredMatches}
                handleOpenPreferenceModal={handleOpenPreferenceModal}
                setOpenDialog={setOpenDialog}
                selectedBasket={selectedBasket}
                handleCloseModal={handleCloseModal}
                openDialog={openDialog}
              />

              <p className="text-heading3-bold mt-6 mb-6">All Postings</p>
              <div className="grid grid-cols-3 gap-7">
                {filteredBaskets?.map((basket) => (
                  <CardComponent
                    basket={basket}
                    setOpenDialog={setOpenDialog}
                    selectedBasket={selectedBasket}
                    key={basket._id}
                    className="flex flex-col bg-white rounded-lg shadow-lg"
                    onPage="dashboard"
                  />
                ))}
                {selectedBasket && openDialog && (
                  <DialogComponent
                    itemKey={JSON.stringify(selectedBasket)}
                    openDialog={openDialog}
                    handleCloseModal={handleCloseModal}
                    otherBasket={selectedBasket}
                  />
                )}
              </div>
            </>
          ) : (
            <div>
              <MapComponent />
            </div>
          )}
          <PreferenceModal
            isOpen={isPreferenceModalOpen}
            onRequestClose={handleClosePreferenceModal}
            onSave={handleSavePreferences}
          />
               <div className="mt-3">
        <PaginationComponent
          totalCards={totalCards}
          cardsPerPage={cardsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div> 
        </div>

      )}
    </>
  );
}

export default DashboardPage;
