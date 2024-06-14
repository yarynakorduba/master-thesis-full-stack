import { filter } from 'lodash';

import { SHOULD_CLEAR_STORE } from '../consts';
import { deleteConfig, fetchConfigs } from '../../apiCalls/configuration';
import {
  FETCH_CONFIGS_START,
  FETCH_CONFIGS_SUCCESS,
  FETCH_CONFIGS_FAILURE,
  DELETE_CONFIG_START,
  DELETE_CONFIG_SUCCESS,
  DELETE_CONFIG_FAILURE,
} from './actionNames';

export default (set) => ({
  fetchConfigs: async () => {
    set(
      () => ({ configsList: undefined, isLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_CONFIGS_START,
    );

    const response = await fetchConfigs();

    const isSuccess = response.isSuccess;
    set(
      () => ({ configsList: response.data, isLoading: false }),
      SHOULD_CLEAR_STORE,
      isSuccess ? FETCH_CONFIGS_SUCCESS : FETCH_CONFIGS_FAILURE,
    );
  },

  deleteConfig: async (id: string) => {
    set(() => ({ isDeleting: true }), SHOULD_CLEAR_STORE, DELETE_CONFIG_START);
    const response = await deleteConfig(id);
    const isSuccess = response.isSuccess;
    set(
      (state) => ({
        configsList: filter(state.configsList, (config) => config.id !== id),
        isDeleting: false,
      }),
      SHOULD_CLEAR_STORE,
      isSuccess ? DELETE_CONFIG_SUCCESS : DELETE_CONFIG_FAILURE,
    );
  },
});
