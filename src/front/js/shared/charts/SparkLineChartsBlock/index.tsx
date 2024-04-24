import React, { useCallback, useEffect, useMemo } from 'react';
import { filter, flow, intersectionWith, isEmpty, map, sortBy } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import {
  TDataLabel,
  TLineChartData,
  TLineChartDatapoint,
  TTimeseriesData,
  TTimeseriesDatum
} from '../../../types';

import { TDataProperty, TLineChartSerie } from '../../../types';
import { LineChartContainer, SparkLineChartsContainer } from './styles';
import { TPredictedPoints, TValueBounds } from '../../../pages/App/Analysis/types';
import { getSelectedDataByBoundaries } from '../../../utils';

const constructLineChartDataFromTs = (
  valueProperty: TDataProperty | undefined,
  timeProperty: TDataProperty | undefined,
  data: TTimeseriesData = [],
  lineColor: string,
  label: string = ''
): TLineChartSerie | undefined => {
  if (!(valueProperty?.value && timeProperty?.value)) return undefined;
  const datapoints: TLineChartDatapoint[] = flow([
    (d) =>
      map(d, (datum) => ({
        valueX: datum[timeProperty?.value] as number,
        valueY: +datum[valueProperty.value]
      })),
    (d) => sortBy(d, 'valueX')
  ])(data);
  return {
    id: `${valueProperty.label}-${data?.[0]?.[valueProperty?.value]}`,
    label,
    color: lineColor,
    datapoints
  };
};

type TProps = {
  readonly valueProperties: TDataProperty[];
  readonly selectedProp?: TDataProperty;
  readonly setSelectedProp: (prop: TDataProperty) => void;
  readonly timeProperty: TDataProperty;

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
  defaultIsTrainingDataSelectionOn = false
}: TProps) => {
  const theme = useTheme();

  const mappedARIMAPrediction = useMemo(() => {
    if (!(selectedProp?.value && predictionData)) return [[], []];

    const convertARIMADatapoint = (value, index): TTimeseriesDatum => {
      return {
        [timeProperty.value]: +index,
        [selectedProp?.value]: value
      };
    };
    return [
      map(predictionData?.prediction, convertARIMADatapoint),
      map(predictionData?.realPrediction, convertARIMADatapoint)
    ];
  }, [selectedProp?.value, predictionData, timeProperty.value]);

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
    [setSelectedDataBoundaries]
  );

  const firstProp = valueProperties?.[0];
  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const chartData: TLineChartData = useMemo(() => {
    const testPredictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      mappedARIMAPrediction?.[0],
      theme.palette.charts.chartPink,
      `${selectedProp?.label} test data prediction`
    );

    const realPredictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      mappedARIMAPrediction?.[1],
      theme.palette.charts.chartFuchsia,
      `${selectedProp?.label} real data prediction`
    );

    const mainChartData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      timeseriesData,
      theme.palette.charts.chartBlue,
      selectedProp?.label
    );

    return filter(
      [mainChartData, testPredictedData, realPredictedData],
      (d) => !isEmpty(d?.datapoints)
    ) as TLineChartSerie[];
  }, [
    selectedProp,
    timeProperty,
    mappedARIMAPrediction,
    theme.palette.charts.chartPink,
    theme.palette.charts.chartFuchsia,
    theme.palette.charts.chartBlue,
    timeseriesData
  ]);

  const testPredictedDataCounterpart =
    predictionData &&
    selectedProp &&
    intersectionWith(
      timeseriesData,
      mappedARIMAPrediction?.[0] || [],
      (a, b) => a[timeProperty?.value] === b?.[timeProperty?.value]
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
                valueY1: predictionData?.prediction[a[timeProperty.value]]
              };
            }),
            'valueX'
          )
        }
      ]
    : [];

  const selectedDataLength =
    getSelectedDataByBoundaries(timeseriesData, timeProperty, selectedAreaBounds)?.length ||
    timeseriesData.length;

  const defaultBrushValueBounds = undefined;
  return (
    <LineChartContainer>
      <Box width="100%">
        <LineChart
          heading={selectedProp?.label || ''}
          data={chartData}
          thresholdData={thresholdData}
          dataLabels={dataLabels}
          numXAxisTicks={6}
          numYAxisTicks={4}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={260}
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
              prop,
              timeProperty,
              timeseriesData,
              theme.palette.charts.chartBlue,
              prop.label
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
