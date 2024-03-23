import React, { useEffect, useMemo } from 'react';
import { map } from 'lodash';
import { useTheme } from 'styled-components';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TLineChartData, TTimeseriesData } from '../../../types';

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

  readonly predictionData?: TTimeseriesData;
};
const SparkLineChartsBlock = ({
  valueProperties,
  timeProperty,
  timeseriesData,
  predictionData,
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

  // const [min, max] = useTimeseriesMinMaxValues(mainChartData?.datapoints || []);
  const chartData: TLineChartData = useMemo(() => {
    const predictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      predictionData,
      theme.chartPink,
      `${selectedProp?.label} prediction`
    );
    const mainChartData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      timeseriesData,
      theme.chartBlue,
      selectedProp?.label
    );

    if (!mainChartData?.datapoints?.length) return [];
    return predictedData?.datapoints?.length ? [mainChartData, predictedData] : [mainChartData];
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
        numXAxisTicks={5}
        numYAxisTicks={5}
        formatXScale={formatUnixToDate}
        formatYScale={formatNumber}
        height={250}
        padding={{ top: 30, bottom: 30, left: 40, right: 40 }}
        defaultBrushValueBounds={defaultBrushValueBounds}
        onSelectArea={onSelectedAreaChange}
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
              // formatYScale={formatNumber}
              height={90}
              width={300}
              onClick={handleSparklineClick(prop)}
            />
          );
        })}
      </div>
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
