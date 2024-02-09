import React, { useCallback, useMemo } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { flatMap, flow, isNil, noop, uniq } from 'lodash';

import ChartOverlays from '../ChartOverlays';
import ChartTooltips from '../ChartTooltips';
import { useTooltipConfigs } from './hooks';
import { formatAxisTick, getAxisTickLabelProps, getLinearScale } from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartHeading, ChartWrapper } from './styles';
import { TLineChartData } from 'front/js/types';
import Legend, { TChartLegendLabel } from '../Legend';
import { TPadding } from '../types';

const CHART_X_PADDING = 40;
const CHART_Y_PADDING = 30;

const GRAY = '#E1E5EA';

const getUniqueFlatValues = (prop, data): number[] =>
  flow(
    (d) => flatMap(d, (lineData) => lineData?.datapoints?.map((datum) => datum?.[prop])),
    uniq
  )(data);

/**
 * Line chart has two axes: one of them uses linear scale, and another uses band scale.
 * The vertical (default) variant renders vertical bars with band x-axis and linear y-axis.
 * The horizontal variant renders horizontal bars with linear x-axis and band y-axis.
 */

type TProps = {
  readonly width?: number;
  readonly height?: number;
  readonly heading?: string;
  readonly variant?: ChartVariant;
  readonly data: TLineChartData;
  readonly formatXScale: (value: number) => string | number;
  readonly formatYScale: (value: number) => string | number;
  readonly numXAxisTicks?: number;
  readonly numYAxisTicks?: number;
  readonly padding?: TPadding;
  readonly onClick?: () => void;
};

const LineChart = ({
  width = 900,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
  formatXScale,
  formatYScale,
  numXAxisTicks = 8, // approximate
  numYAxisTicks = 8,
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING
  }
}: TProps) => {
  const cleanWidth = useMemo(() => {
    const clean = width - padding.left - padding.right;
    return clean > 0 ? clean : 0;
  }, [padding.left, padding.right, width]);
  const cleanHeight = useMemo(
    () => height - padding.top - padding.bottom,
    [height, padding.bottom, padding.top]
  );

  // const isVertical = useMemo(() => variant === ChartVariant.vertical, [variant]);

  const xValues = getUniqueFlatValues('valueX', data);
  const yValues = getUniqueFlatValues('valueY', data);

  // const xTickWidth = useMemo(
  //   () => (isVertical ? cleanWidth / xValues.length : cleanWidth / numXAxisTicks),
  //   [cleanWidth, isVertical, numXAxisTicks, xValues.length]
  // );

  const legendLabels = useMemo(() => {
    return (
      data?.map(
        ({ label, color }): TChartLegendLabel => ({
          label,
          color,
          width: 20,
          height: 4
        })
      ) || []
    );
  }, [data]);

  const xScale = getLinearScale(xValues, [0, cleanWidth]);
  const yScale = getLinearScale(yValues, [cleanHeight, 0]);

  const renderLine = useCallback(
    (lineData) => {
      const getX = (lineDatum) => {
        const x = xScale(lineDatum?.valueX);
        const offset = 0; //isVertical ? xScale.bandwidth() / 2 : 0;
        return Number(x) + offset;
      };

      const getY = (lineDatum) => {
        const y = yScale(lineDatum?.valueY);
        const offset = 0; //isVertical ? 0 : yScale.bandwidth() / 2;

        return Number(y) + offset;
      };
      return (
        <LinePath
          key={lineData?.id}
          data={lineData?.datapoints}
          x={getX}
          y={getY}
          stroke={lineData?.color}
          strokeWidth={2}
        />
      );
    },
    [xScale, yScale]
  );

  const { pointTooltip, xTooltip, yTooltip, handleHover, handleMouseLeave, containerRef } =
    useTooltipConfigs(
      padding.left,
      padding.top,
      cleanHeight,
      variant,
      xScale,
      yScale,
      formatXScale,
      formatYScale
    );

  return (
    <>
      <ChartHeading>{heading}</ChartHeading>
      <ChartWrapper>
        <svg width={width} height={height} ref={containerRef}>
          <Group left={padding.left} top={padding.top}>
            {variant === ChartVariant.vertical ? (
              <GridRows
                scale={yScale as any}
                width={cleanWidth}
                height={cleanHeight}
                stroke={GRAY}
              />
            ) : (
              <GridColumns
                scale={xScale as any}
                width={cleanWidth}
                height={cleanHeight}
                stroke={GRAY}
              />
            )}
            <AxisBottom
              top={cleanHeight}
              scale={xScale as any}
              hideTicks
              hideAxisLine
              tickFormat={formatAxisTick(formatXScale)}
              tickLabelProps={getAxisTickLabelProps() as any}
              numTicks={numXAxisTicks}
            />
            <AxisLeft
              scale={yScale as any}
              hideTicks
              hideAxisLine
              tickFormat={formatAxisTick(formatYScale)}
              tickLabelProps={getAxisTickLabelProps(AxisVariant.left) as any}
              numTicks={numYAxisTicks}
            />
            {data?.map(renderLine)}
          </Group>
          <ChartOverlays
            offsetLeft={padding.left}
            offsetTop={padding.top}
            width={cleanWidth}
            height={cleanHeight}
            xScale={xScale}
            yScale={yScale}
            dataSeries={data}
            onHover={handleHover}
            onMouseLeave={handleMouseLeave}
          />
        </svg>
        {legendLabels.length > 1 ? <Legend items={legendLabels} maxWidth={width} /> : null}
        <ChartTooltips pointTooltip={pointTooltip} xTooltip={xTooltip} yTooltip={yTooltip} />
      </ChartWrapper>
    </>
  );
};

export default function ResponsiveLineChart({
  width = 900,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
  formatXScale,
  formatYScale,
  numXAxisTicks = 8, // approximate
  numYAxisTicks = 8, // approximate
  isResponsive = true,
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING
  },
  onClick = noop
}: TProps & { readonly isResponsive?: boolean }) {
  const renderChart = useCallback(
    (chartWidth, chartHeight) => (
      <LineChart
        width={chartWidth}
        height={chartHeight}
        heading={heading}
        variant={variant}
        data={data}
        formatXScale={formatXScale}
        formatYScale={formatYScale}
        onClick={onClick}
        numXAxisTicks={numXAxisTicks} // approximate
        numYAxisTicks={numYAxisTicks}
        padding={padding}
      />
    ),
    [data, formatXScale, formatYScale, heading, numXAxisTicks, numYAxisTicks, variant, padding]
  );

  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width) && Math.min(width, parent.width);
      const responsiveHeight = !isNil(height) && Math.min(height, parent.height);

      return renderChart(responsiveWidth, responsiveHeight);
    },
    [renderChart, width, height]
  );

  if (!isResponsive) return renderChart(width, 400);
  return (
    <ParentSize parentSizeStyles={{ maxHeight: height, maxWidth: width, height }}>
      {renderResponsiveChart}
    </ParentSize>
  );
}
