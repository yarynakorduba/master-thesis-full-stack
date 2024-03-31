import { TARIMAParams } from '../components/Analysis/types';

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

export const fetchGrangerDataCausalityTest = async (data, dataKeys) => {
  return fetch(`${process.env.BACKEND_URL}/api/granger-causality-test`, {
    method: 'POST',
    body: JSON.stringify({ data, dataKeys }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};

export const fetchVARTest = async (data, lagOrder: number, horizon: number) => {
  return fetch(`${process.env.BACKEND_URL}/api/test-var`, {
    method: 'POST',
    body: JSON.stringify({ data, lagOrder, horizon }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};

export const fetchARIMA = async (data, parameters: TARIMAParams) => {
  return fetch(`${process.env.BACKEND_URL}/api/get-arima-prediction`, {
    method: 'POST',
    body: JSON.stringify({ data, parameters }),
    headers: {
      'Content-type': 'application/json'
    }
  });
};
