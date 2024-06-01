import { map } from 'lodash';
import { TTimeseriesDatum } from '../types';

export const PREDICTION_TIMESTAMP_PROP = 'timestamp';
export const PREDICTION_VALUE_PROP = 'value';
export const convertPredictionData = (predictionData, prop) => {
  const { testPrediction, realPrediction } = predictionData || {};
  const convertDatapoint = (value, index): TTimeseriesDatum => ({
    [PREDICTION_TIMESTAMP_PROP]: +index,
    [PREDICTION_VALUE_PROP]: value,
  });
  return {
    testPrediction: map(testPrediction?.[prop], convertDatapoint),
    realPrediction: map(realPrediction?.[prop], convertDatapoint),
  };
};
