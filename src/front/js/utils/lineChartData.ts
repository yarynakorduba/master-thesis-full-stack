import { flow, map, sortBy } from 'lodash';
import {
  TTimeseriesData,
  TLineChartSerie,
  TLineChartDatapoint,
} from '../types';

export const constructLineChartDataFromTs = (
  seriesId: string,
  valueProperty: string | undefined,
  timeProperty: string | undefined,
  data: TTimeseriesData = [],
  lineColor: string,
  label: string = '',
): TLineChartSerie | undefined => {
  if (!(valueProperty && timeProperty)) return undefined;
  const datapoints: TLineChartDatapoint[] = flow([
    (d) =>
      map(d, (datum) => ({
        valueX: datum[timeProperty] as number,
        valueY: +datum[valueProperty],
      })),
    (d) => sortBy(d, 'valueX'),
  ])(data);
  return {
    id: seriesId,
    label,
    color: lineColor,
    datapoints,
  };
};
