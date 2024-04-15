import { map, reduce } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import {
  fetchIsWhiteNoise,
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchVARTest,
  fetchARIMA
} from '../../apiCalls/analysis';
import { useFetch } from '../../hooks/fetch';
import { TTimeseriesData, TDataProperty } from '../../types';
import { TARIMAParams, TARIMAResult } from './types';

type TWhiteNoiseResponse = { readonly isWhiteNoise: boolean };
type TWhiteNoiseResult = { [key: string]: TWhiteNoiseResponse } | undefined;
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
export const useDataStationarityTest = (
  timeseriesData: TTimeseriesData,
  valueProperties: TDataProperty[] | undefined
): TStationarityInfo => {
  const [result, setResult] = useState<TStationarityResult>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetch: handleFetchDataStationarityTest } = useFetch(fetchDataStationarityTest);

  useEffect(() => {
    setResult(undefined);
  }, [valueProperties, timeseriesData]);

  const handleFetch = useCallback(async () => {
    if (!valueProperties?.length) return;
    setIsLoading(true);

    const responses = await Promise.all(
      map(valueProperties, async (selectedProp) => {
        const dataForAnalysis = selectedProp?.value
          ? map(timeseriesData, (datum) => datum[selectedProp.value])
          : undefined;
        if (dataForAnalysis) {
          return await handleFetchDataStationarityTest(dataForAnalysis);
        }
      })
    );
    const newResult = reduce(
      responses,
      (accum, response, index) => {
        return { ...accum, [valueProperties?.[index]?.value]: response?.data };
      },
      result || {}
    );
    setResult(newResult);
    setIsLoading(false);
  }, [valueProperties, result, timeseriesData, handleFetchDataStationarityTest]);

  return {
    stationarityTestResult: result,
    isStationarityTestLoading: isLoading,
    handleFetchDataStationarityTest: handleFetch
  };
};

export const useDataCausalityTest = (
  timeseriesData: TTimeseriesData,
  selectedProps: TDataProperty[]
) => {
  const {
    data: result,
    isLoading,
    fetch: handleFetchGrangerDataCausalityTest
  } = useFetch(fetchGrangerDataCausalityTest);

  const handleFetch = useCallback(() => {
    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(timeseriesData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value]
      ]);

      if (dataForAnalysis) {
        handleFetchGrangerDataCausalityTest(dataForAnalysis, [
          selectedProps[0].value,
          selectedProps[1].value
        ]);
      }
    }
  }, [selectedProps, handleFetchGrangerDataCausalityTest, timeseriesData]);

  return {
    causalityTestResult: result,
    isCausalityTestLoading: isLoading,
    handleFetchGrangerDataCausalityTest: handleFetch
  };
};

export const useVAR = (timeseriesData: TTimeseriesData) => {
  const { fetch: fetchData } = useFetch(fetchVARTest);
  const [result, setResult] = useState<object | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchVAR = useCallback(
    async (lagOrder: number, horizon: number) => {
      if (timeseriesData) {
        setIsLoading(true);
        const newResult = await fetchData(timeseriesData, lagOrder, horizon);
        setResult(newResult?.data);
        setIsLoading(false);
      }
    },
    [timeseriesData, fetchData]
  );

  return { varResult: result, isVARLoading: isLoading, handleFetchVAR };
};

type TUseARIMAResult = {
  readonly arimaResult?: TARIMAResult;
  readonly isARIMALoading: boolean;
  readonly handleFetchARIMA: (parameters: TARIMAParams) => Promise<void>;
};

export const useARIMA = (timeseriesData: TTimeseriesData): TUseARIMAResult => {
  const { fetch: fetchData } = useFetch(fetchARIMA);
  const [result, setResult] = useState<TARIMAResult | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchARIMA = useCallback(
    async (parameters: TARIMAParams) => {
      if (timeseriesData) {
        setIsLoading(true);
        const newResult = await fetchData(timeseriesData, parameters);

        setResult(newResult?.data);
        setIsLoading(false);
      }
    },
    [timeseriesData, fetchData]
  );

  return { arimaResult: result, isARIMALoading: isLoading, handleFetchARIMA };
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
