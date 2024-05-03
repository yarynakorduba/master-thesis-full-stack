import {
  EPredictionMode,
  TARIMAResult,
  TARIMAUserParams,
  THistoryEntry,
  TVARResult,
  TValueBounds
} from '../pages/App/Analysis/types';
import { TTimeseriesData, TDataProperty } from '../types';

export type TDisplayedPrediction = number | 'latestPrediction';
export type TConfigurationSlice = {
  readonly data: TTimeseriesData;
  readonly setData: (data: TTimeseriesData) => void;

  readonly timeseriesProp?: TDataProperty;
  readonly setTimeseriesProp: (timeseriesProp: TDataProperty) => void;

  readonly selectedProps?: TDataProperty[];
  readonly setSelectedProps: (selectedProps: TDataProperty[]) => void;

  readonly setSelectedDataBoundaries: (boundaries?: TValueBounds) => void;

  readonly setHorizon: (horizon: number) => void;

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
    readonly selectedDataBoundaries?: TValueBounds;

    readonly horizon: number;
  };

  readonly predictionHistory: THistoryEntry[];
  readonly addEntryToPredictionHistory: (entry: THistoryEntry) => void;

  readonly fetchARIMAPrediction: (
    params: TARIMAUserParams,
    dataBoundaries: TValueBounds,
    selectedData: TTimeseriesData
  ) => Promise<void>;
  readonly fetchVARPrediction: (
    params: any,
    dataBoundaries: TValueBounds,
    selectedData: TTimeseriesData
  ) => Promise<void>;
  readonly fetchPrediction: (
    params: TARIMAUserParams | any,
    timeProperty: TDataProperty
  ) => Promise<void>;

  readonly isHistoryDrawerOpen: boolean;
  readonly setIsHistoryDrawerOpen: (isOpen: boolean) => void;
};

export type TStoreMiddlewares = [['zustand/devtools', never], ['zustand/persist', unknown]];
