import { StateCreator } from 'zustand';
import { every, map, reduce } from 'lodash';

import { SHOULD_CLEAR_STORE } from '../consts';
import {
  fetchARIMA,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchIsWhiteNoise,
  fetchVAR
} from '../../apiCalls/analysis';
import { EPredictionMode } from '../../components/Analysis/types';
import { TDataProperty, TTimeseriesData, TWhiteNoiseResult } from '../../types';

export type IConfigurationSlice = {
  // readonly id: string;
  readonly data: TTimeseriesData;
  readonly setData: (data: TTimeseriesData) => void;

  readonly whiteNoiseTest;
  readonly isWhiteNoiseTestLoading: boolean;
  readonly fetchWhiteNoiseTest: any;

  readonly stationarityTest;
  readonly isStationarityTestLoading: boolean;

  readonly fetchStationarityTest;

  readonly predictionMode: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;

  readonly prediction: any;
  readonly isPredictionLoading: boolean;

  readonly fetchARIMAPrediction: (params: any) => Promise<void>;
  readonly fetchVARPrediction: (params: any) => Promise<void>;
  readonly fetchPrediction: (params: any) => Promise<void>;

  readonly causalityTest;
  readonly isCausalityTestLoading: boolean;
  readonly fetchCausalityTest: (selectedProps: TDataProperty[]) => Promise<void>;

  // readonly currentRun: {
  //   readonly trainingData: any;
  //   readonly causalityTest;
  //   readonly whiteNoiseTest: any;
  //   readonly prediction: any;
  // };

  // readonly predictionHistory;
  // -->     readonly data: any;
  // -->     readonly trainingData: any;
  // -->     readonly causalityTest;
  // -->     readonly whiteNoiseTest: any;
  // -->     readonly prediction: any;
};

export type TStoreMiddlewares = [['zustand/devtools', never]];

const SET_DATA = 'SET_DATA';
const SET_PREDICTION_MODE = 'SET_PREDICTION_MODE';

const FETCH_ARIMA_PREDICTION_START = 'FETCH_ARIMA_PREDICTION_START';
const FETCH_ARIMA_PREDICTION_SUCCESS = 'FETCH_ARIMA_PREDICTION_SUCCESS';
const FETCH_ARIMA_PREDICTION_FAILURE = 'FETCH_ARIMA_PREDICTION_FAILURE';

const FETCH_VAR_PREDICTION_START = 'FETCH_VAR_PREDICTION_START';
const FETCH_VAR_PREDICTION_SUCCESS = 'FETCH_VAR_PREDICTION_SUCCESS';
const FETCH_VAR_PREDICTION_FAILURE = 'FETCH_VAR_PREDICTION_FAILURE';

const FETCH_WHITE_NOISE_TEST_START = 'FETCH_WHITE_NOISE_TEST_START';
const FETCH_WHITE_NOISE_TEST_SUCCESS = 'FETCH_WHITE_NOISE_TEST_SUCCESS';
const FETCH_WHITE_NOISE_TEST_FAILURE = 'FETCH_WHITE_NOISE_TEST_FAILURE';

const FETCH_STATIONARITY_TEST_START = 'FETCH_STATIONARITY_TEST_START';
const FETCH_STATIONARITY_TEST_SUCCESS = 'FETCH_WHITE_STATIONARITY_SUCCESS';
const FETCH_STATIONARITY_TEST_FAILURE = 'FETCH_WHITE_STATIONARITY_FAILURE';

const FETCH_CAUSALITY_TEST_START = 'FETCH_CAUSALITY_TEST_START';
const FETCH_CAUSALITY_TEST_SUCCESS = 'FETCH_CAUSALITY_TEST_SUCCESS';
const FETCH_CAUSALITY_TEST_FAILURE = 'FETCH_CAUSALITY_TEST_FAILURE';

export const createConfigurationSlice: StateCreator<
  IConfigurationSlice,
  TStoreMiddlewares,
  [],
  IConfigurationSlice
> = (set, get) => ({
  setData: (data: TTimeseriesData) => set(() => ({ data }), SHOULD_CLEAR_STORE, SET_DATA),
  data: [],

  whiteNoiseTest: null,
  isWhiteNoiseTestLoading: false,
  fetchWhiteNoiseTest: async (valueProperties) => {
    const timeseriesData = get().data;
    set(
      () => ({ whiteNoiseTest: null, isWhiteNoiseTestLoading: true }),
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

  stationarityTest: null,
  isStationarityTestLoading: false,

  fetchStationarityTest: async (valueProperties) => {
    const timeseriesData = get().data;
    set(
      () => ({ stationarityTest: null, isStationarityTestLoading: true }),
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

  causalityTest: null,
  isCausalityTestLoading: false,

  fetchCausalityTest: async (selectedProps) => {
    const timeseriesData = get().data;

    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(timeseriesData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value]
      ]);

      if (dataForAnalysis) {
        set(
          () => ({ causalityTest: null, isCausalityTestLoading: true }),
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

  predictionMode: EPredictionMode.ARIMA,
  setPredictionMode: (predictionMode: EPredictionMode) =>
    set(() => ({ predictionMode }), SHOULD_CLEAR_STORE, SET_PREDICTION_MODE),

  prediction: null,
  isPredictionLoading: false,
  fetchARIMAPrediction: async (parameters) => {
    const timeseriesData = get().data;
    set(
      () => ({ prediction: null, isPredictionLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_ARIMA_PREDICTION_START
    );

    const response = await fetchARIMA(timeseriesData, parameters);

    set(
      () => ({ prediction: response.data, isPredictionLoading: false }),
      SHOULD_CLEAR_STORE,
      response.isSuccess ? FETCH_ARIMA_PREDICTION_SUCCESS : FETCH_ARIMA_PREDICTION_FAILURE
    );
  },

  fetchVARPrediction: async (parameters) => {
    const timeseriesData = get().data;
    set(
      () => ({ prediction: null, isPredictionLoading: true }),
      SHOULD_CLEAR_STORE,
      FETCH_VAR_PREDICTION_START
    );

    const response = await fetchVAR(timeseriesData, parameters);

    set(
      () => ({ prediction: response.data, isPredictionLoading: false }),
      SHOULD_CLEAR_STORE,
      response.isSuccess ? FETCH_VAR_PREDICTION_SUCCESS : FETCH_VAR_PREDICTION_FAILURE
    );
  },

  fetchPrediction: async (parameters) => {
    const predictionMode = get().predictionMode;
    if (predictionMode === EPredictionMode.ARIMA) {
      get().fetchARIMAPrediction(parameters);
    } else if (predictionMode === EPredictionMode.VAR) {
      get().fetchVARPrediction(parameters);
    }
  }
});
