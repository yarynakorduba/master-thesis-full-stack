import { handleFetch } from './utils';
import { mapKeys, snakeCase } from 'lodash';

export const fetchConfigs = async () => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    }),
  );
};

export const fetchConfig = async (id: string) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations?id=${id}`, {
      method: 'GET',
      headers: { 'Content-type': 'application/json' },
    }),
  );
};

export const deleteConfig = async (id: string) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations?id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
    }),
  );
};

export const createConfig = async (config) => {
  // Creating FormData object
  const formData = new FormData();

  // Add data to the object
  // Here myfile is the name of the form field
  formData.append('id', config.id);
  formData.append('name', config.name);
  formData.append('data', JSON.stringify(config.data));
  formData.append('time_property', JSON.stringify(config.timeProperty));
  formData.append('value_properties', JSON.stringify(config.valueProperties));

  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations`, {
      method: 'POST',
      body: formData,
    }),
  );
};

export const addEntryToPredictionHistory = async (prediction) => {
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/prediction_history`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(mapKeys(prediction, (value, key) => snakeCase(key))),
    }),
  );
};

export const fetchPredictionHistoryByConfigId = async (
  configurationId: string,
) => {
  return handleFetch(
    fetch(
      `${process.env.BACKEND_URL}/api/prediction_history?configuration_id=${configurationId}`,
      {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
      },
    ),
  );
};
