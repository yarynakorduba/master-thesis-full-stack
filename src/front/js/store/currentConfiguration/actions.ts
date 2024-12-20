import { map, every, reduce, isNil, camelCase, mapKeys } from 'lodash';
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
  type TARIMAUserParams,
  type THistoryEntryPayload,
  type THistoryEntry,
  type TValueBounds,
} from '../../pages/Configuration/Analysis/types';
import type { TDataProperty } from '../../types';
import { SHOULD_CLEAR_STORE } from '../consts';
import {
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
import type { TDisplayedPredictionId } from '../types';
import {
  getDisplayedPrediction,
  getSelectedDataByBoundaries,
} from '../../utils';
import {
  addEntryToPredictionHistory,
  fetchConfig,
  fetchPredictionHistoryByConfigId,
} from '../../apiCalls/configuration';
import { processConfiguration } from './utils';

export default (set, get) => ({
  fetchConfiguration: async (id: string) => {
    if (isNil(id)) return;
    set(
      () => ({ data: undefined, isConfigurationLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_CONFIGURATION_START,
    );
    // Also start fetching prediction history
    get().fetchPredictionHistory(id);

    const response = await fetchConfig(id);

    if (response.isSuccess) {
      const config = processConfiguration(response.data);

      set(
        () => ({ configData: { ...config }, isConfigurationLoading: false }),
        SHOULD_CLEAR_STORE,
        FETCH_CONFIGURATION_SUCCESS,
      );
    } else {
      set(
        () => ({
          isConfigurationLoading: false,
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

  setSelectedDataBoundaries: (selectedDataBoundaries?: TValueBounds) => {
    return set(
      () => ({ selectedDataBoundaries }),
      SHOULD_CLEAR_STORE,
      SET_SELECTED_DATA,
    );
  },

  setTimeseriesProp: (timeProperty: TDataProperty) =>
    set(() => ({ timeProperty }), SHOULD_CLEAR_STORE, SET_TIMESERIES_PROP),

  setSelectedProps: (selectedProp: TDataProperty) =>
    set(
      (state) => ({ ...state, selectedProp }),
      SHOULD_CLEAR_STORE,
      SET_SELECTED_PROPS,
    ),

  setHorizon: (horizon: number) =>
    set(
      (state) => ({
        currentPrediction: { ...state.currentPrediction, horizon },
      }),
      SHOULD_CLEAR_STORE,
      SET_HORIZON,
    ),

  setPredictionMode: (displayedPredictionMode: EPredictionMode) =>
    set(
      () => ({ displayedPredictionMode }),
      SHOULD_CLEAR_STORE,
      SET_PREDICTION_MODE,
    ),

  setDisplayedPredictionId: (itemId: TDisplayedPredictionId) => {
    const predictionHistory = get().predictionHistory;
    const prevPrediction = getDisplayedPrediction(
      predictionHistory,
      get().displayedPredictionId,
    );
    const displayedPrediction = itemId
      ? getDisplayedPrediction(predictionHistory, itemId)
      : undefined;

    const selectedDataBoundaries = isNil(itemId)
      ? undefined
      : displayedPrediction?.selectedDataBoundaries;
    const displayedPredictionMode = isNil(itemId)
      ? prevPrediction?.predictionMode
      : displayedPrediction?.predictionMode;

    return set(
      () => {
        return {
          displayedPredictionId: itemId,
          selectedDataBoundaries,
          displayedPredictionMode:
            displayedPredictionMode || EPredictionMode.ARIMA,
          whiteNoiseTest:
            (displayedPrediction as any)?.whiteNoiseTest || undefined,
          stationarityTest:
            (displayedPrediction as any)?.stationarityTest || undefined,
          causalityTest:
            (displayedPrediction as any)?.causalityTest || undefined,
        };
      },
      SHOULD_CLEAR_STORE,
      SET_DISPLAYED_PREDICTION,
    );
  },

  fetchWhiteNoiseTest: async ({ periods }: { readonly periods?: number }) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get()?.configData?.data,
      get().configData?.timeProperty,
      dataBoundaries,
    );

    set(
      () => ({ whiteNoiseTest: undefined, isWhiteNoiseTestLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_WHITE_NOISE_TEST_START,
    );

    const properties = map(
      get().configData.valueProperties,
      (prop) => prop.value,
    );

    const response = await fetchIsWhiteNoise(selectedData, properties, periods);

    const isSuccess = response.isSuccess;
    set(
      () => ({ whiteNoiseTest: response.data, isWhiteNoiseTestLoading: false }),
      SHOULD_CLEAR_STORE,
      isSuccess
        ? FETCH_WHITE_NOISE_TEST_SUCCESS
        : FETCH_WHITE_NOISE_TEST_FAILURE,
    );
    if (!isSuccess) {
      get().openErrorNotification(
        FETCH_WHITE_NOISE_TEST_FAILURE,
        response?.error?.message || 'Failed to perform white noise test',
      );
    }
  },

  fetchStationarityTest: async (
    valueProperties: TDataProperty[],
    periodsInSeason?: number,
  ) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get()?.configData?.data,
      get().configData?.timeProperty,
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
          return await fetchDataStationarityTest(
            dataForAnalysis,
            periodsInSeason ? +periodsInSeason : undefined,
          );
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

  fetchCausalityTest: async (params) => {
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get()?.configData?.data,
      get().configData?.timeProperty,
      dataBoundaries,
    );

    const properties = map(
      get().configData?.valueProperties,
      ({ value }) => value,
    );

    if (properties?.length) {
      if (selectedData) {
        set(
          () => ({ causalityTest: undefined, isCausalityTestLoading: true }),
          SHOULD_CLEAR_STORE,
          FETCH_CAUSALITY_TEST_START,
        );

        const response = await fetchGrangerDataCausalityTest(
          selectedData,
          properties,
          params.maxLagOrder,
        );

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

        if (!response.isSuccess) {
          get().openErrorNotification(
            FETCH_CAUSALITY_TEST_FAILURE,
            response?.error?.message || 'Failed to perform causality test',
          );
        }
      }
    }
  },

  addEntryToPredictionHistory: async (entry: THistoryEntryPayload) => {
    const predictionHistoryWithoutEntry = get().predictionHistory;
    const entryWithConfigId = {
      ...entry,
      configurationId: get().configData.id,
    };
    set(
      () => ({ isAddingEntryToPredictionHistory: true }),
      SHOULD_CLEAR_STORE,
      ADD_ENTRY_TO_PREDICTION_HISTORY_START,
    );
    const response = await addEntryToPredictionHistory({
      ...entryWithConfigId,
      whiteNoiseTest: get().whiteNoiseTest,
      stationarityTest: get().stationarityTest,
      causalityTest: get().causalityTest,
    });
    const newEntry = mapKeys(response.data || {}, (v, key) => camelCase(key));

    if (response.isSuccess) {
      set(
        // most recent first
        () => ({
          predictionHistory: [newEntry, ...predictionHistoryWithoutEntry],
          displayedPredictionId: entry.id,
          isAddingEntryToPredictionHistory: false,
        }),
        SHOULD_CLEAR_STORE,
        ADD_ENTRY_TO_PREDICTION_HISTORY_SUCCESS,
      );
    } else {
      set(
        () => ({ isAddingEntryToPredictionHistory: false }),
        SHOULD_CLEAR_STORE,
        ADD_ENTRY_TO_PREDICTION_HISTORY_FAILURE,
      );
      get().openErrorNotification(
        ADD_ENTRY_TO_PREDICTION_HISTORY_FAILURE,
        response?.error?.message || 'Failed to add prediction to the history',
      );
    }
  },

  fetchARIMAPrediction: async (inputData: TARIMAUserParams) => {
    const timeProperty = get().configData?.timeProperty;
    const dataBoundaries = get().selectedDataBoundaries;

    const selectedData = getSelectedDataByBoundaries(
      get()?.configData?.data,
      timeProperty,
      dataBoundaries,
    );
    set(
      () => ({
        isPredictionLoading: true,
        displayedPredictionMode: EPredictionMode.ARIMA,
        selectedDataBoundaries: dataBoundaries,
      }),
      SHOULD_CLEAR_STORE,
      FETCH_ARIMA_PREDICTION_START,
    );

    const response = await fetchARIMA(selectedData, inputData, {
      date_key: get().configData?.timeProperty?.value,
      value_key: get().selectedProp.value,
    });
    set(
      () => ({
        isPredictionLoading: false,
        displayedPredictionMode: EPredictionMode.ARIMA,
        selectedDataBoundaries: dataBoundaries,
        displayedPredictionId: 'currentPrediction',
        currentPrediction: {
          createdAt: new Date().toISOString(),
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.ARIMA,
          inputData,
          ...response.data,
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
        createdAt: new Date().toISOString(),
        selectedDataBoundaries: dataBoundaries,
        predictionMode: EPredictionMode.ARIMA,
        inputData,
        ...response.data,
      });
    } else {
      get().openErrorNotification(
        FETCH_ARIMA_PREDICTION_FAILURE,
        response?.error?.message || 'Failed to make prediction',
      );
    }
  },

  fetchVARPrediction: async (inputData, selectedValueKeys) => {
    const timeProperty = get().configData?.timeProperty;
    const dataBoundaries = get().selectedDataBoundaries;
    const selectedData = getSelectedDataByBoundaries(
      get().configData?.data,
      timeProperty,
      dataBoundaries,
    );

    set(
      () => ({
        displayedPredictionMode: EPredictionMode.VAR,
        selectedDataBoundaries: dataBoundaries,
        isPredictionLoading: true,
      }),
      SHOULD_CLEAR_STORE,
      FETCH_VAR_PREDICTION_START,
    );

    const response = await fetchVAR(
      selectedData,
      {
        lagOrder: inputData.lagOrder,
        horizon: inputData.horizon,
        periodsInSeason: inputData.periodsInSeason,
      },
      {
        date_key: timeProperty?.value,
        value_keys: selectedValueKeys,
      },
    );

    set(
      () => ({
        displayedPredictionMode: EPredictionMode.VAR,
        selectedDataBoundaries: dataBoundaries,
        isPredictionLoading: false,
        currentPrediction: {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.VAR,
          inputData,
          ...response.data,
        },
        displayedPredictionId: 'currentPrediction',
      }),
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_VAR_PREDICTION_SUCCESS
        : FETCH_VAR_PREDICTION_FAILURE,
    );
    if (response.isSuccess) {
      get().addEntryToPredictionHistory({
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        predictionMode: EPredictionMode.VAR,
        selectedDataBoundaries: dataBoundaries,
        inputData,
        ...response.data,
      });
    } else {
      get().openErrorNotification(
        FETCH_VAR_PREDICTION_FAILURE,
        response?.error?.message || 'Failed to make prediction',
      );
    }
  },

  fetchPrediction: async (parameters) => {
    const predictionMode = get().displayedPredictionMode;

    if (predictionMode === EPredictionMode.ARIMA) {
      await get().fetchARIMAPrediction(parameters);
    } else if (predictionMode === EPredictionMode.VAR) {
      await get().fetchVARPrediction(parameters, []);
    }
  },

  setIsHistoryDrawerOpen: (isOpen: boolean) =>
    set(() => ({ isHistoryDrawerOpen: isOpen })),

  fetchPredictionHistory: async (id) => {
    set(
      () => ({
        predictionHistory: undefined,
        isPredictionHistoryLoading: true,
      }),
      SHOULD_CLEAR_STORE,
      FETCH_PREDICTION_HISTORY_START,
    );

    const response = await fetchPredictionHistoryByConfigId(id);

    set(
      () => {
        const predictionHistory = map(response.data, (datum) =>
          mapKeys(datum, (v, key) => camelCase(key)),
        ) as THistoryEntry[];

        return { predictionHistory, isPredictionHistoryLoading: false };
      },
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_PREDICTION_HISTORY_SUCCESS
        : FETCH_PREDICTION_HISTORY_FAILURE,
    );

    get().setDisplayedPredictionId(response.data?.[0]?.id);
  },
});
