import { useMemo } from 'react';
import { useConfigData } from '../../../store/currentConfiguration/selectors';
import { filter, flatMap, flow, map } from 'lodash';
import type { TCausalityResult } from './types';

// type TWhiteNoiseInfo = {
//   readonly whiteNoiseResult: TWhiteNoiseResult;
//   readonly isWhiteNoiseLoading: boolean;
//   readonly handleFetchIsWhiteNoise: () => Promise<void>;
// };

type TStationarityResponse = {
  readonly stationarity: number[];
  readonly isStationary: boolean;
};

type TStationarityResult = { [key: string]: TStationarityResponse } | undefined;
type TStationarityInfo = {
  readonly stationarityTestResult: TStationarityResult;
  readonly isStationarityTestLoading: boolean;
  readonly handleFetchDataStationarityTest: () => Promise<void>;
};

export const useCausalityDataForNetworkGraph = (
  causalityTestResult: TCausalityResult | undefined,
) => {
  const { valueProperties } = useConfigData();

  const nodes = useMemo(
    () =>
      map(valueProperties, ({ value, label }) => ({
        id: value,
        label,
      })),
    [valueProperties],
  );
  const edges = useMemo(
    () =>
      flatMap(causalityTestResult, (keyPair) => {
        return flow(
          (pair) => filter(pair, 'isCausal'),
          (pair) => map(pair, ({ source, target }) => ({ source, target })),
        )(keyPair);
      }),
    [causalityTestResult],
  );

  return { nodes, edges };
};
