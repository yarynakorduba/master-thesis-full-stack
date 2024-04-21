import {
  EPredictionMode,
  TARIMAResult,
  THistoryEntry,
  TPredictedPoints,
  TVARResult
} from '../pages/App/Analysis/types';
import { TTimeseriesData, TDataProperty } from '../types';

// displayedPredictionId: {
//   predictionMode: EPredictionMode.ARIMA,
//   prediction: undefined
// },

// latestPrediction: {
//   predictionMode: EPredictionMode.ARIMA,
//   prediction: undefined,
//   isPredictionLoading: false
// },

export type TDisplayedPrediction = number | 'latestPrediction';
export type TConfigurationSlice = {
  // readonly id: string;
  readonly data: TTimeseriesData;
  readonly setData: (data: TTimeseriesData) => void;

  readonly setSelectedDataBoundaries: (data: any) => void;

  readonly whiteNoiseTest;
  readonly isWhiteNoiseTestLoading: boolean;
  readonly fetchWhiteNoiseTest: any;

  readonly stationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly fetchStationarityTest;

  readonly causalityTest;
  readonly isCausalityTestLoading: boolean;
  readonly fetchCausalityTest: (selectedProps: TDataProperty[]) => Promise<void>;

  readonly displayedPredictionId: TDisplayedPrediction; // latest prediction or id of history item
  readonly setDisplayedPredictionId: (predictionItemId: TDisplayedPrediction) => void;

  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;
  readonly latestPrediction: {
    readonly prediction?: TARIMAResult | TVARResult;
    readonly isPredictionLoading: boolean;
    readonly predictionMode: EPredictionMode;
    // the data which was selected for training
    readonly selectedDataBoundaries: undefined;
  };

  readonly predictionHistory: THistoryEntry[];
  readonly addEntryToPredictionHistory: (entry: THistoryEntry) => void;

  readonly fetchARIMAPrediction: (params: any, data) => Promise<void>;
  readonly fetchVARPrediction: (params: any, data) => Promise<void>;
  readonly fetchPrediction: (params: any, timeProperty: TDataProperty) => Promise<void>;

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
