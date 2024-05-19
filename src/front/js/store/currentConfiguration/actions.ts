import {
  map,
  every,
  reduce,
  isNil,
  flow,
  sortBy,
  camelCase,
  mapKeys,
} from 'lodash';

import { v4 as uuidv4 } from 'uuid';

import {
  fetchIsWhiteNoise,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchARIMA,
  fetchVAR,
} from '../../apiCalls/analysis';
import {
  EPredictionMode,
  type THistoryEntry,
  type TValueBounds,
} from '../../pages/Configuration/Analysis/types';
import type {
  TDataProperty,
  TTimeseriesData,
  TWhiteNoiseResult,
} from '../../types';
import { SHOULD_CLEAR_STORE } from '../consts';
import {
  SET_DATA,
  SET_SELECTED_DATA,
  FETCH_WHITE_NOISE_TEST_START,
  FETCH_WHITE_NOISE_TEST_SUCCESS,
  FETCH_WHITE_NOISE_TEST_FAILURE,
  FETCH_STATIONARITY_TEST_START,
  FETCH_STATIONARITY_TEST_SUCCESS,
  FETCH_STATIONARITY_TEST_FAILURE,
  FETCH_CAUSALITY_TEST_START,
  FETCH_CAUSALITY_TEST_SUCCESS,
  FETCH_CAUSALITY_TEST_FAILURE,
  FETCH_ARIMA_PREDICTION_START,
  FETCH_ARIMA_PREDICTION_SUCCESS,
  FETCH_ARIMA_PREDICTION_FAILURE,
  FETCH_VAR_PREDICTION_START,
  FETCH_VAR_PREDICTION_SUCCESS,
  FETCH_VAR_PREDICTION_FAILURE,
  SET_PREDICTION_MODE,
  SET_DISPLAYED_PREDICTION,
  SET_TIMESERIES_PROP,
  SET_SELECTED_PROPS,
  SET_HORIZON,
  FETCH_CONFIGURATION_START,
  FETCH_CONFIGURATION_FAILURE,
  FETCH_CONFIGURATION_SUCCESS,
  FETCH_PREDICTION_HISTORY_START,
  FETCH_PREDICTION_HISTORY_SUCCESS,
  FETCH_PREDICTION_HISTORY_FAILURE,
  ADD_ENTRY_TO_PREDICTION_HISTORY_START,
  ADD_ENTRY_TO_PREDICTION_HISTORY_SUCCESS,
  ADD_ENTRY_TO_PREDICTION_HISTORY_FAILURE,
} from './actionNames';
import type { TDisplayedPrediction } from '../types';
import {
  getDisplayedPrediction,
  getSelectedDataByBoundaries,
} from '../../utils';
import {
  addEntryToPredictionHistory,
  fetchConfig,
  fetchPredictionHistoryByConfigId,
} from '../../apiCalls/configuration';
import { DEFAULT_CONFIGURATION_STATE } from './currentConfigurationSlice';

