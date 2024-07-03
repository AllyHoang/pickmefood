import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card } from "@/components/ui/card";

const TopDonors = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  const rankTiers = [
    { name: "Bronze", minPoints: 0, maxPoints: 100 },
    { name: "Silver", minPoints: 101, maxPoints: 200 },
    { name: "Gold", minPoints: 201, maxPoints: 300 },
    { name: "Platinum", minPoints: 301, maxPoints: Infinity }, // Infinity for the highest tier
  ];

  // Function to determine rank based on points
  const getRank = (points) => {
    const tier = rankTiers.find(
      (tier) => points >= tier.minPoints && points <= tier.maxPoints
    );
    return tier ? tier.name : "Unknown";
  };

  // Function to fetch baskets data for a user
  const fetchBasketsData = async (userId) => {
    try {
      const response = await axios.get(`/api/baskets/${userId}`);
      return response.data.baskets || []; // Return baskets data or an empty array
    } catch (error) {
      console.error(`Error fetching baskets for user ${userId}:`, error);
      return []; // Return empty array if fetching fails
    }
  };

  // Function to fetch transactions data for a user
  const fetchTransactionsData = async (userId) => {
    try {
      const response = await axios.get(`/api/transactions/users/${userId}`);
      return response.data.transactions || []; // Return transactions data or an empty array
    } catch (error) {
      console.error(`Error fetching transactions for user ${userId}:`, error);
      return []; // Return empty array if fetching fails
    }
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await axios.get("/api/users");
        const users = response.data.allUsers;

        const promises = users.map(async (user) => {
          // Fetch baskets and transactions concurrently
          const [baskets, transactions] = await Promise.all([
            fetchBasketsData(user._id),
            fetchTransactionsData(user._id),
          ]);

          // Calculate total donations and transactions
          const totalDonations = baskets.length;
          const totalTransactions = transactions.length;

          return {
            ...user,
            totalDonations,
            totalTransactions,
            points: user.points, // Assuming 'points' is already available in user data
          };
        });

        // Wait for all promises to resolve
        const updatedUsers = await Promise.all(promises);

        // Sort users based on descending points
        updatedUsers.sort((a, b) => b.points - a.points);

        // Update state with the top 3 donors
        setData(updatedUsers.slice(0, 3));
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle specific error codes or messages here
        // Example: Show a notification or retry mechanism
      }
    };

    fetchUsersData();
  }, []);

  const getBadgeColor = (rank) => {
    switch (rank) {
      case "Gold":
        return "text-yellow-500";
      case "Silver":
        return "text-gray-400";
      case "Platinum":
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
              src={`https://img.icons8.com/emoji/${
                index === 0
                  ? "48/1st-place-medal-emoji.png"
                  : index === 1
                  ? "48/2nd-place-medal-emoji.png"
                  : "48/3rd-place-medal-emoji.png"
              }`}
              alt={`${index + 1} place medal`}
              className="absolute top-0 right-0 w-18 h-18"
            />

            <div className="flex items-center gap-2 mb-4">
              <img
                src={`${item.profileImage}`}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <span className="block text-sm font-medium text-gray-900">
                  {item.username}
                </span>
                <span className="block text-sm text-gray-500">
                  @{item.username}
                </span>
              </div>
            </div>
            <div className="text-center mb-4">
              <span>Rank: </span>
              <span
                className={`font-bold ${getBadgeColor(getRank(item.points))}`}
              >
                {getRank(item.points)}
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
              <span className="font-bold">{item.totalTransactions}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TopDonors;
