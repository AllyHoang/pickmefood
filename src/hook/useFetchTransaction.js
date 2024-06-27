import { useState, useEffect } from 'react';
import { useSelector } from "react-redux";

/**
 * Custom React hook to fetch active items for a given user.
 * @param {string} userId - The ID of the user for whom to fetch transactions.
 * @returns {Object} - An object containing the list of transactions and any loading or error state.
 */
function useFetchTransaction(userId) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, seIstLoading] = useState(false); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      seIstLoading(true);
      try {
        const res = await fetch(`/api/transactions/users/${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await res.json();
        console.log(data);
        setTransactions(data.transactions);
        setError(null); 
      } catch (error) {
        setError(error); // Update error state
        console.error("Error loading items:", error);
      } finally {
        seIstLoading(false); 
      }
    };

    if (userId) {
      fetchTransactions(); 
    }
  }, [userId]); 

  return { transactions, isLoading, error }; 
}

export default useFetchTransaction;
