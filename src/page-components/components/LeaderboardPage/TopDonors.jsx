import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


const TopDonors = () => {
    const { loading, error, currentUser } = useSelector((state) => state.user);
    const [data, setData] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const dummy_data = [
            {
              name: "Jackie Phan",
              avatar: `${currentUser.profileImage}`,
              points: "16,601,535",
              totalDonations: "100,000",
              totalTransactions: "500",
              rank: "gold",
            },
            {
              name: "Jackie Phan",
              avatar: `${currentUser.profileImage}`,
              points: "4,954,952",
              totalDonations: "50,000",
              totalTransactions: "300",
              rank: "silver",
            },
            {
              name: "Jackie Phan",
              avatar: `${currentUser.profileImage}`,
              points: "16,601,535",
              totalDonations: "75,000",
              totalTransactions: "400",
              rank: "platinum",
            },
          ];
          setData(dummy_data);
        } catch (error) {
          console.error('Failed to fetch donors:', error);
        }
      };
  
      fetchData();
    }, []);
  const getBadgeColor = (rank) => {
    switch (rank) {
      case "gold":
        return "text-yellow-500";
      case "silver":
        return "text-gray-400";
      case "platinum":
        return "text-blue-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <Card
            key={index}
            className="p-6 rounded-lg flex flex-col items-center relative bg-white border border-gray-300 shadow-sm"
          >
            <img
              src={`https://img.icons8.com/emoji/${index === 0 ? '48/1st-place-medal-emoji.png' : index === 1 ? '48/2nd-place-medal-emoji.png' : '48/3rd-place-medal-emoji.png'}`}
              alt={`${index + 1} place medal`}
              className="absolute top-0 right-0 w-18 h-18"
            />
            
            <div className="flex items-center gap-2 mb-4">
              <img
                src={`${currentUser.profileImage}`}
                alt="Donation Image"
                className="w-20 h-112 rounded-full object-cover"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  Phan Anh Nguyen
                </span>
                <span className="block text-sm text-gray-500">
                  @{`${currentUser.username}`}
                </span>
              </div>
            </div>
            <div className="text-center mb-4">
              <span>Rank: </span>
              <span className={`font-bold ${getBadgeColor(item.rank)}`}>
                {item.rank.charAt(0).toUpperCase() + item.rank.slice(1)}
              </span>
            </div>
            <div className="text-center mb-4">
              <span>Points: </span>
              <span className="font-bold">{item.points}</span>
            </div>
            <div className="text-center mb-4">
              <span>Total Donations: </span>
              <span className="font-bold">{item.totalDonations}</span>
            </div>
            <div className="text-center">
              <span>Total Transactions: </span>
              <span className="font-bold">
                {item.totalTransactions}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopDonors;
