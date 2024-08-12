import React, { useCallback, useEffect, useMemo } from 'react';
import { map } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { formatUnixToDate, formatNumber } from '../../../utils/formatters';
import { LineChart, SparkLineChart } from '../LineChart';
import { TDataLabel, TTimeseriesData } from '../../../types';

import { TDataProperty } from '../../../types';
import {
  LineChartContainer,
  SparkLineChartWrapper,
  SparkLineChartsContainer,
} from './styles';
import {
  TPredictionResult,
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

  readonly predictionData?: TPredictionResult;
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
  // dataLabels = [],
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

  const mainChartData = timeseriesData
    ? getCompleteLineChartData(
        'selectedChart',
        palette,
        timeseriesData,
        predictionData,
        selectedProp!,
        timeProperty!,
      )
    : undefined;

  const selectedDataLength = useMemo(
    () =>
      (timeProperty &&
        getSelectedDataByBoundaries(
          timeseriesData,
          timeProperty,
          selectedAreaBounds,
        )?.length) ||
      timeseriesData?.length,
    [selectedAreaBounds, timeProperty, timeseriesData],
  );

  if (
    isConfigurationLoading ||
    !mainChartData?.lineData?.length ||
    !valueProperties?.length ||
    isConfigurationDataIncomplete(timeseriesData, timeProperty, valueProperties)
  ) {
    return <EmptySparkLineChartsBlock isLoading={!!isConfigurationLoading} />;
  }

  return (
    <LineChartContainer>
      <Box
        width="calc(100% - 300px - 16px)"
        flexGrow={1}
        minHeight="300px"
        alignItems="flex-start"
      >
        <LineChart
          isResponsive
          heading={selectedProp?.label}
          data={mainChartData.lineData}
          dataRegions={mainChartData.dataRegions}
          thresholdData={mainChartData.thresholdData}
          numXAxisTicks={6}
          numYAxisTicks={4}
          formatXScale={formatUnixToDate}
          formatYScale={formatNumber}
          height={300}
          padding={{ top: 8, bottom: 30, left: 48, right: 36 }}
          onSelectArea={onSelectedAreaChange}
          selectedAreaBounds={selectedAreaBounds}
          selectedDataLength={selectedDataLength}
          defaultIsTrainingDataSelectionOn={defaultIsTrainingDataSelectionOn}
        />
      </Box>
      {valueProperties.length > 1 && (
        <SparkLineChartsContainer>
          {map(valueProperties, (prop) => {
            const chartData = getCompleteLineChartData(
              'sparkline',
              palette,
              timeseriesData,
              predictionData,
              prop!,
              timeProperty!,
            );
            if (!chartData) return null;
            const isPredicted = chartData.lineData?.length > 1;
            return (
              <SparkLineChartWrapper
                isSelected={selectedProp?.value === prop?.value}
              >
                <SparkLineChart
                  key={`sparkline-${prop?.label}`}
                  heading={prop?.label || ''}
                  data={chartData.lineData}
                  thresholdData={chartData.thresholdData}
                  height={90}
                  width={300}
                  strokeWidth={0.75}
                  onClick={handleSparklineClick(prop)}
                  padding={{ top: 24, bottom: 8, left: 36, right: 0 }}
                  formatYScale={formatNumber}
                  headingMark={isPredicted ? 'predicted' : ''}
                />
              </SparkLineChartWrapper>
            );
          })}
        </SparkLineChartsContainer>
      )}
    </LineChartContainer>
  );
};

export default SparkLineChartsBlock;
