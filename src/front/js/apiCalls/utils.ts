export const handleFetch = async (fetchRequest): Promise<any> => {
  try {
    const result = await fetchRequest;
    const resultJSON = await result.json();
    return { isSuccess: true, data: resultJSON };
  } catch (e) {
    return { isSuccess: false, data: null, error: e };
  }
};
