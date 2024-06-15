import { useState, useEffect } from 'react';

/**
 * Custom React hook to fetch active items for a given user.
 * @param {string} userId - The ID of the user for whom to fetch items.
 * @returns {Object} - An object containing the list of items and any loading or error state.
 */
function useFetchActiveItems(userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/activeItem/${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error('Failed to fetch items');
        }

        const data = await res.json();
        setItems(data.items);
        setError(null); 
      } catch (error) {
        setError(error); // Update error state
        console.error("Error loading items:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (userId) {
      fetchItems(); 
    }
  }, [userId]); 

  return { items, loading, error }; 
}

export default useFetchActiveItems;
