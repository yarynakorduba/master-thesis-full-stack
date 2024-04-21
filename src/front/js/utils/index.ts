import { isEmpty } from 'lodash';
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
