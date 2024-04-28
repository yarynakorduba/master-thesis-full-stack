import { find } from 'lodash';
import { TDataProperty, TTimeseriesData } from '../../types';
import { useBoundStore } from '..';
import { EPredictionMode, THistoryEntry, TValueBounds } from '../../pages/App/Analysis/types';
import { TDisplayedPrediction } from '../types';

// export const useFetchPrediction = () => useBoundStore((state) => state.fetchPrediction);
export const useGetData = (): TTimeseriesData => useBoundStore((state) => state.data);
export const useSetData = () => useBoundStore((state) => state.setData);
export const useConfigData = (): [TTimeseriesData, (data: TTimeseriesData) => void] => [
  useGetData(),
  useSetData()
];

export const useGetTimeseriesProp = () => useBoundStore((state) => state.timeseriesProp);
export const useSetTimeseriesProp = () => useBoundStore((state) => state.setTimeseriesProp);
export const useTimeseriesProp = (): [TDataProperty | undefined, (data: TDataProperty) => void] => [
  useGetTimeseriesProp(),
  useSetTimeseriesProp()
];

export const useGetSelectedProps = () => useBoundStore((state) => state.selectedProps);
export const useSetSelectedProps = () => useBoundStore((state) => state.setSelectedProps);
export const useSelectedProps = (): [
  TDataProperty[] | undefined,
  (data: TDataProperty[]) => void
] => [useGetSelectedProps(), useSetSelectedProps()];

export const useGetSelectedDataBoundaries = (): TValueBounds | undefined =>
  useBoundStore((state) =>
    state.displayedPredictionId === 'latestPrediction'
      ? state.latestPrediction?.selectedDataBoundaries
      : find(state.predictionHistory, ({ id }) => id === state.displayedPredictionId)
          ?.selectedDataBoundaries
  );
export const useSetSelectedDataBoundaries = () =>
  useBoundStore((state) => state.setSelectedDataBoundaries);
export const useSelectedDataBoundaries = (): [
  TValueBounds | undefined,
  (data: TValueBounds | undefined) => void
] => [useGetSelectedDataBoundaries(), useSetSelectedDataBoundaries()];

export const useFetchPrediction = () => useBoundStore((state) => state.fetchPrediction);
export const useGetPrediction = () =>
  useBoundStore((state) =>
    state.displayedPredictionId === 'latestPrediction'
      ? state.latestPrediction.prediction
      : find(state.predictionHistory, ({ id }) => id === state.displayedPredictionId)
  );

export const useIsHistoryPredictionSelected = () =>
  useBoundStore((state) => state.displayedPredictionId !== 'latestPrediction');

export const useIsPredictionLoading = () =>
  useBoundStore((state) => state.latestPrediction.isPredictionLoading);

export const usePrediction = () => [
  useGetPrediction(),
  useFetchPrediction(),
  useIsPredictionLoading()
];

export const useGetPredictionMode = (): EPredictionMode =>
  useBoundStore((state) => state.latestPrediction.predictionMode);
export const useSetPredictionMode = () => useBoundStore((state) => state.setPredictionMode);
export const usePredictionMode = (): [
  EPredictionMode,
  (predictionMode: EPredictionMode) => void
] => [useGetPredictionMode(), useSetPredictionMode()];

export const useGetWhiteNoiseTest = () => useBoundStore((state) => state.whiteNoiseTest);
export const useFetchWhiteNoiseTest = () => useBoundStore((state) => state.fetchWhiteNoiseTest);
export const useIsWhiteNoiseTestLoading = () =>
  useBoundStore((state) => state.isWhiteNoiseTestLoading);

export const useWhiteNoiseTest = () => [
  useGetWhiteNoiseTest(),
  useFetchWhiteNoiseTest(),
  useIsWhiteNoiseTestLoading()
];

export const useGetStationarityTest = () => useBoundStore((state) => state.stationarityTest);
export const useFetchStationarityTest = () => useBoundStore((state) => state.fetchStationarityTest);
export const useIsStationarityTestLoading = () =>
  useBoundStore((state) => state.isStationarityTestLoading);
export const useStationarityTest = () => [
  useGetStationarityTest(),
  useFetchStationarityTest(),
  useIsStationarityTestLoading()
];

export const useGetCausalityTest = () => useBoundStore((state) => state.causalityTest);
export const useFetchCausalityTest = () => useBoundStore((state) => state.fetchCausalityTest);
export const useIsCausalityTestLoading = () =>
  useBoundStore((state) => state.isCausalityTestLoading);
export const useCausalityTest = () => [
  useGetCausalityTest(),
  useFetchCausalityTest(),
  useIsCausalityTestLoading()
];

export const useGetPredictionHistory = () =>
  useBoundStore((state): THistoryEntry[] => state.predictionHistory);

export const useGetDisplayedPredictionId = () =>
  useBoundStore((state): TDisplayedPrediction => state.displayedPredictionId);

export const useSetDisplayedPredictionId = () =>
  useBoundStore(
    (state): ((predictionItemId: TDisplayedPrediction) => void) => state.setDisplayedPredictionId
  );

export const useDisplayedPredictionId = (): [
  TDisplayedPrediction,
  (predictionItemId: TDisplayedPrediction) => void
] => [useGetDisplayedPredictionId(), useSetDisplayedPredictionId()];

export const useGetHorizon = () => useBoundStore((state): number => state.latestPrediction.horizon);
export const useSetHorizon = () => useBoundStore((state) => state.setHorizon);

export const useHorizon = () => [useGetHorizon(), useSetHorizon()];

export const useIsHistoryDrawerOpen = (): [boolean, (isOpen: boolean) => void] => [
  useBoundStore((state) => state.isHistoryDrawerOpen),
  useBoundStore((state) => state.setIsHistoryDrawerOpen)
];
