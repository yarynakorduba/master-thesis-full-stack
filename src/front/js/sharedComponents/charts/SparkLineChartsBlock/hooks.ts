import { maxBy, minBy } from 'lodash';
import { TDataProperty, TLineChartDatapoint } from 'front/js/types';

export const useTimeseriesMinMaxValues = (
  chartData: TLineChartDatapoint[],
): [TLineChartDatapoint | undefined, TLineChartDatapoint | undefined] => {
  const getMaxValue = (data) => maxBy<TLineChartDatapoint>(data, 'valueY');
  const getMinValue = (data) => minBy<TLineChartDatapoint>(data, 'valueY');
  return [getMinValue(chartData), getMaxValue(chartData)];
};

export const useSmallestTimeUnit = (
  timeseriesData,
  timeProperty: TDataProperty,
) => {
  const lastTs =
    timeseriesData &&
    timeProperty?.value &&
    timeseriesData[timeseriesData.length - 1][timeProperty.value];
  const time = lastTs
    ? lastTs - timeseriesData[timeseriesData.length - 2][timeProperty.value]
    : undefined;
  return [time, lastTs];
};
