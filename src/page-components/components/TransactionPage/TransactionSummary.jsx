import { useEffect, useState } from "react";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

const TransactionSummary = ({canceledTransactions, acceptedTransactions, pendingTransactions, matchedTransactions}) => {
  const [transactions, setTransactions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setTransactions({
        matched: matchedTransactions.length,
        pending: pendingTransactions.length,
        accepted: acceptedTransactions.length,
        cancelled: canceledTransactions.length,
      });
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Pending",
      count: pendingTransactions.length,
      bgColor: "bg-blue-200",
      Icon: FiPackage,
      iconBgColor: "bg-blue-100",
    },
    {
      label: "Matched",
      count: matchedTransactions.length,
      bgColor: "bg-orange-200",
      Icon: FiClock,
      iconBgColor: "bg-orange-100",
    },
    {
      label: "Accepted",
      count: acceptedTransactions.length,
      bgColor: "bg-green-200",
      Icon: FiCheckCircle,
      iconBgColor: "bg-green-100",
    },
    {
      label: "Cancelled",
      count: canceledTransactions.length,
      bgColor: "bg-red-200",
      Icon: FiXCircle,
      iconBgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-5">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-md ${stat.bgColor} flex items-center space-x-2`}
        >
          <div className={`rounded-full p-2 ${stat.iconBgColor}`}>
            <stat.Icon className="text-2xl" />
          </div>
          <div>
            <div className="text-lg font-medium">{stat.label}</div>
            <div className="text-heading2-bold font-bold">{stat.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionSummary;
