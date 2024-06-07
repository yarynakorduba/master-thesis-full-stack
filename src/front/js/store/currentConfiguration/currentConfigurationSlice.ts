import { StateCreator } from 'zustand';
import { EPredictionMode } from '../../pages/Configuration/Analysis/types';
import {
  TConfigurationSlice,
  TDisplayedPredictionId,
  TStoreMiddlewares,
  TStoreType,
} from '../types';
import actions from './actions';

export const DEFAULT_HORIZON = 1;

export const DEFAULT_CONFIGURATION_STATE = {
  isConfigurationLoading: false,
  data: [],
  timeProperty: undefined,
  selectedDataBoundaries: undefined,
  selectedProp: undefined,

  whiteNoiseTest: undefined,
  isWhiteNoiseTestLoading: false,

  stationarityTest: undefined,
  isStationarityTestLoading: false,

  causalityTest: undefined,
  isCausalityTestLoading: false,

  displayedPredictionId: undefined as TDisplayedPredictionId,

  isPredictionLoading: false,
  displayedPredictionMode: EPredictionMode.ARIMA,
  draft: {
    testPrediction: undefined,
    realPrediction: undefined,
    horizon: DEFAULT_HORIZON,
  },

  isHistoryDrawerOpen: false,
  isPredictionHistoryLoading: false,
  predictionHistory: [],
};

export const createConfigurationSlice: StateCreator<
  TStoreType,
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
