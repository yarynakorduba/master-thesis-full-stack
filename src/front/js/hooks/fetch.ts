import { useCallback, useState } from 'react';

export const useFetch = (fetchRequest) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const handleFetch = useCallback(async (d) => {
    try {
      setIsLoading(true);
      const result = await fetchRequest(d);
      const resultJSON = await result.json();
      setIsLoading(false);
      setData(result.data);
      return { status: 'SUCCESS', data: resultJSON };
    } catch (e) {
      setIsLoading(false);
      setData(undefined);
      return { status: 'FAILURE', data: null, error: e };
    }
  }, []);

  return {
    data,
    setData,
    isLoading,
    setIsLoading,
    fetch: handleFetch
  };
};
