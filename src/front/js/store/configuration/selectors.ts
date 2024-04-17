import { TTimeseriesData } from 'front/js/types';
import { useBoundStore } from '..';
import { EPredictionMode } from 'front/js/components/Analysis/types';

// export const useFetchPrediction = () => useBoundStore((state) => state.fetchPrediction);
export const useGetData = (): TTimeseriesData => useBoundStore((state) => state.data);
export const useSetData = () => useBoundStore((state) => state.setData);

export const useConfigData = (): [TTimeseriesData, (data: TTimeseriesData) => void] => [
  useGetData(),
  useSetData()
];

export const useFetchPrediction = () => useBoundStore((state) => state.fetchPrediction);
export const useGetPrediction = () => useBoundStore((state) => state.prediction);
export const useIsPredictionLoading = () => useBoundStore((state) => state.isPredictionLoading);

export const usePrediction = () => [
  useGetPrediction(),
  useFetchPrediction(),
  useIsPredictionLoading()
];

export const useGetPredictionMode = (): EPredictionMode =>
  useBoundStore((state) => state.predictionMode);
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
