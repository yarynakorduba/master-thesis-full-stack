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
