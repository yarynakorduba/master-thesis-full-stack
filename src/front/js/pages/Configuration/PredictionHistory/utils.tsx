import { Palette } from '@mui/material';
import { filter, intersectionWith, isEmpty, map, sortBy } from 'lodash';

import { TLineChartSerie, TTimeseriesData } from '../../../types';
import { constructLineChartDataFromTs } from '../../../utils/lineChart';
import {
  PREDICTION_VALUE_PROP,
  PREDICTION_TIMESTAMP_PROP,
  convertPredictionData,
} from '../../../utils/prediction';
import { theme } from '../../../../styles/theme';
import { TPredictionResult } from '../Analysis/types';
import { TThresholdData } from '../../../sharedComponents/charts/types';

export const getHistoryLineChartData = (
  id: string,
  palette: Palette,
  timeseriesData: TTimeseriesData,
  predictionData?: TPredictionResult,
  timePropKey?: string,
  analyzedPropKey?: string,
) => {
  if (!analyzedPropKey || !timePropKey || !timeseriesData) {
    return { lineData: [], thresholdData: [] };
  }

  const mappedPrediction = convertPredictionData(
    predictionData,
    analyzedPropKey,
  );
  const testPredictedDataCounterpart =
    predictionData &&
    analyzedPropKey &&
    timePropKey &&
    intersectionWith(
      timeseriesData,
      mappedPrediction?.testPrediction || [],
      (a, b) => a[timePropKey] === b?.[PREDICTION_TIMESTAMP_PROP],
    );

  const mainChartData = testPredictedDataCounterpart
    ? constructLineChartDataFromTs(
        'history-pred-main-data',
        analyzedPropKey,
        timePropKey,
        testPredictedDataCounterpart,
        palette.charts.chartRealData,
        '',
      )
    : [];

  const testPredictedData = constructLineChartDataFromTs(
    `history-pred-test-${PREDICTION_VALUE_PROP}`,
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedPrediction?.testPrediction,
    palette.charts.chartTestPrediction,
    `test data prediction (${predictionData?.predictionMode || ''})`,
  );

  const realPredictedData = constructLineChartDataFromTs(
    `history-pred-real-${PREDICTION_VALUE_PROP}`,
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedPrediction?.realPrediction,
    palette.charts.chartRealPrediction,
    '',
  );

  const thresholdFillStyle = {
    fill: theme.palette.charts.chartOverlayThreshold,
    fillOpacity: 0.4,
  };

  const thresholdData: Array<TThresholdData> = testPredictedDataCounterpart
    ? [
        {
          id: `${id}-${analyzedPropKey}`,
          label: '',
          belowAreaProps: thresholdFillStyle,
          aboveAreaProps: thresholdFillStyle,
          data: sortBy(
            map(testPredictedDataCounterpart, (a) => {
              return {
                valueX: a[timePropKey] as number,
                valueY0: a[analyzedPropKey] as number,
                valueY1: predictionData?.testPrediction?.[analyzedPropKey]?.[
                  a[timePropKey]
                ] as number,
              };
            }),
            'valueX',
          ),
        },
      ]
    : [];

  return {
    lineData: filter(
      [mainChartData, testPredictedData, realPredictedData],
      (d?: TLineChartSerie) => !isEmpty(d?.datapoints),
    ) as TLineChartSerie[],
    thresholdData,
  };
};
