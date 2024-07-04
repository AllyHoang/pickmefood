import { useState, useEffect } from "react";

/**
 * Custom React hook to fetch all baskets and requestbaskets
 * @returns {Object} - An object containing the list of baskets and requestBaskets
 */
function useFetchAllBaskets() {
  const [baskets, setBaskets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBaskets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch("/api/baskets", {
            cache: "no-store",
          }),
          fetch("/api/basketrequests", {
            cache: "no-store",
          }),
        ]);

        if (!donationRes.ok || !requestRes.ok) {
          throw new Error("Failed to fetch items");
        }

        const [donationData, requestData] = await Promise.all([
          donationRes.json(),
          requestRes.json(),
        ]);

        const donationBaskets = donationData.baskets.map((basket) => ({
          ...basket,
          type: "Donation",
        }));

        const requestBaskets = requestData.baskets.map((basket) => ({
          ...basket,
          type: "Request",
        }));

        const combinedBaskets = [...donationBaskets, ...requestBaskets].filter(
          (basket) => basket.status !== "accepted"
        );

        setBaskets(combinedBaskets);
        // dispatch(combinedBaskets);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBaskets();
  }, []);

  return { baskets, isLoading, error };
}

export default useFetchAllBaskets;
