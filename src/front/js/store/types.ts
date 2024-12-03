import { AlertColor } from '@mui/material';
import {
  EPredictionMode,
  type THistoryEntryPayload,
  type TARIMAUserParams,
  type TCausalityResult,
  type THistoryEntry,
  type TPredictionResult,
  type TVARUserParams,
  type TValueBounds,
} from '../pages/Configuration/Analysis/types';
import type { TTimeseriesData, TDataProperty } from '../types';

export type TConfigurationMainInfo = {
  readonly id: string;
  readonly data: TTimeseriesData;
  readonly name: string;
};

export type TConfiguration = TConfigurationMainInfo & {
  readonly timeProperty: TDataProperty;
  readonly valueProperties: TDataProperty[];
};

export type TConfigurationsSlice = {
  readonly configsList: TConfigurationMainInfo[];
  readonly fetchConfigs: () => Promise<void>;
  readonly areConfigurationsLoading: boolean;
  readonly isConfigurationDeleting: boolean;
  readonly deleteConfig: (id: string) => Promise<void>;
};

export type TDisplayedPredictionId = string | undefined;

export type TConfigurationSlice = {
  readonly configData?: TConfiguration;
  readonly configurationError?: Error;
  readonly isConfigurationLoading: boolean;

  readonly fetchConfiguration: (id: string) => Promise<void>;

  readonly setTimeseriesProp: (timeProperty: TDataProperty) => void;

  readonly selectedProp?: TDataProperty;
  readonly setSelectedProps: (selectedProp: TDataProperty) => void;

  readonly setSelectedDataBoundaries: (boundaries?: TValueBounds) => void;

  readonly setHorizon: (horizon: number) => void;

  readonly whiteNoiseTest;
  readonly isWhiteNoiseTestLoading: boolean;
  readonly fetchWhiteNoiseTest: (data: {
    readonly periods?: number;
  }) => Promise<void>;

  readonly stationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly fetchStationarityTest: (
    valueProperties: TDataProperty[],
  ) => Promise<void>;

  readonly causalityTest?: TCausalityResult;
  readonly isCausalityTestLoading: boolean;
  readonly fetchCausalityTest: (selectedProp: TDataProperty[]) => Promise<void>;

  readonly displayedPredictionId: TDisplayedPredictionId; // latest prediction or id of history item
  readonly setDisplayedPredictionId: (
    predictionItemId: TDisplayedPredictionId,
  ) => void;

  readonly displayedPredictionMode?: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;

  readonly isPredictionLoading: boolean;

  readonly selectedDataBoundaries?: TValueBounds;

  readonly currentPrediction?: TPredictionResult;

  readonly predictionHistory: THistoryEntry[];
  readonly addEntryToPredictionHistory: (entry: THistoryEntryPayload) => void;

  readonly fetchARIMAPrediction: (params: TARIMAUserParams) => Promise<void>;

  readonly fetchVARPrediction: (
    params: TVARUserParams,
    selectedProps: string[],
  ) => Promise<void>;
  readonly fetchPrediction: (
    params: TARIMAUserParams | TVARUserParams,
  ) => Promise<void>;

  readonly isHistoryDrawerOpen: boolean;
  readonly setIsHistoryDrawerOpen: (isOpen: boolean) => void;

  readonly fetchPredictionHistory: (id: string) => Promise<void>;
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

export type TSettingsSlice = {
  readonly areSimplifiedUIDescriptionsShown: boolean;
  readonly setAreSimplifiedDescriptionsShown: (areSimplified: boolean) => void;
};

export type TStoreMiddlewares = [
  ['zustand/devtools', never],
  ['zustand/immer', never],
  ['zustand/subscribeWithSelector', never],
];

export type TStoreType = TConfigurationSlice &
  TConfigurationsSlice &
  TNotificationsSlice &
  TSettingsSlice;
