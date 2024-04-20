import { map, every, reduce } from 'lodash';
import {
  fetchIsWhiteNoise,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchARIMA,
  fetchVAR
} from '../../apiCalls/analysis';
import { EPredictionMode, THistoryEntry } from '../../pages/App/Analysis/types';
import { TTimeseriesData, TWhiteNoiseResult } from '../../types';
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
  SET_DISPLAYED_PREDICTION
} from './actionNames';
import { TDisplayedPrediction } from '../types';

export default (set, get) => ({
  setData: (data: TTimeseriesData) => set(() => ({ data }), SHOULD_CLEAR_STORE, SET_DATA),
  setSelectedData: (selectedData: TTimeseriesData) =>
    set(() => ({ selectedData }), SHOULD_CLEAR_STORE, SET_SELECTED_DATA),

  setPredictionMode: (predictionMode: EPredictionMode) =>
    set(() => ({ latestPrediction: { predictionMode } }), SHOULD_CLEAR_STORE, SET_PREDICTION_MODE),

  setDisplayedPredictionId: (itemId: TDisplayedPrediction) =>
    set(() => ({ displayedPredictionId: itemId }), SHOULD_CLEAR_STORE, SET_DISPLAYED_PREDICTION),

  fetchWhiteNoiseTest: async (valueProperties) => {
    const timeseriesData = get().data;
    set(
      () => ({ whiteNoiseTest: undefined, isWhiteNoiseTestLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_WHITE_NOISE_TEST_START
    );

    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(timeseriesData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return await fetchIsWhiteNoise(dataForAnalysis);
        }
      })
    );

    const isSuccess = every(responses, 'isSuccess');
    const mappedResponse = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      {} as TWhiteNoiseResult
    );

    set(
      () => ({ whiteNoiseTest: mappedResponse, isWhiteNoiseTestLoading: false }),
      SHOULD_CLEAR_STORE,
      isSuccess ? FETCH_WHITE_NOISE_TEST_SUCCESS : FETCH_WHITE_NOISE_TEST_FAILURE
    );
  },

  fetchStationarityTest: async (valueProperties) => {
    const timeseriesData = get().data;
    set(
      () => ({ stationarityTest: undefined, isStationarityTestLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_STATIONARITY_TEST_START
    );

    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(timeseriesData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return await fetchDataStationarityTest(dataForAnalysis);
        }
      })
    );
    const isSuccess = every(responses, 'isSuccess');

    const newResult = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      {}
    );
    set(
      () => ({ stationarityTest: newResult, isStationarityTestLoading: false }),
      SHOULD_CLEAR_STORE,
      isSuccess ? FETCH_STATIONARITY_TEST_SUCCESS : FETCH_STATIONARITY_TEST_FAILURE
    );
  },

  fetchCausalityTest: async (selectedProps) => {
    const timeseriesData = get().data;

    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(timeseriesData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value]
      ]);

      if (dataForAnalysis) {
        set(
          () => ({ causalityTest: undefined, isCausalityTestLoading: true }),
          SHOULD_CLEAR_STORE,
          FETCH_CAUSALITY_TEST_START
        );

        const response = await fetchGrangerDataCausalityTest(dataForAnalysis, [
          selectedProps[0].value,
          selectedProps[1].value
        ]);

        set(
          () => ({ causalityTest: response.data, isCausalityTestLoading: false }),
          SHOULD_CLEAR_STORE,
          response.isSuccess ? FETCH_CAUSALITY_TEST_SUCCESS : FETCH_CAUSALITY_TEST_FAILURE
        );
      }
    }
  },

  addEntryToPredictionHistory: (entry: THistoryEntry) => {
    set(
      // most recent first
      () => ({ predictionHistory: [entry, ...get().predictionHistory] }),
      SHOULD_CLEAR_STORE,
      ADD_ENTRY_TO_PREDICTION_HISTORY
    );
  },

  fetchARIMAPrediction: async (parameters) => {
    const timeseriesData = get().data;
    set(
      () => ({ latestPrediction: { prediction: undefined, isPredictionLoading: true } }),
      SHOULD_CLEAR_STORE,
      FETCH_ARIMA_PREDICTION_START
    );

    const response = await fetchARIMA(timeseriesData, parameters);

    set(
      () => ({ latestPrediction: { prediction: response.data, isPredictionLoading: false } }),
      SHOULD_CLEAR_STORE,
      response.isSuccess ? FETCH_ARIMA_PREDICTION_SUCCESS : FETCH_ARIMA_PREDICTION_FAILURE
    );
  },

  fetchVARPrediction: async (parameters) => {
    const timeseriesData = get().data;
    set(
      () => ({ latestPrediction: { prediction: undefined, isPredictionLoading: true } }),
      SHOULD_CLEAR_STORE,
      FETCH_VAR_PREDICTION_START
    );

    const response = await fetchVAR(timeseriesData, parameters);

    set(
      () => ({ latestPrediction: { prediction: response.data, isPredictionLoading: false } }),
      SHOULD_CLEAR_STORE,
      response.isSuccess ? FETCH_VAR_PREDICTION_SUCCESS : FETCH_VAR_PREDICTION_FAILURE
    );
  },

  fetchPrediction: async (parameters) => {
    const predictionMode = get().latestPrediction.predictionMode;

    if (predictionMode === EPredictionMode.ARIMA) {
      await get().fetchARIMAPrediction(parameters);
    } else if (predictionMode === EPredictionMode.VAR) {
      await get().fetchVARPrediction(parameters);
    }

    const prediction = get().latestPrediction.prediction;
    if (prediction) {
      get().addEntryToPredictionHistory({
        ...prediction,
        timestamp: new Date().toISOString(),
        predictionMode,
        id: get().predictionHistory.length
      });
    }
  }
});