import { StateCreator } from 'zustand';
import { EPredictionMode } from '../../pages/Configuration/Analysis/types';
import {
  TConfigurationSlice,
  TDisplayedPrediction,
  TStoreMiddlewares,
} from '../types';
import actions from './actions';

export const DEFAULT_HORIZON = 1;

export const DEFAULT_CONFIGURATION_STATE = {
  data: [],
  timeseriesProp: { value: 'date', label: 'date' },
  selectedProps: [{ value: 'value', label: 'passengers' }],

  whiteNoiseTest: undefined,
  isWhiteNoiseTestLoading: false,

  stationarityTest: undefined,
  isStationarityTestLoading: false,

  causalityTest: undefined,
  isCausalityTestLoading: false,

  displayedPredictionId: 'latestPrediction' as TDisplayedPrediction,

  latestPrediction: {
    predictionMode: EPredictionMode.ARIMA,
    prediction: undefined,
    isPredictionLoading: false,
    selectedDataBoundaries: undefined,
    horizon: DEFAULT_HORIZON,
  },

  isHistoryDrawerOpen: false,
  predictionHistory: [],
};

export const createConfigurationSlice: StateCreator<
  TConfigurationSlice,
  TStoreMiddlewares,
  [],
  TConfigurationSlice
> = (set, get) => {
  const configSlice: TConfigurationSlice = {
    ...DEFAULT_CONFIGURATION_STATE,
    ...actions(set, get),
  };

  return configSlice;
};
