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

export const fetchGrangerDataCausalityTest = async (data) => {
  return fetch(`${process.env.BACKEND_URL}/api/granger-causality-test`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};

export const fetchVARTest = async (data) => {
  return fetch(`${process.env.BACKEND_URL}/api/test-var`, {
    method: 'POST',
    body: JSON.stringify({ data }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};
