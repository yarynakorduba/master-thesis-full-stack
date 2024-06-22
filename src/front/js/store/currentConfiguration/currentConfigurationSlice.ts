import { StateCreator } from 'zustand';
import {
  TConfigurationSlice,
  TDisplayedPredictionId,
  TStoreMiddlewares,
  TStoreType,
} from '../types';
import actions from './actions';

export const DEFAULT_HORIZON = 1;

export const DEFAULT_CONFIGURATION_STATE = {
  data: undefined,
  isConfigurationLoading: false,
  configurationError: undefined,

  selectedProp: undefined,
  selectedDataBoundaries: undefined,

  whiteNoiseTest: undefined,
  isWhiteNoiseTestLoading: false,

  stationarityTest: undefined,
  isStationarityTestLoading: false,

  causalityTest: undefined,
  isCausalityTestLoading: false,

  displayedPredictionId: undefined as TDisplayedPredictionId,

  isPredictionLoading: false,
  displayedPredictionMode: undefined,
  currentPrediction: undefined,

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
