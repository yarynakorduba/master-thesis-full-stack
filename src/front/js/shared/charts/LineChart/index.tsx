import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridColumns, GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { LinePath } from '@visx/shape';
import { ParentSize } from '@visx/responsive';
import { flatMap, flow, isNil, noop, uniq } from 'lodash';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';

import ChartOverlays from '../ChartOverlays';
import ChartTooltips from '../ChartTooltips';
import { useTooltipConfigs } from './hooks';
import { formatAxisTick, getAxisTickLabelProps, getLinearScale } from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartHeading, ChartWrapper } from './styles';
import { TLineChartData } from 'front/js/types';
import Legend, { TChartLegendLabel } from '../Legend';
import { TPadding } from '../types';

export const CHART_X_PADDING = 40;
export const CHART_Y_PADDING = 30;

const GRAY = '#E1E5EA';
const selectedBrushStyle = {
  fill: 'transparent',
  stroke: 'blue',
  background: 'blue'
};

// We need to manually offset the handles for them to be rendered at the right position
function BrushHandle({ x, height, isBrushActive }: BrushHandleRenderProps) {
  const pathWidth = 8;
  const pathHeight = 15;
  if (!isBrushActive) {
    return null;
  }
  return (
    <Group left={x + pathWidth / 2} top={(height - pathHeight) / 2}>
      <path
        fill="#f2f2f2"
        d="M -4.5 0.5 L 3.5 0.5 L 3.5 15.5 L -4.5 15.5 L -4.5 0.5 M -1.5 4 L -1.5 12 M 0.5 4 L 0.5 12"
        stroke="#999999"
        strokeWidth="1"
        style={{ cursor: 'ew-resize' }}
      />
    </Group>
  );
}

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
  width = 2000,
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
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    console.log('Updated');
    setFilteredData(data);
  }, [data.length]);

  const cleanWidth = useMemo(() => {
    const clean = width - padding.left - padding.right;
    return clean > 0 ? clean : 0;
  }, [padding.left, padding.right, width]);
  const cleanHeight = useMemo(
    () => height - padding.top - padding.bottom,
    [height, padding.bottom, padding.top]
  );

  // const isVertical = useMemo(() => variant === ChartVariant.vertical, [variant]);

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

  const xValues = getUniqueFlatValues('valueX', filteredData);
  const xBrushValues = getUniqueFlatValues('valueX', data);
  const yValues = getUniqueFlatValues('valueY', data);

  const xScale = getLinearScale(xValues, [0, cleanWidth]);
  const xBrushScale = getLinearScale(xBrushValues, [0, cleanWidth]);
  const yScale = getLinearScale(yValues, [cleanHeight, 0]);
  const yBrushScale = getLinearScale(yValues, [20, 0]);

  const getX =
    (scale = xScale) =>
    (lineDatum) => {
      const x = scale(lineDatum?.valueX);
      const offset = 0; //isVertical ? xScale.bandwidth() / 2 : 0;
      return Number(x) + offset;
    };

  const getY =
    (scale = yScale) =>
    (lineDatum) => {
      const y = scale(lineDatum?.valueY);
      const offset = 0; //isVertical ? 0 : yScale.bandwidth() / 2;
      return Number(y) + offset;
    };

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1, y0, y1 } = domain;

    const updatedData = data.map(({ datapoints, ...rest }) => ({
      ...rest,
      datapoints: datapoints.filter((s) => {
        if (!s) return;

        return !isNil(s.valueX) && !isNil(s.valueY) && s.valueX > x0 && s.valueX < x1;
      })
    }));
    setFilteredData(updatedData);
  };

  const renderLine = useCallback((lineData, xGetter, yGetter) => {
    return (
      <LinePath
        key={lineData?.id}
        data={lineData?.datapoints}
        x={xGetter as any}
        y={yGetter as any}
        stroke={lineData?.color}
        strokeWidth={2}
      />
    );
  }, []);

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
        <svg width={width} height={height + 40} ref={containerRef}>
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
            {filteredData?.map((lineData) => renderLine(lineData, getX(xScale), getY(yScale)))}
          </Group>
          <ChartOverlays
            offsetLeft={padding.left}
            offsetTop={padding.top}
            width={cleanWidth}
            height={cleanHeight}
            xScale={xScale}
            yScale={yScale}
            dataSeries={filteredData}
            onHover={handleHover}
            onMouseLeave={handleMouseLeave}
          />
          <Group style={{ fill: 'red' }} left={padding.left} top={cleanHeight + 60}>
            {data?.map((lineData) => renderLine(lineData, getX(xBrushScale), getY(yBrushScale)))}
            <Brush
              brushDirection="horizontal"
              xScale={xBrushScale as any}
              yScale={yScale as any}
              width={cleanWidth}
              height={20}
              handleSize={8}
              resizeTriggerAreas={['left', 'right']}
              onChange={onBrushChange}
              selectedBoxStyle={selectedBrushStyle}
              useWindowMoveEvents
              renderBrushHandle={(props) => <BrushHandle {...props} />}
            />
          </Group>
        </svg>
        {legendLabels.length > 1 ? <Legend items={legendLabels} maxWidth={width} /> : null}
        <ChartTooltips pointTooltip={pointTooltip} xTooltip={xTooltip} yTooltip={yTooltip} />
      </ChartWrapper>
    </>
  );
};

export default function ResponsiveLineChart({
  width = 2000,
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
    [
      heading,
      variant,
      data,
      formatXScale,
      formatYScale,
      onClick,
      numXAxisTicks,
      numYAxisTicks,
      padding
    ]
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
