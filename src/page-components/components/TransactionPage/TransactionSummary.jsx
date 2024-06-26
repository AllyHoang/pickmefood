import { useEffect, useState } from "react";
import { FiClock, FiCheckCircle, FiXCircle, FiPackage, FiTruck } from "react-icons/fi";

const TransactionSummary = () => {
  const [transactions, setTransactions] = useState({
    total: 1000,
    pending: 145,
    accepted: 812,
    cancelled: 80,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Simulate fetching data
      setTransactions({
        total: 1000,
        pending: 145,
        accepted: 812,
        cancelled: 80,
      });
    };

    fetchData();
  }, []);

  const stats = [
    { label: "Total", count: transactions.total, bgColor: "bg-blue-200", Icon: FiPackage, iconBgColor: "bg-blue-100" },
    { label: "Pending", count: transactions.pending, bgColor: "bg-orange-200", Icon: FiClock, iconBgColor: "bg-orange-100" },
    { label: "Accepted", count: transactions.accepted, bgColor: "bg-green-200", Icon: FiCheckCircle, iconBgColor: "bg-green-100" },
    { label: "Cancelled", count: transactions.cancelled, bgColor: "bg-red-200", Icon: FiXCircle, iconBgColor: "bg-red-100" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-5">
      {stats.map((stat, index) => (
        <div key={index} className={`p-4 rounded-lg shadow-md ${stat.bgColor} flex items-center space-x-2`}>
          <div className={`rounded-full p-2 ${stat.iconBgColor}`}>
            <stat.Icon className="text-2xl" />
          </div>
          <div>
            <div className="text-lg font-semibold">{stat.label}</div>
            <div className="text-xl font-bold">{stat.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;
