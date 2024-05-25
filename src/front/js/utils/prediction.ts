import { map } from 'lodash';
import { TTimeseriesDatum } from '../types';

export const PREDICTION_TIMESTAMP_PROP = 'timestamp';
export const PREDICTION_VALUE_PROP = 'value';
export const mapARIMAPrediction = (predictionData, selectedProp) => {
  const convertARIMADatapoint = (value, index): TTimeseriesDatum => {
    return {
      [PREDICTION_TIMESTAMP_PROP]: +index,
      [PREDICTION_VALUE_PROP]: value,
    };
  };
  return [
    map(
      predictionData?.testPrediction?.[selectedProp.value],
      convertARIMADatapoint,
    ),
    map(
      predictionData?.realPrediction?.[selectedProp.value],
      convertARIMADatapoint,
    ),
  ];
};