export default (set, get) => ({
  fetchConfiguration: async (id: string) => {
    if (isNil(id)) return;
    set(
      () => ({ ...DEFAULT_CONFIGURATION_STATE, isConfigurationLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_CONFIGURATION_START,
    );
    const response = await fetchConfig(id);
    if (response.isSuccess) {
      const config = mapKeys(response.data || {}, (v, key) => camelCase(key));

      const mappedJSON = flow(
        (data) =>
          map(data, (value) => ({
            ...value,
            [config.timeProperty.value]: new Date(
              value[config.timeProperty.value],
            ).getTime(),
          })),
        (data) => sortBy(data, (d) => d[config.timeProperty.value]),
      )(config.data);

      set(
        () => ({ ...config, data: mappedJSON, isConfigurationLoading: false }),
        SHOULD_CLEAR_STORE,
        FETCH_CONFIGURATION_SUCCESS,
      );
      get().fetchPredictionHistory();
    } else {
      set(
        () => ({
          ...DEFAULT_CONFIGURATION_STATE,
          configurationError: response.error,
        }),
        SHOULD_CLEAR_STORE,
        FETCH_CONFIGURATION_FAILURE,
      );
      get().openErrorNotification(
        FETCH_CONFIGURATION_FAILURE,
        response?.error?.message || 'Failed to fetch configuration',
      );
    }
  },

  setData: (data: TTimeseriesData) => {
    return set(() => ({ data }), SHOULD_CLEAR_STORE, SET_DATA);
  },

  setSelectedDataBoundaries: (selectedDataBoundaries?: TValueBounds) => {
    return set(
      () => ({ selectedDataBoundaries }),
      SHOULD_CLEAR_STORE,
      SET_SELECTED_DATA,
    );
  },

  setTimeseriesProp: (timeseriesProp: TDataProperty) =>
    set(() => ({ timeseriesProp }), SHOULD_CLEAR_STORE, SET_TIMESERIES_PROP),

  setSelectedProps: (selectedProps: TDataProperty[]) =>
    set(() => ({ selectedProps }), SHOULD_CLEAR_STORE, SET_SELECTED_PROPS),

  setHorizon: (horizon: number) =>
    set(
      (state) => ({ latestPrediction: { ...state.latestPrediction, horizon } }),
      SHOULD_CLEAR_STORE,
      SET_HORIZON,
    ),

  setPredictionMode: (predictionMode: EPredictionMode) =>
    set(
      () => ({ latestPrediction: { predictionMode } }),
      SHOULD_CLEAR_STORE,
      SET_PREDICTION_MODE,
    ),

  setDisplayedPredictionId: (itemId: TDisplayedPrediction) => {
    return set(
      (state) => ({
        displayedPredictionId: itemId,
        selectedDataBoundaries: isNil(itemId)
          ? undefined
          : getDisplayedPrediction(
              state.predictionHistory,
              state.displayedPredictionId,
            )?.selectedDataBoundaries,
      }),
      SHOULD_CLEAR_STORE,
      SET_DISPLAYED_PREDICTION,
    );
  },

  fetchWhiteNoiseTest: async (valueProperties) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get().data,
      get().timeseriesProp,
      dataBoundaries,
    );

    set(
      () => ({ whiteNoiseTest: undefined, isWhiteNoiseTestLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_WHITE_NOISE_TEST_START,
    );

    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(selectedData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return await fetchIsWhiteNoise(dataForAnalysis);
        }
      }),
    );

    const isSuccess = every(responses, 'isSuccess');
    const mappedResponse = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      {} as TWhiteNoiseResult,
    );

    set(
      () => ({
        whiteNoiseTest: mappedResponse,
        isWhiteNoiseTestLoading: false,
      }),
      SHOULD_CLEAR_STORE,
      isSuccess
        ? FETCH_WHITE_NOISE_TEST_SUCCESS
        : FETCH_WHITE_NOISE_TEST_FAILURE,
    );
  },

  fetchStationarityTest: async (valueProperties) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get().data,
      get().timeseriesProp,
      dataBoundaries,
    );

    set(
      () => ({ stationarityTest: undefined, isStationarityTestLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_STATIONARITY_TEST_START,
    );

    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(selectedData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return await fetchDataStationarityTest(dataForAnalysis);
        }
      }),
    );
    const isSuccess = every(responses, 'isSuccess');

    const newResult = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      {},
    );
    set(
      () => ({ stationarityTest: newResult, isStationarityTestLoading: false }),
      SHOULD_CLEAR_STORE,
      isSuccess
        ? FETCH_STATIONARITY_TEST_SUCCESS
        : FETCH_STATIONARITY_TEST_FAILURE,
    );
  },

  fetchCausalityTest: async (selectedProps) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get().data,
      get().timeseriesProp,
      dataBoundaries,
    );

    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(selectedData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value],
      ]);

      if (dataForAnalysis) {
        set(
          () => ({ causalityTest: undefined, isCausalityTestLoading: true }),
          SHOULD_CLEAR_STORE,
          FETCH_CAUSALITY_TEST_START,
        );

        const response = await fetchGrangerDataCausalityTest(dataForAnalysis, [
          selectedProps[0].value,
          selectedProps[1].value,
        ]);

        set(
          () => ({
            causalityTest: response.data,
            isCausalityTestLoading: false,
          }),
          SHOULD_CLEAR_STORE,
          response.isSuccess
            ? FETCH_CAUSALITY_TEST_SUCCESS
            : FETCH_CAUSALITY_TEST_FAILURE,
        );
      }
    }
  },

  addEntryToPredictionHistory: async (entry: THistoryEntry) => {
    const predictionHistoryWithoutEntry = get().predictionHistory;
    const entryWithConfigId = { ...entry, configurationId: get().id };
    set(
      // most recent first
      () => ({
        predictionHistory: [
          entryWithConfigId,
          ...predictionHistoryWithoutEntry,
        ],
        displayedPredictionId: entry.id,
        isAddingEntryToPredictionHistory: true,
      }),
      SHOULD_CLEAR_STORE,
      ADD_ENTRY_TO_PREDICTION_HISTORY_START,
    );
    const response = await addEntryToPredictionHistory(entryWithConfigId);
    set(
      // most recent first
      (state) => ({
        predictionHistory: response.isSuccess
          ? state.predictionHistory
          : predictionHistoryWithoutEntry,
        isAddingEntryToPredictionHistory: false,
      }),
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? ADD_ENTRY_TO_PREDICTION_HISTORY_SUCCESS
        : ADD_ENTRY_TO_PREDICTION_HISTORY_FAILURE,
    );
    if (!response.isSuccess) {
      get().openErrorNotification(
        ADD_ENTRY_TO_PREDICTION_HISTORY_FAILURE,
        response?.error?.message || 'Failed to add prediction to the history',
      );
    }
  },

  fetchARIMAPrediction: async (parameters, dataBoundaries, selectedData) => {
    set(
      (state) => ({
        isPredictionLoading: true,
        latestPrediction: {
          ...state.latestPrediction,
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.ARIMA,
        },
      }),
      SHOULD_CLEAR_STORE,
      FETCH_ARIMA_PREDICTION_START,
    );

    const response = await fetchARIMA(selectedData, parameters);
    set(
      () => ({
        isPredictionLoading: false,
        latestPrediction: {
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.ARIMA,
          prediction: response.data,
        },
      }),
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_ARIMA_PREDICTION_SUCCESS
        : FETCH_ARIMA_PREDICTION_FAILURE,
    );
    if (response.isSuccess) {
      get().addEntryToPredictionHistory({
        id: uuidv4(),
        selectedDataBoundaries: dataBoundaries,
        predictionMode: EPredictionMode.ARIMA,
        createdAt: new Date().toISOString(),
        ...response.data,
      });
    } else {
      get().openErrorNotification(
        FETCH_ARIMA_PREDICTION_FAILURE,
        response?.error?.message || 'Failed to make prediction',
      );
    }
  },

  fetchVARPrediction: async (parameters, dataBoundaries, selectedData) => {
    set(
      (state) => ({
        displayedPredictionId: 'latestPrediction',

        latestPrediction: {
          ...state.latestPrediction,
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.VAR,
          isPredictionLoading: true,
        },
      }),
      SHOULD_CLEAR_STORE,
      FETCH_VAR_PREDICTION_START,
    );

    const response = await fetchVAR(selectedData, parameters);

    set(
      () => ({
        latestPrediction: {
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.VAR,
          prediction: response.data,
          isPredictionLoading: false,
        },
      }),
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_VAR_PREDICTION_SUCCESS
        : FETCH_VAR_PREDICTION_FAILURE,
    );
    if (response.isSuccess) {
      get().addEntryToPredictionHistory({
        id: get().predictionHistory.length,
        predictionMode: EPredictionMode.VAR,
        selectedDataBoundaries: dataBoundaries,
        createdAt: new Date().toISOString(),
        ...response.data,
      });
    }
  },

  fetchPrediction: async (parameters, timeProperty) => {
    const predictionMode = get().latestPrediction.predictionMode;
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get().data,
      timeProperty,
      dataBoundaries,
    );

    if (predictionMode === EPredictionMode.ARIMA) {
      await get().fetchARIMAPrediction(
        parameters,
        dataBoundaries,
        selectedData,
      );
    } else if (predictionMode === EPredictionMode.VAR) {
      await get().fetchVARPrediction(parameters, dataBoundaries, selectedData);
    }
  },

  setIsHistoryDrawerOpen: (isOpen: boolean) =>
    set(() => ({ isHistoryDrawerOpen: isOpen })),

  fetchPredictionHistory: async () => {
    const configurationId = get().id;
    set(
      () => ({
        predictionHistory: undefined,
        isPredictionHistoryLoading: true,
      }),
      SHOULD_CLEAR_STORE,
      FETCH_PREDICTION_HISTORY_START,
    );

    const response = await fetchPredictionHistoryByConfigId(configurationId);

    set(
      (state) => {
        const predictionHistory = map(response.data, (datum) =>
          mapKeys(datum, (v, key) => camelCase(key)),
        );
        return {
          predictionHistory,
          isPredictionHistoryLoading: false,
          displayedPredictionId: response.data[0]?.id,
          selectedDataBoundaries:
            state.selectedDataBoundaries ||
            getDisplayedPrediction(predictionHistory, response.data[0]?.id)
              ?.selectedDataBoundaries,
        };
      },
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_PREDICTION_HISTORY_SUCCESS
        : FETCH_PREDICTION_HISTORY_FAILURE,
    );
  },
});
