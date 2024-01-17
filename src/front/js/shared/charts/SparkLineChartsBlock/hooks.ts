import { keys, map, maxBy, minBy } from 'lodash';
import { useEffect } from 'react';
import { TDataProperty, TLineChartDatapoint, TTimeseriesData } from 'front/js/types';
import {
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchIsWhiteNoise
} from '../../../apiCalls/analysis';
import { useFetch } from '../../../hooks/fetch';

export const useTimeseriesMinMaxValues = (
  chartData: TLineChartDatapoint[]
): [TLineChartDatapoint | undefined, TLineChartDatapoint | undefined] => {
  const getMaxValue = (data) => maxBy<TLineChartDatapoint>(data, 'valueY');
  const getMinValue = (data) => minBy<TLineChartDatapoint>(data, 'valueY');
  return [getMinValue(chartData), getMaxValue(chartData)];
};

export const useSmallestTimeUnit = (timeseriesData, timeProperty: TDataProperty) => {
  const lastTs =
    timeseriesData &&
    timeProperty?.value &&
    timeseriesData[timeseriesData.length - 1][timeProperty.value];
  const time = lastTs
    ? lastTs - timeseriesData[timeseriesData.length - 2][timeProperty.value]
    : undefined;
  return [time, lastTs];
};

type TWhiteNoiseResult = { readonly whiteNoiseResult: any; readonly isWhiteNoiseLoading: boolean };
export const useWhiteNoise = (
  timeseriesData: TTimeseriesData,
  selectedProp: TDataProperty | undefined
): TWhiteNoiseResult => {
  const { data: result, isLoading, fetch: handleFetchIsWhiteNoise } = useFetch(fetchIsWhiteNoise);

  useEffect(() => {
    const dataForAnalysis = selectedProp?.value
      ? map(timeseriesData, (datum) => datum[selectedProp.value])
      : undefined;
    if (dataForAnalysis) {
      handleFetchIsWhiteNoise(dataForAnalysis);
    }
  }, [selectedProp?.value, handleFetchIsWhiteNoise, timeseriesData]);

  return { whiteNoiseResult: result, isWhiteNoiseLoading: isLoading };
};

export const useDataStationarityTest = (
  timeseriesData: TTimeseriesData,
  selectedProp: TDataProperty | undefined
) => {
  const {
    data: result,
    isLoading,
    fetch: handleFetchDataStationarityTest
  } = useFetch(fetchDataStationarityTest);

  useEffect(() => {
    const dataForAnalysis = selectedProp?.value
      ? map(timeseriesData, (datum) => datum[selectedProp.value])
      : undefined;
    if (dataForAnalysis) {
      handleFetchDataStationarityTest(dataForAnalysis);
    }
  }, [selectedProp?.value, handleFetchDataStationarityTest, timeseriesData]);

  return { stationarityTestResult: result, isStationarityTestLoading: isLoading };
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

  useEffect(() => {
    console.log(selectedProps?.[0]?.value, selectedProps?.[1]?.value);
    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(timeseriesData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value]
      ]);

      if (dataForAnalysis) {
        console.log('aAAAAA --- >>> ');
        handleFetchGrangerDataCausalityTest(dataForAnalysis);
      }
    }
  }, [selectedProps, handleFetchGrangerDataCausalityTest, timeseriesData]);

  return { causalityTestResult: result, isCausalityTestLoading: isLoading };
};
