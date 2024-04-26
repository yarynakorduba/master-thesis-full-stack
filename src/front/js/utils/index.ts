import { get, isEmpty, maxBy, minBy } from 'lodash';
import { TValueBounds } from '../pages/App/Analysis/types';
import { TDataProperty } from '../types';

export const getSelectedDataByBoundaries = (
  data,
  dataFilterProperty: TDataProperty,
  valueBounds?: TValueBounds
) =>
  valueBounds && !isEmpty(data)
    ? data.filter(
        (s) =>
          +s[dataFilterProperty.value] >= valueBounds.x0 &&
          +s[dataFilterProperty.value] <= valueBounds.x1
      )
    : data || [];

export const getExtent = (dataArray, byProp) => {
  return [get(minBy(dataArray, byProp), byProp, 0), get(maxBy(dataArray, byProp), byProp, 0)];
};
