import { useState, useEffect } from 'react';

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
          fetch('/api/baskets', {
            cache: 'no-store',
          }),
          fetch('/api/basketrequests', {
            cache: 'no-store',
          }),
        ]);

        if (!donationRes.ok || !requestRes.ok) {
          throw new Error('Failed to fetch items');
        }

        const [donationData, requestData] = await Promise.all([
          donationRes.json(),
          requestRes.json(),
        ]);
        console.log(donationData, requestData);

        const combinedBaskets = [
          ...donationData.baskets,
          ...requestData.baskets,
        ];

        setBaskets(combinedBaskets);
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
