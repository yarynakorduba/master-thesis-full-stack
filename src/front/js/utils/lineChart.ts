import { flow, map, sortBy } from 'lodash';
import {
  TTimeseriesData,
  TLineChartSerie,
  TLineChartDatapoint,
} from '../types';
import { scaleLinear } from '@visx/scale';
import * as d3Scale from 'd3-scale';

import { getExtent } from '.';

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

export const getLinearValueScale =
  (data: object[], range: [number, number] | [string, string]) =>
  (key: string): d3Scale.ScaleLinear<number | string, number | string> => {
    const mapeExtent = getExtent(data, key);
    return scaleLinear<number | string>({ domain: mapeExtent, range });
  };
