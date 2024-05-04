import { StateCreator } from 'zustand';
import { EPredictionMode } from '../../pages/App/Analysis/types';
import { TConfigurationSlice, TStoreMiddlewares } from '../types';
import actions from './actions';

export const DEFAULT_HORIZON = 1;
export const createConfigurationSlice: StateCreator<
  TConfigurationSlice,
  TStoreMiddlewares,
  [],
  TConfigurationSlice
> = (set, get) => ({
  data: [],
  timeseriesProp: { value: 'date', label: 'date' },
  selectedProps: [{ value: 'value', label: 'passengers' }],

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
    selectedDataBoundaries: undefined,
    horizon: DEFAULT_HORIZON,
  },

  isHistoryDrawerOpen: false,
  predictionHistory: [],

  ...actions(set, get),
});
