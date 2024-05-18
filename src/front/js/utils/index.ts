import { find, get, isEmpty, isNil, maxBy, minBy } from 'lodash';
import { TValueBounds } from '../pages/Configuration/Analysis/types';
import { TDataProperty } from '../types';

export const getSelectedDataBoundaries = (state) => {
  if (isNil(state.displayedPredictionId)) return state.selectedDataBoundaries;
  const displayedPrediction = find(
    state.predictionHistory,
    ({ id }) => id === state.displayedPredictionId,
  );
  return displayedPrediction?.selectedDataBoundaries;
};

export const getSelectedDataByBoundaries = (
  data,
  dataFilterProperty: TDataProperty,
  valueBounds?: TValueBounds,
) =>
  valueBounds && !isEmpty(data)
    ? data.filter(
        (s) =>
          +s[dataFilterProperty.value] >= valueBounds.x0 &&
          +s[dataFilterProperty.value] <= valueBounds.x1,
      )
    : data || [];

export const getExtent = (dataArray, byProp) => {
  return [
    get(minBy(dataArray, byProp), byProp, 0),
    get(maxBy(dataArray, byProp), byProp, 0),
  ];
};
