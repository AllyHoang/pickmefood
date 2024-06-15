import { useState, useEffect } from 'react';

/**
 * Custom React hook to fetch all relevant information of a user
 * @param {string} userId - The ID of the user
 * @returns {Object} - An object containing the user's information
 */
function useUser(userId) {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${userId}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await res.json();
        setUser(data.user);
        setError(null); 
      } catch (error) {
        setError(error); // Update error state
        console.error("Error loading users:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (userId) {
      fetchItems(); 
    }
  }, [userId]); 

  return { user, loading, error }; 
}

export default useUser;
