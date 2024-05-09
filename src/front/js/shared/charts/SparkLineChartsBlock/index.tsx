import React, { useCallback, useEffect, useMemo } from 'react';
import { filter, intersectionWith, isEmpty, map, sortBy } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TDataLabel, TLineChartData, TTimeseriesData } from '../../../types';

import { TDataProperty, TLineChartSerie } from '../../../types';
import { LineChartContainer, SparkLineChartsContainer } from './styles';
import {
  TPredictedPoints,
  TValueBounds,
} from '../../../pages/App/Analysis/types';
import { getSelectedDataByBoundaries } from '../../../utils';
import {
  PREDICTION_TIMESTAMP_PROP,
  PREDICTION_VALUE_PROP,
  mapARIMAPrediction,
} from '../../../utils/prediction';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';

type TProps = {
  readonly valueProperties: TDataProperty[];
  readonly selectedProp?: TDataProperty;
  readonly setSelectedProp: (prop: TDataProperty) => void;
  readonly timeProperty?: TDataProperty;

  readonly timeseriesData: TTimeseriesData;
  readonly selectedAreaBounds?: TValueBounds;
  readonly setSelectedDataBoundaries: (data?: TValueBounds) => void;

  readonly predictionData?: {
    readonly prediction: TPredictedPoints;
    readonly realPrediction: TPredictedPoints;
  };
  readonly dataLabels?: TDataLabel[];
  readonly defaultIsTrainingDataSelectionOn?: boolean;
};
const SparkLineChartsBlock = ({
  valueProperties,
  timeProperty,
  timeseriesData,
  predictionData,
  dataLabels = [],
  setSelectedDataBoundaries,
  selectedAreaBounds,
  selectedProp,
  setSelectedProp,
  defaultIsTrainingDataSelectionOn = false,
}: TProps) => {
  console.log('TIMESERIES --- > ', timeseriesData);
  const theme = useTheme();
  const mappedARIMAPrediction = mapARIMAPrediction(predictionData);

  useEffect(() => {
    // if timeseries data updates, reset the selection
    setSelectedDataBoundaries(undefined);
  }, [timeseriesData]);

  const onSelectedAreaChange = useCallback(
    (domain) => {
      if (!domain) {
        setSelectedDataBoundaries(undefined);
        return;
      }
      const { x0, x1 } = domain;
      setSelectedDataBoundaries({ x0, x1 });
    },
    [setSelectedDataBoundaries],
  );

  const firstProp = valueProperties?.[0];
  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const chartData: TLineChartData = useMemo(() => {
    if (!selectedProp) return [];
    const testPredictedData = constructLineChartDataFromTs(
      PREDICTION_VALUE_PROP,
      PREDICTION_TIMESTAMP_PROP,
      mappedARIMAPrediction?.[0],
      theme.palette.charts.chartPink,
      `${selectedProp?.label} test data prediction`,
    );

    const realPredictedData = constructLineChartDataFromTs(
      PREDICTION_VALUE_PROP,
      PREDICTION_TIMESTAMP_PROP,
      mappedARIMAPrediction?.[1],
      theme.palette.charts.chartFuchsia,
      `${selectedProp?.label} real data prediction`,
    );

    const mainChartData = constructLineChartDataFromTs(
      selectedProp?.value,
      timeProperty?.value,
      timeseriesData,
      theme.palette.charts.chartBlue,
      selectedProp?.label,
    );

    return filter(
      [mainChartData, testPredictedData, realPredictedData],
      (d) => !isEmpty(d?.datapoints),
    ) as TLineChartSerie[];
  }, [
    selectedProp,
    timeProperty,
    mappedARIMAPrediction,
    theme.palette.charts.chartPink,
    theme.palette.charts.chartFuchsia,
    theme.palette.charts.chartBlue,
    timeseriesData,
  ]);

  const testPredictedDataCounterpart =
    predictionData &&
    selectedProp &&
    timeProperty &&
    intersectionWith(
      timeseriesData,
      mappedARIMAPrediction?.[0] || [],
      (a, b) => a[timeProperty?.value] === b?.[PREDICTION_TIMESTAMP_PROP],
    );

  const thresholdData = testPredictedDataCounterpart
    ? [
        {
          id: 'passengers-area-19.43174',
          label: 'passengers',
          belowAreaProps: { fill: 'violet', fillOpacity: 0.4 },
          aboveAreaProps: { fill: 'violet', fillOpacity: 0.4 },
          datapoints: sortBy(
            map(testPredictedDataCounterpart, (a) => {
              return {
                valueX: a[timeProperty.value],
                valueY0: a[selectedProp.value],
                valueY1: predictionData?.prediction[a[timeProperty.value]],
              };
            }),
            'valueX',
          ),
        },
      ]
    : [];

  console.log('###', timeseriesData);
  const selectedDataLength =
    (timeProperty &&
      getSelectedDataByBoundaries(
        timeseriesData,
        timeProperty,
        selectedAreaBounds,
      )?.length) ||
    timeseriesData.length;

  const defaultBrushValueBounds = undefined;
  if (!timeProperty || !selectedProp || isEmpty(valueProperties))
    return <LineChartContainer />;
  return (
    <LineChartContainer>
      <Box width="100%" minHeight="300px">
        <LineChart
          heading={selectedProp?.label || ''}
          data={chartData}
          thresholdData={thresholdData}
          dataLabels={dataLabels}
          numXAxisTicks={6}
          numYAxisTicks={4}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={300}
          padding={{ top: 16, bottom: 30, left: 40, right: 10 }}
          defaultBrushValueBounds={defaultBrushValueBounds}
          onSelectArea={onSelectedAreaChange}
          isResponsive={true}
          selectedAreaBounds={selectedAreaBounds}
          selectedDataLength={selectedDataLength}
          defaultIsTrainingDataSelectionOn={defaultIsTrainingDataSelectionOn}
        />
      </Box>
      {valueProperties.length > 1 ? (
        <SparkLineChartsContainer>
          {map(valueProperties, (prop) => {
            const chartData = constructLineChartDataFromTs(
              prop.value,
              timeProperty.value,
              timeseriesData,
              theme.palette.charts.chartBlue,
              prop.label,
            );
            return (
              <SparkLineChart
                key={prop.label}
                heading={prop?.label || ''}
                data={chartData ? [chartData] : []}
                height={90}
                width={300}
                onClick={handleSparklineClick(prop)}
                padding={{ top: 8, bottom: 8, left: 24, right: 0 }}
              />
            );
          })}
        </SparkLineChartsContainer>
      ) : null}
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
