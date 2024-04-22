import { StateCreator } from 'zustand';
import { EPredictionMode } from '../../pages/App/Analysis/types';
import { TConfigurationSlice, TStoreMiddlewares } from '../types';
import actions from './actions';

export const createConfigurationSlice: StateCreator<
  TConfigurationSlice,
  TStoreMiddlewares,
  [],
  TConfigurationSlice
> = (set, get) => ({
  data: [],

  whiteNoiseTest: undefined,
  isWhiteNoiseTestLoading: false,

  stationarityTest: undefined,
  isStationarityTestLoading: false,

  causalityTest: undefined,
  isCausalityTestLoading: false,

  displayedPredictionId: 'latestPrediction',

  latestPrediction: {
    predictionMode: EPredictionMode.ARIMA,
    prediction: undefined,
    isPredictionLoading: false,
    selectedDataBoundaries: undefined
  },

  predictionHistory: [],

  ...actions(set, get)
});
