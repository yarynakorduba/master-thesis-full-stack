import { TARIMAUserParams } from '../pages/Configuration/Analysis/types';
import { handleFetch } from './utils';

export const fetchIsWhiteNoise = async (
  data,
  dataKeys: string[],
  maxLagOrder: number,
) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/white-noise`, {
      method: 'POST',
      body: JSON.stringify({
        data,
        data_keys: dataKeys,
        max_lag_order: maxLagOrder,
      }),
      headers: { 'Content-type': 'application/json' },
    }),
  );
};

export const fetchDataStationarityTest = async (data) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/stationarity-test`, {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: { 'Content-type': 'application/json' },
    }),
  );
};

export const fetchGrangerDataCausalityTest = async (
  data,
  dataKeys: string[],
) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/granger-causality-test`, {
      method: 'POST',
      body: JSON.stringify({ data, data_keys: dataKeys }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchVAR = async (
  data,
  parameters: { lagOrder: number; horizon: number },
  dataKeys: { date_key: string; value_keys: string[] },
) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/var-prediction`, {
      method: 'POST',
      body: JSON.stringify({ data, parameters, data_keys: dataKeys }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};

export const fetchARIMA = async (
  data,
  parameters: TARIMAUserParams,
  dataKeys,
) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/arima-prediction`, {
      method: 'POST',
      body: JSON.stringify({ data, parameters, data_keys: dataKeys }),
      headers: {
        'Content-type': 'application/json',
      },
    }),
  );
};
