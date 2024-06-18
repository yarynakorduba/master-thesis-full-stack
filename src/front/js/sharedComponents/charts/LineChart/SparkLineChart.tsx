import React, { useCallback, useMemo } from 'react';
import { AxisLeft } from '@visx/axis';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { flatMap, flow, isNil, uniq } from 'lodash';
import { Threshold } from '@visx/threshold';

import { formatAxisTick, getAxisTickLabelProps, getLinearScale } from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartWrapper, HeadingMark, SparkLineChartHeading } from './styles';
import { TLineChartData } from 'front/js/types';
import { TPadding } from '../../../types/styles';
import {
  TChartThresholdDatapoint,
  TFormatXScale,
  TFormatYScale,
  TThresholdData,
} from '../types';
import { Stack } from '@mui/material';

const CHART_LEFT_PADDING = 32;
const CHART_BOTTOM_PADDING = 24;
const CHART_TOP_PADDING = 16;
const CHART_RIGHT_PADDING = 32;

const getUniqueFlatValues = (prop, data): number[] =>
  flow(
    (d) =>
      flatMap(d, (lineData) =>
        lineData?.datapoints?.map((datum) => datum?.[prop]),
      ),
    uniq,
  )(data);

/**
 * Line chart has two axes: one of them uses linear scale, and another uses band scale.
 * The vertical (default) variant renders vertical bars with band x-axis and linear y-axis.
 * The horizontal variant renders horizontal bars with linear x-axis and band y-axis.
 */

type TProps = {
  readonly data: TLineChartData;
  readonly thresholdData?: Array<TThresholdData>;
  readonly heading?: string;
  readonly headingMark?: string;
  readonly width?: number;
  readonly height?: number;
  readonly formatXScale?: TFormatXScale;
  readonly formatYScale?: TFormatYScale;
  readonly padding?: TPadding;
  readonly variant?: ChartVariant;
  readonly onClick?: () => void;
  readonly numTicks?: number;
  readonly strokeWidth?: number;
};

const LineChart = ({
  width = 900,
  height = 200,
  strokeWidth = 1,
  heading = '',
  headingMark = '',
  data,
  thresholdData = [],
  formatYScale,
  numTicks = 2,
  padding = {
    top: CHART_TOP_PADDING,
    bottom: CHART_BOTTOM_PADDING,
    left: CHART_LEFT_PADDING,
    right: CHART_RIGHT_PADDING,
  },
}: TProps) => {
  const cleanWidth = useMemo(() => {
    const clean = width - padding.left - padding.right;
    return clean > 0 ? clean : 0;
  }, [padding.left, padding.right, width]);
  const heightWithoutHeader = height - 16;
  const cleanHeight = useMemo(
    () => heightWithoutHeader - padding.top - padding.bottom,
    [heightWithoutHeader, padding.bottom, padding.top],
  );

  const xValues = useMemo(() => getUniqueFlatValues('valueX', data), [data]);
  const yValues = useMemo(() => getUniqueFlatValues('valueY', data), [data]);

  const xScale = getLinearScale(xValues, [0, cleanWidth]);
  const yScale = getLinearScale(yValues, [cleanHeight, 0]);

  const renderLine = useCallback(
    (lineData) => {
      const getX = (lineDatum) => {
        const x = xScale(lineDatum?.valueX);
        const offset = 0;
        return Number(x) + offset;
      };

      const getY = (lineDatum) => {
        const y = yScale(lineDatum?.valueY);
        const offset = 0;

        return Number(y) + offset;
      };
      return (
        <LinePath
          key={lineData?.id}
          data={lineData?.datapoints}
          x={getX}
          y={getY}
          stroke={lineData?.color}
          strokeWidth={strokeWidth}
        />
      );
    },
    [xScale, yScale, strokeWidth],
  );

  return (
    <>
      <ChartWrapper>
        <Stack direction="row" justifyContent="space-between">
          <SparkLineChartHeading variant="h5" noWrap>
            {heading}
          </SparkLineChartHeading>
          <HeadingMark>{headingMark}</HeadingMark>
        </Stack>
        <svg width={width} height={heightWithoutHeader}>
          <Group left={padding.left} top={padding.top}>
            <AxisLeft
              scale={yScale}
              hideTicks
              hideAxisLine
              tickFormat={formatAxisTick(formatYScale)}
              tickLabelProps={getAxisTickLabelProps(
                AxisVariant.left,
                '0.75rem',
              )}
              numTicks={numTicks}
            />
            {data?.map(renderLine)}
            {thresholdData.map((dataItem) => (
              <Threshold<TChartThresholdDatapoint>
                id={dataItem.id}
                key={dataItem.id}
                clipAboveTo={0}
                clipBelowTo={cleanHeight}
                data={dataItem?.data}
                x={({ valueX }) => xScale(valueX)}
                y0={({ valueY0 }) => yScale(valueY0)}
                y1={({ valueY1 }) => yScale(valueY1)}
                belowAreaProps={dataItem.belowAreaProps}
                aboveAreaProps={dataItem.aboveAreaProps}
              />
            ))}
          </Group>
        </svg>
      </ChartWrapper>
    </>
  );
};

export default function ResponsiveLineChart({
  width = 900,
  height = 200,
  strokeWidth = 1,
  heading = '',
  headingMark = '',
  variant = ChartVariant.vertical,
  data,
  thresholdData = [],
  formatYScale,
  padding = {
    top: CHART_TOP_PADDING,
    bottom: CHART_BOTTOM_PADDING,
    left: CHART_LEFT_PADDING,
    right: CHART_RIGHT_PADDING,
  },
  numTicks = 2,
  onClick,
}: TProps) {
  const renderChart = useCallback(
    (chartWidth?: number, chartHeight?: number) => (
      <LineChart
        width={chartWidth}
        height={chartHeight}
        heading={heading}
        headingMark={headingMark}
        variant={variant}
        data={data}
        thresholdData={thresholdData}
        formatYScale={formatYScale}
        padding={padding}
        onClick={onClick}
        numTicks={numTicks}
        strokeWidth={strokeWidth}
      />
    ),
    [
      heading,
      headingMark,
      variant,
      data,
      thresholdData,
      formatYScale,
      padding,
      onClick,
      numTicks,
      strokeWidth,
    ],
  );

  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width)
        ? Math.min(width, parent.width)
        : undefined;
      const responsiveHeight = !isNil(height)
        ? Math.min(height, parent.height)
        : undefined;

      return renderChart(responsiveWidth, responsiveHeight);
    },
    [renderChart, width, height],
  );

  return (
    <ParentSize
      parentSizeStyles={{
        maxHeight: height,
        maxWidth: width,
        width: 'auto',
        height,
      }}
      onClick={onClick}
    >
      {renderResponsiveChart}
    </ParentSize>
  );
}
