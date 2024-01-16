export const fetchIsWhiteNoise = async (data) => {
  return fetch(`${process.env.BACKEND_URL}/api/white-noise`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};

export const fetchDataStationarityTest = async (data) => {
  return fetch(`${process.env.BACKEND_URL}/api/stationarity-test`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};
