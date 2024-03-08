import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { isNil, noop } from 'lodash';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush, { BaseBrushState, UpdateBrush } from '@visx/brush/lib/BaseBrush';
import { Brush } from '@visx/brush';

import ChartOverlays from '../ChartOverlays';
import ChartTooltips from '../ChartTooltips';
import { useTooltipConfigs } from './hooks';
import {
  formatAxisTick,
  getAxisTickLabelProps,
  getLinearScale,
  getUniqueFlatChartValues
} from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartHeading, ChartWrapper } from './styles';
import { TLineChartData } from 'front/js/types';
import Legend from '../Legend';
import { TPadding } from '../types';
import ChartLine from './ChartLine';
import CustomBrush from './CustomBrush';
import { selectedAreaStyle } from './consts';
import Grid from './Grid';

export const CHART_X_PADDING = 40;
export const CHART_Y_PADDING = 30;
export const CHART_HEADING_HEIGHT = 16;
export const BRUSH_HEIGHT = 40;
export const LEGEND_HEIGHT = 16;

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
    setFilteredData(data);
  }, [data.length]);

  const xyAreaWidth = useMemo(() => {
    const clean = width - padding.left - padding.right;
    return clean > 0 ? clean : 0;
  }, [padding.left, padding.right, width]);

  const svgHeight = height - CHART_HEADING_HEIGHT - LEGEND_HEIGHT;
  const xyAreaHeight = useMemo(
    () => svgHeight - padding.top - padding.bottom - BRUSH_HEIGHT,
    [padding.bottom, padding.top, svgHeight]
  );

  // const isVertical = useMemo(() => variant === ChartVariant.vertical, [variant]);

  // const xTickWidth = useMemo(
  //   () => (isVertical ? cleanWidth / xValues.length : cleanWidth / numXAxisTicks),
  //   [cleanWidth, isVertical, numXAxisTicks, xValues.length]
  // );

  const xValues = getUniqueFlatChartValues('valueX', filteredData);
  const xBrushValues = getUniqueFlatChartValues('valueX', data);
  const yValues = getUniqueFlatChartValues('valueY', data);

  const xScale = useMemo(() => getLinearScale(xValues, [0, xyAreaWidth]), [xValues, xyAreaWidth]);
  const xBrushScale = getLinearScale(xBrushValues, [0, xyAreaWidth]);

  const yScale = getLinearScale(yValues, [xyAreaHeight, 0]);
  const yBrushScale = getLinearScale(yValues, [BRUSH_HEIGHT, 0]);

  const [selectedAreaValueX0, setSelectedAreaValueX0] = useState<number>();
  const [selectedAreaValueX1, setSelectedAreaValueX1] = useState<number>();

  const { pointTooltip, xTooltip, yTooltip, handleHover, handleMouseLeave, containerRef } =
    useTooltipConfigs(
      padding.left,
      padding.top,
      xyAreaHeight,
      variant,
      xScale,
      yScale,
      formatXScale,
      formatYScale
    );

  const selectedAreaRef = useRef<BaseBrush | null>(null);
  const selectedAreaOnBrushRef = useRef<BaseBrush | null>(null);

  const handleUpdateSelectedAreaOnBrushVisual = (x0, x1) => {
    const selectedAreaOnBrushUpdater: UpdateBrush = (prevBrush) => {
      const newExtent = selectedAreaOnBrushRef.current?.getExtent(
        { x: xBrushScale(x0) },
        { x: xBrushScale(x1) }
      );
      if (!newExtent) return prevBrush;
      const newState: BaseBrushState = {
        ...prevBrush,
        start: { y: 0, x: newExtent?.x0 },
        end: { y: 100, x: newExtent?.x1 },
        extent: newExtent
      };

      return newState;
    };
    selectedAreaOnBrushRef.current?.updateBrush(selectedAreaOnBrushUpdater);
  };

  const handleUpdateSelectedAreaVisual = () => {
    if (selectedAreaRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        if (!selectedAreaValueX0 || !selectedAreaValueX1) return prevBrush;

        const newExtent = selectedAreaRef.current?.getExtent(
          { x: xScale(selectedAreaValueX0) },
          { x: xScale(selectedAreaValueX1) }
        );
        if (!newExtent) return prevBrush;
        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: 0, x: newExtent?.x0 },
          end: { y: xyAreaHeight, x: newExtent?.x1 },
          extent: { ...newExtent, y0: 0, y1: xyAreaHeight }
        };

        return newState;
      };
      selectedAreaRef.current?.updateBrush(updater);
    }
  };

  const onSelectedAreaChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    if (x0 && x1) {
      setSelectedAreaValueX0(x0);
      setSelectedAreaValueX1(x1);
      handleUpdateSelectedAreaOnBrushVisual(x0, x1);
    }
  };

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    handleUpdateSelectedAreaVisual();
    handleUpdateSelectedAreaOnBrushVisual(selectedAreaValueX0, selectedAreaValueX1);
    const updatedData = data.map(({ datapoints, ...rest }) => ({
      ...rest,
      datapoints: datapoints.filter((s) => {
        if (!s) return;

        return !isNil(s.valueX) && !isNil(s.valueY) && s.valueX > x0 && s.valueX < x1;
      })
    }));
    setFilteredData(updatedData);
  };

  return (
    <>
      <ChartHeading>{heading}</ChartHeading>
      <ChartWrapper>
        <svg width={width} height={svgHeight} ref={containerRef}>
          <Group left={padding.left} top={padding.top} width={xyAreaWidth}>
            <Grid
              width={xyAreaWidth}
              height={xyAreaHeight}
              yScale={yScale}
              xScale={xScale}
              chartVariant={variant}
            />
            <AxisBottom
              top={xyAreaHeight}
              scale={xScale}
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
            {filteredData?.map((lineData) => (
              <ChartLine key={lineData.label} lineData={lineData} xScale={xScale} yScale={yScale} />
            ))}
          </Group>

          <clipPath id="brushAreaClip">
            <rect x="0" width={xyAreaWidth} height={xyAreaHeight} />
          </clipPath>
          <Group
            left={padding.left}
            top={padding.top}
            width={xyAreaWidth}
            overflow="hidden"
            style={{ clipPath: 'url(#brushAreaClip)' }}
          >
            <Brush
              brushDirection="horizontal"
              xScale={xScale as any}
              yScale={yScale as any}
              width={xyAreaWidth}
              height={xyAreaHeight}
              margin={{ left: padding.left, top: padding.top }}
              resizeTriggerAreas={['left', 'right']}
              onBrushEnd={onSelectedAreaChange}
              selectedBoxStyle={selectedAreaStyle}
              useWindowMoveEvents
              innerRef={selectedAreaRef}
            />
          </Group>
          <ChartOverlays
            offsetLeft={padding.left}
            offsetTop={padding.top}
            width={xyAreaWidth}
            height={xyAreaHeight}
            xScale={xScale}
            yScale={yScale}
            dataSeries={filteredData}
            onHover={handleHover}
            onMouseLeave={handleMouseLeave}
          />
          <CustomBrush
            onChange={onBrushChange}
            data={data}
            padding={padding}
            svgHeight={svgHeight}
            width={xyAreaWidth}
            xBrushScale={xBrushScale}
            yBrushScale={yBrushScale}
            selectedAreaOnBrushRef={selectedAreaOnBrushRef}
          />
        </svg>
        {data.length > 1 ? <Legend data={data} maxWidth={width} /> : null}
        <ChartTooltips
          pointTooltip={pointTooltip}
          xTooltip={xTooltip}
          yTooltip={yTooltip}
          formatXScale={formatXScale}
        />
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
    <ParentSize parentSizeStyles={{ maxWidth: width, height }}>{renderResponsiveChart}</ParentSize>
  );
}
