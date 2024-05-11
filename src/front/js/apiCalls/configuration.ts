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
  formData.append('data', JSON.stringify(config.data));
  formData.append('name', config.name);
  formData.append('id', uuidv4());
  // console.log('FORM DATA --- > ', formData, blobData);
  // const data = { id: uuidv4(), ...config };
  return handleFetch(
    fetch(`${process.env.BACKEND_URL}/api/configurations/create`, {
      method: 'POST',
      body: formData,
      // headers: { 'Content-type': 'application/json' },
    }),
  );
};
