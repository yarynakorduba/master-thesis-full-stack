import { map, maxBy, minBy } from 'lodash';
import { useEffect } from 'react';
import { TDataProperty, TLineChartDatapoint, TTimeseriesData } from 'front/js/types';
import { fetchIsWhiteNoise } from '../../../apiCalls/analysis';
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

type TWhiteNoiseResult = { readonly isWhiteNoise: boolean };
export const useWhiteNoise = (
  timeseriesData: TTimeseriesData,
  selectedProp: TDataProperty | undefined
): TWhiteNoiseResult | undefined => {
  const {
    data: whiteNoiseTestResult,
    isLoading: isWhiteNoiseLoading,
    fetch: handleFetchIsWhiteNoise
  } = useFetch(fetchIsWhiteNoise);

  useEffect(() => {
    const dataForAnalysis = selectedProp?.value
      ? map(timeseriesData, (datum) => datum[selectedProp.value])
      : undefined;
    if (dataForAnalysis) {
      console.log('AAA');
      handleFetchIsWhiteNoise(dataForAnalysis);
    }
  }, [selectedProp?.value, handleFetchIsWhiteNoise, timeseriesData]);

  return whiteNoiseTestResult;
};
