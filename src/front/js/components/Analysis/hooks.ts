import { map, reduce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import {
  fetchIsWhiteNoise,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest
} from '../../apiCalls/analysis';
import { useFetch } from '../../hooks/fetch';
import { TTimeseriesData, TDataProperty } from '../../types';

type TWhiteNoiseResponse = { readonly isWhiteNoise: boolean };
export type TWhiteNoiseResult = { [key: string]: TWhiteNoiseResponse } | undefined;
type TWhiteNoiseInfo = {
  readonly whiteNoiseResult: TWhiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise: () => Promise<void>;
};
export const useWhiteNoise = (
  timeseriesData: TTimeseriesData,
  valueProperties: TDataProperty[] | undefined
): TWhiteNoiseInfo => {
  const [result, setResult] = useState<TWhiteNoiseResult>();
  const [isLoading, setIsLoading] = useState(false);

  const { fetch: handleFetchIsWhiteNoise } = useFetch(fetchIsWhiteNoise);

  const handleFetch = useCallback(async () => {
    if (!valueProperties?.length) return;

    setIsLoading(true);
    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(timeseriesData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return handleFetchIsWhiteNoise(dataForAnalysis);
        }
      })
    );
    const newResult = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      result || ({} as TWhiteNoiseResult)
    );
    setResult(newResult);
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProperties, timeseriesData, handleFetchIsWhiteNoise]);

  return {
    whiteNoiseResult: result,
    isWhiteNoiseLoading: isLoading,
    handleFetchIsWhiteNoise: handleFetch
  };
};

type TStationarityResponse = { readonly stationarity: number[]; readonly isStationary: boolean };
type TStationarityResult = { [key: string]: TStationarityResponse } | undefined;
type TStationarityInfo = {
  readonly stationarityTestResult: TStationarityResult;
  readonly isStationarityTestLoading: boolean;
  readonly handleFetchDataStationarityTest: () => Promise<void>;
};

type TUSeStepperResult = {
  readonly activeStep: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
  readonly handleNext: () => void;
};

export const useStepper = (): TUSeStepperResult => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleSelectStep = (index: number) => () => {
    setActiveStep(index);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };
  return { activeStep, handleSelectStep, handleNext };
};
