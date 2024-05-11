import { v4 as uuidv4 } from 'uuid';
import { handleFetch } from './analysis';

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

export const createConfig = async (config) => {
  // Creating FormData object
  const formData = new FormData();

  // Add data to the object
  // Here myfile is the name of the form field
  formData.append('id', uuidv4());
  formData.append('name', config.name);
  formData.append('data', JSON.stringify(config.data));
  formData.append('time_property', JSON.stringify(config.timeProperty));
  formData.append('value_properties', JSON.stringify(config.valueProperties));

  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations/create`, {
      method: 'POST',
      body: formData,
    }),
  );
};
