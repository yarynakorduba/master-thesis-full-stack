import { SHOULD_CLEAR_STORE } from '../consts';
import { fetchConfigs } from 'front/js/apiCalls/configuration';

export const FETCH_CONFIGS_START = 'FETCH_CONFIGS_START';
export const FETCH_CONFIGS_SUCCESS = 'FETCH_CONFIGS_SUCCESS';
export const FETCH_CONFIGS_FAILURE = 'FETCH_CONFIGS_FAILURE';

export default (set, get) => ({
  fetchConfigs: async () => {
    set(
      () => ({ data: undefined, isLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_CONFIGS_START,
    );

    const response = await fetchConfigs();

    const isSuccess = response.isSuccess;

    set(
      () => ({
        data: response,
        isLoading: false,
      }),
      SHOULD_CLEAR_STORE,
      isSuccess ? FETCH_CONFIGS_SUCCESS : FETCH_CONFIGS_FAILURE,
    );
  },
});
