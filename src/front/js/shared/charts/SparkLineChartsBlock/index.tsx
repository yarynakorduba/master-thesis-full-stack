import React, { useEffect, useState } from 'react';
import { map } from 'lodash';
import { useTheme } from 'styled-components';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TTimeseriesData } from '../../../types';
import {
  useDataCausalityTest,
  useDataStationarityTest,
  useTimeseriesMinMaxValues,
  useVARTest,
  useWhiteNoise
} from './hooks';
import { TDataProperty, TLineChartSerie } from '../../../types';
import { Content, Subtitle, Analysis } from './styles';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';

const constructLineChartDataFromTs = (
  valueProperty: TDataProperty | undefined,
  timeProperty: TDataProperty | undefined,
  data: TTimeseriesData,
  lineColor: string
): TLineChartSerie | undefined => {
  return valueProperty?.value && timeProperty?.value
    ? {
        id: `${valueProperty.label}-${data.length}`,
        label: valueProperty.label || '',
        color: lineColor,
        datapoints: map(data, (datum) => ({
          valueX: datum[timeProperty?.value] as number,
          valueY: +datum[valueProperty.value]
        }))
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
  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  // const [time, lastTs] = useSmallestTimeUnit(timeseriesData, timeProperty);
  const firstProp = valueProperties?.[0];

  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const theme = useTheme();

  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };

  const { isStationarityTestLoading, stationarityTestResult, handleFetchDataStationarityTest } =
    useDataStationarityTest(timeseriesData, selectedProp);
  const { isWhiteNoiseLoading, whiteNoiseResult, handleFetchIsWhiteNoise } = useWhiteNoise(
    timeseriesData,
    selectedProp
  );
  const { isCausalityTestLoading, causalityTestResult, handleFetchGrangerDataCausalityTest } =
    useDataCausalityTest(timeseriesData, valueProperties);

  const { isVARTestLoading, varTestResult, handleFetchVARTest } = useVARTest(
    timeseriesData,
    valueProperties
  );

  const mappedVarTestResult = selectedProp?.value
    ? map(varTestResult?.[selectedProp?.value] as any, (value, index) => ({
        timestamp: +index,
        [selectedProp?.value]: value
      }))
    : [] || [];
  const predictedData = constructLineChartDataFromTs(
    selectedProp,
    timeProperty,
    mappedVarTestResult,
    theme.contrastBlue
  );
  const mainChartData = constructLineChartDataFromTs(
    selectedProp,
    timeProperty,
    timeseriesData,
    theme.chartBlue
  );
  const [min, max] = useTimeseriesMinMaxValues(mainChartData?.datapoints || []);
  const chartData = predictedData ? [mainChartData, predictedData] : [mainChartData];
  if (!mainChartData) return null;

  return (
    <Content>
      <div>
        <LineChart
          heading={selectedProp?.label || ''}
          data={chartData as any}
          numXAxisTicks={5}
          numYAxisTicks={5}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={250}
          padding={{ top: 30, bottom: 20, left: 40, right: 40 }}
        />
        {/* <DataInfo>
          Datapoints: {mainChartData?.datapoints?.length}, Min: {min?.valueY}, Max: {max?.valueY},
          {isWhiteNoiseLoading ? (
            ''
          ) : (
            <> Is data white noise? {whiteNoiseResult?.isWhiteNoise ? 'yes' : 'no'}</>
          )}
          {isStationarityTestLoading ? (
            ''
          ) : (
            <> Is data stationary? {(stationarityTestResult as any)?.isStationary ? 'yes' : 'no'}</>
          )}
        </DataInfo> */}
      </div>
      <div>
        {map(valueProperties, (prop) => {
          const chartData = [
            constructLineChartDataFromTs(prop, timeProperty, timeseriesData, theme.chartBlue)
          ];
          return (
            <SparkLineChart
              heading={prop?.label || ''}
              data={chartData}
              formatYScale={formatNumber}
              height={90}
              width={300}
              onClick={handleSparklineClick(prop)}
            />
          );
        })}
      </div>
      <Analysis>
        <h5>Predict the future datapoints</h5>
        <Subtitle>To make a prediction, we need to know a few characteristics of the data</Subtitle>
        <StationarityTest
          isVisible
          stationarityTestResult={stationarityTestResult}
          selectedProp={selectedProp}
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
