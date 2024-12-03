import { THistoryEntry } from '../pages/Configuration/Analysis/types';
import { TConfiguration } from '../store/types';
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

export const createConfig = async (config: TConfiguration) => {
  const formData = new FormData();

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

export const addEntryToPredictionHistory = async (
  prediction: THistoryEntry,
) => {
  const body = {
    test_prediction_parameters: [],
    real_prediction_parameters: [],
    train_extent: {},

    ...mapKeys(prediction, (v, key) => snakeCase(key)),
  };
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/prediction_history`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(body),
    }),
  );
};

export const fetchPredictionHistoryByConfigId = async (
  configurationId: string,
) => {
  return handleFetch(
    fetch(
      `${process.env.BACKEND_URL}/api/prediction_history?configuration_id=${configurationId}`,
      { method: 'GET', headers: { 'Content-type': 'application/json' } },
    ),
  );
};
