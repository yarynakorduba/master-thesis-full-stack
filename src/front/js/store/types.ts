import {
  EPredictionMode,
  TARIMAResult,
  THistoryEntry,
  TPredictedPoints,
  TVARResult
} from '../pages/App/Analysis/types';
import { TTimeseriesData, TDataProperty } from '../types';

export type TConfigurationSlice = {
  // readonly id: string;
  readonly data: TTimeseriesData;
  readonly setData: (data: TTimeseriesData) => void;
  // the data which was selected for training
  readonly selectedData: TTimeseriesData;
  readonly setSelectedData: (data: TTimeseriesData) => void;

  readonly whiteNoiseTest;
  readonly isWhiteNoiseTestLoading: boolean;
  readonly fetchWhiteNoiseTest: any;

  readonly stationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly fetchStationarityTest;

  readonly causalityTest;
  readonly isCausalityTestLoading: boolean;
  readonly fetchCausalityTest: (selectedProps: TDataProperty[]) => Promise<void>;

  readonly predictionMode: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;

  readonly prediction?: TARIMAResult | TVARResult;
  readonly isPredictionLoading: boolean;

  readonly fetchARIMAPrediction: (params: any) => Promise<void>;
  readonly fetchVARPrediction: (params: any) => Promise<void>;
  readonly fetchPrediction: (params: any) => Promise<void>;

  readonly predictionHistory: THistoryEntry[];
  readonly addEntryToPredictionHistory: (entry: THistoryEntry) => void;

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
