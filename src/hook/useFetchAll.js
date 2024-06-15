import { useState, useEffect } from 'react';

function useFetchAll() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [donationRes, requestRes] = await Promise.all([
          fetch('/api/items', {
            cache: 'no-store',
          }),
          fetch('/api/requests', {
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

        const combinedItems = [
          ...donationData.items.map(item => ({ ...item, type: 'Donation' })),
          ...requestData.requests.map(item => ({ ...item, type: 'Request' })),
        ];

        setItems(combinedItems);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, isLoading, error };
}

export default useFetchAll;
