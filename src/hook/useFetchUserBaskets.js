import { useState, useEffect } from "react";

/**
 * Custom React hook to fetch donation baskets and request baskets for a specific user
 * @param {string} userId - The ID of the user whose baskets to fetch
 * @returns {Object} - An object containing the list of donationBaskets and requestBaskets
 */
function useFetchUserBaskets(userId) {
  const [donationBaskets, setDonationBaskets] = useState([]);
  const [requestBaskets, setRequestBaskets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBaskets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch(`/api/baskets/${userId}`, { cache: "no-store" }),
          fetch(`/api/basketrequests/${userId}`, { cache: "no-store" }),
        ]);
        if (!donationRes.ok || !requestRes.ok) {
          throw new Error("Failed to fetch items");
        }

        const [userDonationBaskets, userRequestBaskets] = await Promise.all([
          donationRes.json(),
          requestRes.json(),
        ]);
        // console.log(userDonationBaskets, userRequestBaskets);

        setDonationBaskets(userDonationBaskets.baskets);
        setRequestBaskets(userRequestBaskets.baskets);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchBaskets();
    }
  }, []);
  return { donationBaskets, requestBaskets, isLoading, error };
}

export default useFetchUserBaskets;
