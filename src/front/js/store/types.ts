import { AlertColor } from '@mui/material';
import {
  EPredictionMode,
  TARIMAResult,
  TARIMAUserParams,
  THistoryEntry,
  TVARResult,
  TValueBounds,
} from '../pages/Configuration/Analysis/types';
import { TTimeseriesData, TDataProperty } from '../types';

export type TConfiguration = {
  readonly id: string;
  readonly data: TTimeseriesData;
  readonly name: string;
};

export type TConfigurationsSlice = {
  readonly configsList: TConfiguration[];
  readonly fetchConfigs: () => Promise<void>;
  readonly isLoading: boolean;
  readonly deleteConfig: (id: string) => Promise<void>;
  readonly isDeleting: boolean;
};

export type TDisplayedPrediction = number | string | undefined;

export type TConfigurationSlice = {
  // TODO: remove temporary :?
  readonly id?: string;
  readonly name?: string;
  readonly configurationError?: Error;
  readonly isConfigurationLoading: boolean;
  readonly timeProperty?: TDataProperty;
  readonly valueProperties?: TDataProperty[];

  readonly data: TTimeseriesData;
  readonly setData: (data: TTimeseriesData) => void;
  readonly fetchConfiguration: (id: string) => Promise<void>;

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
  readonly fetchCausalityTest: (
    selectedProps: TDataProperty[],
  ) => Promise<void>;

  readonly displayedPredictionId: TDisplayedPrediction; // latest prediction or id of history item
  readonly setDisplayedPredictionId: (
    predictionItemId: TDisplayedPrediction,
  ) => void;

  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;
  readonly isPredictionLoading: boolean;

  readonly selectedDataBoundaries?: TValueBounds;

  readonly latestPrediction: {
    readonly testPrediction?: TARIMAResult | TVARResult;
    readonly realPrediction?: TARIMAResult | TVARResult;

    readonly predictionMode: EPredictionMode;
    // the data which was selected for training

    readonly horizon: number;
  };

  readonly predictionHistory: THistoryEntry[];
  readonly addEntryToPredictionHistory: (entry: THistoryEntry) => void;

  readonly fetchARIMAPrediction: (
    params: TARIMAUserParams,
    dataBoundaries: TValueBounds,
    selectedData: TTimeseriesData,
  ) => Promise<void>;

  readonly fetchVARPrediction: (
    params: any,
    dataBoundaries: TValueBounds,
    selectedData: TTimeseriesData,
  ) => Promise<void>;
  readonly fetchPrediction: (
    params: TARIMAUserParams | any,
    timeProperty: TDataProperty,
  ) => Promise<void>;

  readonly isHistoryDrawerOpen: boolean;
  readonly setIsHistoryDrawerOpen: (isOpen: boolean) => void;

  readonly fetchPredictionHistory: () => Promise<void>;
  readonly isPredictionHistoryLoading: boolean;
};

export type TNotification = {
  readonly id: string;
  readonly message: string;
  readonly isOpen: boolean;
  readonly autoHideDuration: number | undefined;
  readonly severity: AlertColor;
};
export type TNotificationsSlice = {
  readonly notifications: TNotification[];
  readonly setNotification: (notification: TNotification) => void;
  readonly openErrorNotification: (id: string, message: string) => void;
};

export type TStoreMiddlewares = [
  ['zustand/devtools', never],
  ['zustand/immer', never],
  ['zustand/persist', unknown],
  ['zustand/subscribeWithSelector', never],
];

export type TStoreType = TConfigurationSlice &
  TConfigurationsSlice &
  TNotificationsSlice;
