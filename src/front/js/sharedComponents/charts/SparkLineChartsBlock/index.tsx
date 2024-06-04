import React, { useCallback, useEffect } from 'react';
import { map } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import LineChart from '../LineChart';
import SparkLineChart from '../LineChart/SparkLineChart';
import { TDataLabel, TTimeseriesData } from '../../../types';

import { TDataProperty } from '../../../types';
import { LineChartContainer, SparkLineChartsContainer } from './styles';
import {
  TPredictedPoints,
  TValueBounds,
} from '../../../pages/Configuration/Analysis/types';
import { getSelectedDataByBoundaries } from '../../../utils';
import { isConfigurationDataIncomplete } from '../../../pages/Configuration/utils';
import { getCompleteLineChartData } from './utils';

type TEmptySparkLineChartsBlockProps = {
  readonly isLoading: boolean;
};
const EmptySparkLineChartsBlock = ({
  isLoading,
}: TEmptySparkLineChartsBlockProps) => (
  <LineChartContainer>
    {isLoading ? (
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
  const { palette } = useTheme();

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

  const mainChartData = getCompleteLineChartData(
    palette,
    timeseriesData,
    predictionData,
    selectedProp!,
    timeProperty!,
  );

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
    !selectedProp ||
    isConfigurationLoading ||
    !mainChartData
  ) {
    return <EmptySparkLineChartsBlock isLoading={!!isConfigurationLoading} />;
  }

  return (
    <LineChartContainer>
      <Box width="calc(100% - 300px - 16px)" flexGrow={1} minHeight="300px">
        <LineChart
          heading={selectedProp?.label}
          data={mainChartData.lineData}
          thresholdData={mainChartData.thresholdData}
          dataLabels={dataLabels}
          numXAxisTicks={6}
          numYAxisTicks={4}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={300}
          padding={{ top: 16, bottom: 30, left: 48, right: 10 }}
          onSelectArea={onSelectedAreaChange}
          isResponsive
          selectedAreaBounds={selectedAreaBounds}
          selectedDataLength={selectedDataLength}
          defaultIsTrainingDataSelectionOn={defaultIsTrainingDataSelectionOn}
        />
      </Box>
      {valueProperties.length > 1 && (
        <SparkLineChartsContainer>
          {map(valueProperties, (prop) => {
            const chartData = getCompleteLineChartData(
              palette,
              timeseriesData,
              predictionData,
              prop!,
              timeProperty!,
            );
            if (!chartData) return null;
            return (
              <SparkLineChart
                key={prop.label}
                heading={prop?.label || ''}
                data={chartData.lineData}
                height={90}
                width={300}
                onClick={handleSparklineClick(prop)}
                padding={{ top: 24, bottom: 18, left: 36, right: 0 }}
                formatYScale={formatNumber}
              />
            );
          })}
        </SparkLineChartsContainer>
      )}
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
