import {
  TDataProperty,
  TLineChartSerie,
  TTimeseriesData,
} from 'front/js/types';
import { constructLineChartDataFromTs } from '../../../utils/lineChart';
import {
  convertPredictionData,
  PREDICTION_VALUE_PROP,
  PREDICTION_TIMESTAMP_PROP,
} from '../../../utils/prediction';
import { theme } from '../../../../styles/theme';
import {
  intersectionWith,
  sortBy,
  map,
  filter,
  isEmpty,
  keys,
  values,
} from 'lodash';
import { Palette } from '@mui/material';

import { TThresholdData } from '../types';
import { TPredictionResult } from 'front/js/pages/Configuration/Analysis/types';
import { getExtent } from '../../../utils';

export const constructLineChartPredictionRegionsData = (
  palette: Palette,
  mainChartData,
  predictionData,
) => {
  if (!predictionData || !mainChartData) return [];
  const testPredValues = map(
    keys(values(predictionData?.testPrediction)[0]),
    (k) => +k,
  );
  const realPredValues = map(
    keys(values(predictionData?.realPrediction)[0]),
    (k) => +k,
  );
  const testExtent = getExtent(testPredValues);
  const realExtent = getExtent(realPredValues);

  console.log(predictionData);

  const regions: any = [];
  if (predictionData?.trainExtent?.from && predictionData?.trainExtent?.to) {
    regions.push({
      from: new Date(predictionData?.trainExtent?.from).getTime(),
      to: new Date(predictionData?.trainExtent?.to).getTime(),
      label: 'Train',
      fill: palette.charts.chartRealData,
      color: 'white',
    } as any);
  }
  if (!isEmpty(testExtent)) {
    regions.push({
      from: testExtent[0],
      to: testExtent[1],
      label: 'Test',
      fill: palette.charts.chartTestPrediction,
      color: 'white',
    });
  }
  if (!isEmpty(realExtent)) {
    regions.push({
      from: realExtent[0],
      to: realExtent[1],
      label: 'Prediction',
      fill: palette.charts.chartRealPrediction,
      color: 'white',
    });
  }
  return regions;
};

export const getCompleteLineChartData = (
  id: string, // should be unique
  palette: Palette,
  timeseriesData: TTimeseriesData,
  predictionData?: TPredictionResult,
  analyzedProp?: TDataProperty,
  timeProp?: TDataProperty,
) => {
  if (!analyzedProp || !timeProp || !timeseriesData) {
    return { lineData: [], thresholdData: [] };
  }
  const mappedARIMAPrediction = convertPredictionData(
    predictionData,
    analyzedProp?.value,
  );

  const mainChartData = constructLineChartDataFromTs(
    `sparkline-main-data`,
    analyzedProp?.value,
    timeProp?.value,
    timeseriesData,
    palette.charts.chartRealData,
    analyzedProp?.label,
  );

  const testPredictedData = constructLineChartDataFromTs(
    `sparkline-pred-test-${PREDICTION_VALUE_PROP}`,
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedARIMAPrediction?.testPrediction,
    palette.charts.chartTestPrediction,
    `test prediction (${predictionData?.predictionMode || ''})`,
  );

  const realPredictedData = constructLineChartDataFromTs(
    `sparkline-pred-real-${PREDICTION_VALUE_PROP}`,
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedARIMAPrediction?.realPrediction,
    palette.charts.chartRealPrediction,
    `prediction (${predictionData?.predictionMode || ''})`,
  );

  const testPredictedDataCounterpart =
    predictionData &&
    analyzedProp &&
    timeProp &&
    intersectionWith(
      timeseriesData,
      mappedARIMAPrediction?.testPrediction || [],
      (a, b) => a[timeProp?.value] === b?.[PREDICTION_TIMESTAMP_PROP],
    );

  const thresholdFillStyle = {
    fill: theme.palette.charts.chartOverlayThreshold,
    fillOpacity: 0.4,
  };
  const thresholdData: Array<TThresholdData> = testPredictedDataCounterpart
    ? [
        {
          id: `${id}-${analyzedProp?.value}-${analyzedProp.label}`,
          label: analyzedProp.label,
          belowAreaProps: thresholdFillStyle,
          aboveAreaProps: thresholdFillStyle,
          data: sortBy(
            map(testPredictedDataCounterpart, (a) => {
              return {
                valueX: a[timeProp.value] as number,
                valueY0: a[analyzedProp?.value] as number,
                valueY1: predictionData?.testPrediction?.[
                  analyzedProp?.value
                ]?.[a[timeProp.value]] as number,
              };
            }),
            'valueX',
          ),
        },
      ]
    : [];

  const dataRegions = constructLineChartPredictionRegionsData(
    palette,
    mainChartData,
    predictionData,
  );

  return {
    lineData: filter(
      [mainChartData, testPredictedData, realPredictedData],
      (d) => !isEmpty(d?.datapoints),
    ) as TLineChartSerie[],
    thresholdData,
    dataRegions,
  };
};
