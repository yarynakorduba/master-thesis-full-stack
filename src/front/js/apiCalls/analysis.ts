import { TARIMAUserParams } from '../pages/Configuration/Analysis/types';
import { handleFetch } from './utils';

export const fetchIsWhiteNoise = async (data) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/white-noise`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchDataStationarityTest = async (data) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/stationarity-test`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchGrangerDataCausalityTest = async (data, dataKeys) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/granger-causality-test`, {
      method: 'POST',
      body: JSON.stringify({ data, dataKeys }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchVAR = async (
  data,
  parameters: { lagOrder: number; horizon: number },
) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/test-var`, {
      method: 'POST',
      body: JSON.stringify({ data, ...parameters }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchARIMA = async (data, parameters: TARIMAUserParams) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/get-arima-prediction`, {
      method: 'POST',
      body: JSON.stringify({ data, parameters }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};
