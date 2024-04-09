import React, { useEffect, useMemo } from 'react';
import { filter, isEmpty, map } from 'lodash';
import { useTheme } from 'styled-components';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TDataLabel, TLineChartData, TTimeseriesData } from '../../../types';

import { TDataProperty, TLineChartSerie } from '../../../types';
import { LineChartContainer } from './styles';

const constructLineChartDataFromTs = (
  valueProperty: TDataProperty | undefined,
  timeProperty: TDataProperty | undefined,
  data: TTimeseriesData = [],
  lineColor: string,
  label: string = ''
): TLineChartSerie | undefined => {
  return valueProperty?.value && timeProperty?.value
    ? {
        id: `${valueProperty.label}-${data?.[0]?.[valueProperty?.value]}`,
        label,
        color: lineColor,
        datapoints: map(data, (datum) => ({
          valueX: datum[timeProperty?.value] as number,
          valueY: +datum[valueProperty.value]
        })).sort((a, b) => {
          return a[timeProperty.value] - b[timeProperty.value] ? 1 : -1;
        })
      }
    : undefined;
};

type TProps = {
  readonly valueProperties: TDataProperty[];
  readonly selectedProp?: TDataProperty;
  readonly setSelectedProp: (prop: TDataProperty) => void;
  readonly timeProperty: TDataProperty;

  readonly timeseriesData: TTimeseriesData;
  readonly selectedData: TTimeseriesData;
  readonly setSelectedData: (data: TTimeseriesData) => void;

  readonly predictionData?: TTimeseriesData[];
  readonly dataLabels?: TDataLabel[];
};
const SparkLineChartsBlock = ({
  valueProperties,
  timeProperty,
  timeseriesData,
  predictionData,
  dataLabels = [],
  selectedData,
  setSelectedData,
  selectedProp,
  setSelectedProp
}: TProps) => {
  const theme = useTheme();

  useEffect(() => {
    setSelectedData(timeseriesData);
  }, [timeseriesData]);

  const onSelectedAreaChange = (domain) => {
    if (!domain) {
      setSelectedData(timeseriesData);
      return;
    }
    const { x0, x1 } = domain;
    const newSelectedData = timeseriesData.filter((s) => {
      return +s[timeProperty.value] >= x0 && +s[timeProperty.value] <= x1;
    });
    setSelectedData(newSelectedData);
    console.log(`Selected ${newSelectedData.length} datapoints`, timeseriesData);
  };

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
      theme.chartPink,
      `${selectedProp?.label} test data prediction`
    );

    const realPredictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      predictionData?.[1],
      theme.chartFuchsia,
      `${selectedProp?.label} real data prediction`
    );

    const mainChartData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      timeseriesData,
      theme.chartBlue,
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
    theme.chartPink,
    theme.chartBlue,
    timeseriesData
  ]);

  const defaultBrushValueBounds = undefined;
  return (
    <LineChartContainer>
      <LineChart
        heading={selectedProp?.label || ''}
        data={chartData}
        dataLabels={dataLabels}
        numXAxisTicks={4}
        numYAxisTicks={4}
        formatXScale={formatUnixToDate}
        formatYScale={formatNumber}
        height={260}
        padding={{ top: 16, bottom: 30, left: 40, right: 40 }}
        defaultBrushValueBounds={defaultBrushValueBounds}
        onSelectArea={onSelectedAreaChange}
        selectedDataLength={selectedData?.length}
        isResponsive={true}
      />
      <div>
        {map(valueProperties, (prop) => {
          const chartData = constructLineChartDataFromTs(
            prop,
            timeProperty,
            timeseriesData,
            theme.chartBlue,
            prop.label
          );
          return (
            <SparkLineChart
              heading={prop?.label || ''}
              data={chartData ? [chartData] : []}
              height={90}
              width={300}
              onClick={handleSparklineClick(prop)}
              padding={{ top: 8, bottom: 8, left: 24, right: 0 }}
            />
          );
        })}
      </div>
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
