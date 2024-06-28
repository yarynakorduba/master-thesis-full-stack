import { find, get, isEmpty, max, maxBy, min, minBy } from 'lodash';
import { scaleLinear } from '@visx/scale';
import * as d3Scale from 'd3-scale';

import {
  THistoryEntry,
  TValueBounds,
} from '../pages/Configuration/Analysis/types';
import { TDataProperty } from '../types';
import { TDisplayedPredictionId } from '../store/types';

export const getDisplayedPrediction = (
  predictionHistory: THistoryEntry[],
  predictionId: TDisplayedPredictionId, // uuid
) => {
  return find(predictionHistory, ({ id }) => id === predictionId);
};

export const getSelectedDataByBoundaries = (
  data,
  dataFilterProperty?: TDataProperty,
  valueBounds?: TValueBounds,
) => {
  console.log('runn');
  return dataFilterProperty && valueBounds && !isEmpty(data)
    ? data.filter((s) => {
        return (
          +s[dataFilterProperty.value] >= valueBounds.x0 &&
          +s[dataFilterProperty.value] <= valueBounds.x1
        );
      })
    : data || [];
};

export const getExtent = (dataArray, byProp?: string): [number, number] => {
  if (!dataArray.length) return [0, 0];
  if (!byProp) return [min(dataArray)!, max(dataArray)!];
  return [
    get(minBy(dataArray, byProp), byProp, 0),
    get(maxBy(dataArray, byProp), byProp, 0),
  ];
};

export const getLinearValueScale =
  (data: object[], range: [number, number] | [string, string]) =>
  (key: string): d3Scale.ScaleLinear<number | string, number | string> => {
    const mapeExtent = getExtent(data, key);
    return scaleLinear<number | string>({ domain: mapeExtent, range });
  };
