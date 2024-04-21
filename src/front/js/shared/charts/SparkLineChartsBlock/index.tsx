import React, { useCallback, useEffect, useMemo } from 'react';
import { filter, flow, isEmpty, map, sortBy } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TDataLabel, TLineChartData, TLineChartDatapoint, TTimeseriesData } from '../../../types';

import { TDataProperty, TLineChartSerie } from '../../../types';
import { LineChartContainer, SparkLineChartsContainer } from './styles';

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
  readonly selectedAreaBounds: any;
  // readonly setSelectedDataBoundaries: (data: TTimeseriesData) => void;
  readonly setSelectedDataBoundaries: (data: any) => void;

  readonly predictionData?: TTimeseriesData[];
  readonly dataLabels?: TDataLabel[];
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
  setSelectedProp
}: TProps) => {
  const theme = useTheme();

  useEffect(() => {
    // setSelectedDataBoundaries(timeseriesData);

    setSelectedDataBoundaries(
      selectedProp && {
        x0: timeseriesData[0][selectedProp?.value],
        x1: timeseriesData[timeseriesData.length - 1][selectedProp?.value]
      }
    );
  }, [timeseriesData]);

  const onSelectedAreaChange = useCallback(
    (domain) => {
      if (!domain) {
        // setSelectedDataBoundaries(timeseriesData);
        setSelectedDataBoundaries(
          selectedProp && {
            x0: timeseriesData[0][selectedProp?.value],
            x1: timeseriesData[timeseriesData.length - 1][selectedProp?.value]
          }
        );
        return;
      }
      const { x0, x1 } = domain;
      const newSelectedData = timeseriesData.filter((s) => {
        return +s[timeProperty.value] >= x0 && +s[timeProperty.value] <= x1;
      });
      // setSelectedDataBoundaries(newSelectedData);
      setSelectedDataBoundaries({ x0, x1 });

      console.log(`Selected ${newSelectedData.length} datapoints`, timeseriesData);
    },
    [selectedProp, setSelectedDataBoundaries, timeProperty.value, timeseriesData]
  );

  // const [time, lastTs] = useSmallestTimeUnit(timeseriesData, timeProperty);
  const firstProp = valueProperties?.[0];
  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const chartData: TLineChartData = useMemo(() => {
    const predictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      predictionData?.[0],
      theme.palette.charts.chartPink,
      `${selectedProp?.label} test data prediction`
    );

    const realPredictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      predictionData?.[1],
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
      [mainChartData, predictedData, realPredictedData],
      (d) => !isEmpty(d?.datapoints)
    ) as TLineChartSerie[];
  }, [
    selectedProp,
    timeProperty,
    predictionData,
    theme.palette.charts.chartPink,
    theme.palette.charts.chartBlue,
    timeseriesData
  ]);

  const defaultBrushValueBounds = undefined;
  return (
    <LineChartContainer>
      <Box width="100%">
        <LineChart
          heading={selectedProp?.label || ''}
          data={chartData}
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
