import { map, every, reduce, isNil } from 'lodash';
import {
  fetchIsWhiteNoise,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchARIMA,
  fetchVAR,
} from '../../apiCalls/analysis';
import {
  EPredictionMode,
  THistoryEntry,
  TValueBounds,
} from '../../pages/Configuration/Analysis/types';
import { TDataProperty, TTimeseriesData, TWhiteNoiseResult } from '../../types';
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
  ADD_ENTRY_TO_PREDICTION_HISTORY,
  SET_PREDICTION_MODE,
  SET_DISPLAYED_PREDICTION,
  SET_TIMESERIES_PROP,
  SET_SELECTED_PROPS,
  SET_HORIZON,
  FETCH_CONFIGURATION_START,
  FETCH_CONFIGURATION_FAILURE,
  FETCH_CONFIGURATION_SUCCESS,
} from './actionNames';
import { TDisplayedPrediction } from '../types';
import { getSelectedDataByBoundaries } from '../../utils';
import { fetchConfig } from '../../apiCalls/configuration';

export default (set, get) => ({
  fetchConfiguration: async (id: string) => {
    if (isNil(id)) return;
    set(() => ({}), SHOULD_CLEAR_STORE, FETCH_CONFIGURATION_START);
    const response = await fetchConfig(id);

    set(
      () => ({ ...response.data }),
      SHOULD_CLEAR_STORE,
      response.isSuccess
        ? FETCH_CONFIGURATION_SUCCESS
        : FETCH_CONFIGURATION_FAILURE,
    );
  },

  setData: (data: TTimeseriesData) => {
    return set(
      () => {
        return { data };
      },
      SHOULD_CLEAR_STORE,
      SET_DATA,
    );
  },

  setSelectedDataBoundaries: (selectedDataBoundaries?: TValueBounds) => {
    return set(
      (state) => ({
        latestPrediction: { ...state.latestPrediction, selectedDataBoundaries },
      }),
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

  setDisplayedPredictionId: (itemId: TDisplayedPrediction) =>
    set(
      () => ({ displayedPredictionId: itemId }),
      SHOULD_CLEAR_STORE,
      SET_DISPLAYED_PREDICTION,
    ),

  fetchWhiteNoiseTest: async (valueProperties) => {
    const dataBoundaries = get().latestPrediction.selectedDataBoundaries;
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
    const dataBoundaries = get().latestPrediction.selectedDataBoundaries;
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
    const dataBoundaries = get().latestPrediction.selectedDataBoundaries;
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

  addEntryToPredictionHistory: (entry: THistoryEntry) => {
    set(
      // most recent first
      () => ({ predictionHistory: [entry, ...get().predictionHistory] }),
      SHOULD_CLEAR_STORE,
      ADD_ENTRY_TO_PREDICTION_HISTORY,
    );
  },

  fetchARIMAPrediction: async (parameters, dataBoundaries, selectedData) => {
    set(
      (state) => ({
        displayedPredictionId: 'latestPrediction',
        latestPrediction: {
          ...state.latestPrediction,
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.ARIMA,
          isPredictionLoading: true,
        },
      }),
      SHOULD_CLEAR_STORE,
      FETCH_ARIMA_PREDICTION_START,
    );

    const response = await fetchARIMA(selectedData, parameters);
    console.log('RESPONSE -- > ', response);
    set(
      () => ({
        latestPrediction: {
          selectedDataBoundaries: dataBoundaries,
          predictionMode: EPredictionMode.ARIMA,
          isPredictionLoading: false,
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
        selectedDataBoundaries: dataBoundaries,
        predictionMode: EPredictionMode.ARIMA,
        timestamp: new Date().toISOString(),
        id: get().predictionHistory.length,
        ...response.data,
      });
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
        predictionMode: EPredictionMode.VAR,
        timestamp: new Date().toISOString(),
        id: get().predictionHistory.length,
        selectedDataBoundaries: dataBoundaries,
        ...response.data,
      });
    }
  },

  fetchPrediction: async (parameters, timeProperty) => {
    const predictionMode = get().latestPrediction.predictionMode;
    const dataBoundaries = get().latestPrediction.selectedDataBoundaries;
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
});
