export const handleFetch = async (fetchRequest): Promise<any> => {
  try {
    const response = await fetchRequest;
    const resultJSON = await response.json();
    if (!response.ok) {
      throw new Error(resultJSON.message);
    }
    return { isSuccess: true, data: resultJSON };
  } catch (e) {
    return { isSuccess: false, data: null, error: e };
  }
};
