import { useCallback, useState } from 'react';

export const useFetch = (fetchRequest) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(undefined);

  const handleFetch = useCallback(async (d): Promise<any> => {
    try {
      setIsLoading(true);
      const result = await fetchRequest(d);
      const resultJSON = await result.json();
      setData(resultJSON);
      setIsLoading(false);
      return { status: 'SUCCESS', data: resultJSON };
    } catch (e) {
      setData(undefined);
      setIsLoading(false);
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
