import React, { useEffect, useMemo, useState } from 'react';
import { map, take } from 'lodash';
import { useTheme } from 'styled-components';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TLineChartData, TTimeseriesData } from '../../../types';
import { useDataCausalityTest, useDataStationarityTest, useVARTest, useWhiteNoise } from './hooks';
import { TDataProperty, TLineChartSerie } from '../../../types';
import { Content, Subtitle, Analysis, LineChartContainer } from './styles';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';

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
  readonly timeProperty: TDataProperty;
  readonly timeseriesData: TTimeseriesData;
  readonly predictedData: TTimeseriesData;
};
const SparkLineChartsBlock = ({ valueProperties, timeProperty, timeseriesData }: TProps) => {
  const theme = useTheme();

  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  // const [time, lastTs] = useSmallestTimeUnit(timeseriesData, timeProperty);
  const firstProp = valueProperties?.[0];

  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const { isStationarityTestLoading, stationarityTestResult, handleFetchDataStationarityTest } =
    useDataStationarityTest(timeseriesData, valueProperties);
  const { isWhiteNoiseLoading, whiteNoiseResult, handleFetchIsWhiteNoise } = useWhiteNoise(
    timeseriesData,
    valueProperties
  );
  const { isCausalityTestLoading, causalityTestResult, handleFetchGrangerDataCausalityTest } =
    useDataCausalityTest(timeseriesData, valueProperties);

  const { isVARTestLoading, varTestResult, handleFetchVARTest } = useVARTest(
    timeseriesData,
    valueProperties
  );

  const mappedVarTestResult = useMemo(
    () =>
      (selectedProp?.value &&
        map(varTestResult?.[selectedProp?.value], (value, index) => ({
          timestamp: +index,
          [selectedProp?.value]: value
        }))) ||
      [],
    [selectedProp?.value, varTestResult]
  );

  // const [min, max] = useTimeseriesMinMaxValues(mainChartData?.datapoints || []);
  const chartData: TLineChartData = useMemo(() => {
    const predictedData = constructLineChartDataFromTs(
      selectedProp,
      timeProperty,
      mappedVarTestResult,
      theme.contrastBlue,
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

    return predictedData?.datapoints?.length
      ? [
          // {
          //   ...mainChartData,
          //   datapoints: take(mainChartData.datapoints, mappedVarTestResult?.length || 0)
          // },
          mainChartData,
          predictedData
        ]
      : [mainChartData];
  }, [
    selectedProp,
    timeProperty,
    mappedVarTestResult,
    theme.contrastBlue,
    theme.chartBlue,
    timeseriesData
  ]);

  return (
    <Content>
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

      <Analysis>
        <h5>Predict the future datapoints</h5>
        <Subtitle>To make a prediction, we need to know a few characteristics of the data</Subtitle>
        <StationarityTest
          isVisible
          stationarityTestResult={stationarityTestResult}
          propertiesToTest={valueProperties}
          timeseriesData={timeseriesData}
          handleFetchDataStationarityTest={handleFetchDataStationarityTest}
          isStationarityTestLoading={isStationarityTestLoading}
        />
        <WhiteNoiseTest
          isVisible={!!stationarityTestResult}
          whiteNoiseResult={whiteNoiseResult}
          isWhiteNoiseLoading={isWhiteNoiseLoading}
          handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
        />
        <CausalityTest
          isVisible={!!whiteNoiseResult}
          causalityTestResult={causalityTestResult}
          isCausalityTestLoading={isCausalityTestLoading}
          handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
        />
        <Prediction
          isVisible={!!causalityTestResult}
          varTestResult={varTestResult}
          isVARTestLoading={isVARTestLoading}
          handleFetchVARTest={handleFetchVARTest}
        />
      </Analysis>
    </Content>
  );
};

export default SparkLineChartsBlock;
