import React, { useCallback, useEffect, useMemo } from 'react';
import { filter, intersectionWith, isEmpty, map, sortBy } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TDataLabel, TLineChartData, TTimeseriesData } from '../../../types';

import { TDataProperty, TLineChartSerie } from '../../../types';
import { LineChartContainer, SparkLineChartsContainer } from './styles';
import {
  TPredictedPoints,
  TValueBounds,
} from '../../../pages/Configuration/Analysis/types';
import { getSelectedDataByBoundaries } from '../../../utils';
import {
  PREDICTION_TIMESTAMP_PROP,
  PREDICTION_VALUE_PROP,
  convertPredictionData,
} from '../../../utils/prediction';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';
import { TThresholdData } from '../types';
import { isConfigurationDataIncomplete } from '../../../pages/Configuration/utils';

type TProps = {
  readonly configName: string;
  readonly valueProperties: TDataProperty[];
  readonly selectedProp?: TDataProperty;
  readonly setSelectedProp: (prop: TDataProperty) => void;
  readonly timeProperty?: TDataProperty;

  readonly timeseriesData: TTimeseriesData;
  readonly selectedAreaBounds?: TValueBounds;
  readonly setSelectedDataBoundaries: (data?: TValueBounds) => void;

  readonly predictionData?: {
    readonly testPrediction: TPredictedPoints;
    readonly realPrediction: TPredictedPoints;
  } & any;
  readonly dataLabels?: TDataLabel[];
  readonly defaultIsTrainingDataSelectionOn?: boolean;
  readonly isConfigurationLoading?: boolean;
};
const SparkLineChartsBlock = ({
  isConfigurationLoading,
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
  const theme = useTheme();
  const mappedARIMAPrediction = convertPredictionData(
    predictionData,
    selectedProp?.value,
  );

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
  }, [firstProp, setSelectedProp]);

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const chartData: TLineChartData = useMemo(() => {
    if (!selectedProp) return [];
    const testPredictedData = constructLineChartDataFromTs(
      PREDICTION_VALUE_PROP,
      PREDICTION_TIMESTAMP_PROP,
      mappedARIMAPrediction?.testPrediction,
      theme.palette.charts.chartPink,
      `${selectedProp?.label} test data prediction`,
    );

    const realPredictedData = constructLineChartDataFromTs(
      PREDICTION_VALUE_PROP,
      PREDICTION_TIMESTAMP_PROP,
      mappedARIMAPrediction?.realPrediction,
      theme.palette.charts.chartFuchsia,
      `${selectedProp?.label} real data prediction ${predictionData?.predictionMode}`,
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
    mappedARIMAPrediction,
    theme.palette.charts.chartPink,
    theme.palette.charts.chartFuchsia,
    theme.palette.charts.chartBlue,
    predictionData?.predictionMode,
    timeProperty?.value,
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

  const thresholdData: Array<TThresholdData> = testPredictedDataCounterpart
    ? [
        {
          id: `${selectedProp?.value}-19.43174`,
          label: selectedProp.label,
          belowAreaProps: { fill: 'violet', fillOpacity: 0.4 },
          aboveAreaProps: { fill: 'violet', fillOpacity: 0.4 },
          data: sortBy(
            map(testPredictedDataCounterpart, (a) => {
              return {
                valueX: a[timeProperty.value] as number,
                valueY0: a[selectedProp?.value] as number,
                valueY1: predictionData?.testPrediction?.[
                  selectedProp?.value
                ]?.[a[timeProperty.value]] as number,
              };
            }),
            'valueX',
          ),
        },
      ]
    : [];

  const selectedDataLength =
    (timeProperty &&
      getSelectedDataByBoundaries(
        timeseriesData,
        timeProperty,
        selectedAreaBounds,
      )?.length) ||
    timeseriesData.length;

  if (
    isConfigurationDataIncomplete(
      timeseriesData,
      timeProperty,
      valueProperties,
    ) ||
    isConfigurationLoading
  ) {
    return (
      <LineChartContainer>
        {isConfigurationLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            width="100%"
            height="300px"
          />
        ) : (
          'Some or all the data for this configuration is missing. Please create a new configuration.'
        )}
      </LineChartContainer>
    );
  }

  return (
    <LineChartContainer>
      <Box width="100%" minHeight="300px">
        <LineChart
          heading={selectedProp?.label}
          data={chartData}
          thresholdData={thresholdData}
          dataLabels={dataLabels}
          numXAxisTicks={6}
          numYAxisTicks={4}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={300}
          padding={{ top: 16, bottom: 30, left: 48, right: 10 }}
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
              timeProperty!.value,
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
                padding={{ top: 24, bottom: 18, left: 36, right: 0 }}
                formatYScale={formatNumber}
              />
            );
          })}
        </SparkLineChartsContainer>
      ) : null}
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
