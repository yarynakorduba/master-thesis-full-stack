import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import BaseBrush, { BaseBrushState, UpdateBrush } from '@visx/brush/lib/BaseBrush';

export const CHART_X_PADDING = 40;
export const CHART_Y_PADDING = 30;
export const CHART_HEADING_HEIGHT = 16;
export const BRUSH_HEIGHT = 40;
export const LEGEND_HEIGHT = 16;

const GRAY = '#E1E5EA';
const selectedBrushStyle = {
  fill: 'transparent',
  stroke: 'blue',
  background: 'blue'
};

const selectedAreaStyle = {
  fill: '#ffc0cb36',
  background: 'pink',
  stroke: 'pink'
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

  const xScale = useMemo(() => getLinearScale(xValues, [0, xyAreaWidth]), [xValues, xyAreaWidth]);
  const xBrushScale = getLinearScale(xBrushValues, [0, xyAreaWidth]);
  // console.log('x scale', xScale(690676390792));

  const yScale = getLinearScale(yValues, [xyAreaHeight, 0]);
  const yBrushScale = getLinearScale(yValues, [BRUSH_HEIGHT, 0]);

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

  const [selectedAreaValueX0, setSelectedAreaValueX0] = useState<number>();
  const [selectedAreaValueX1, setSelectedAreaValueX1] = useState<number>();

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

      console.log('here!!! ---> ', x0, x1, newExtent);

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

        console.log('--newState -- > ', newState);

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
            {variant === ChartVariant.vertical ? (
              <GridRows
                scale={yScale as any}
                width={xyAreaWidth}
                height={xyAreaHeight}
                stroke={GRAY}
              />
            ) : (
              <GridColumns
                scale={xScale as any}
                width={xyAreaWidth}
                height={xyAreaHeight}
                stroke={GRAY}
              />
            )}
            <AxisBottom
              top={xyAreaHeight}
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
            width={xyAreaWidth}
            height={xyAreaHeight}
            xScale={xScale}
            yScale={yScale}
            dataSeries={filteredData}
            onHover={handleHover}
            onMouseLeave={handleMouseLeave}
          />
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

          <Group
            left={padding.left}
            top={svgHeight - BRUSH_HEIGHT}
            width={xyAreaWidth}
            overflow="hidden"
          >
            {data?.map((lineData) => renderLine(lineData, getX(xBrushScale), getY(yBrushScale)))}
            <Brush
              brushDirection="horizontal"
              xScale={xBrushScale as any}
              yScale={yBrushScale as any}
              width={xyAreaWidth}
              height={BRUSH_HEIGHT}
              margin={{ left: padding.left, top: padding.top }}
              resizeTriggerAreas={[]}
              onChange={noop}
              selectedBoxStyle={selectedAreaStyle}
              innerRef={selectedAreaOnBrushRef}
              disableDraggingOverlay
              disableDraggingSelection
            />
            <Brush
              brushDirection="horizontal"
              xScale={xBrushScale as any}
              yScale={yBrushScale as any}
              width={xyAreaWidth}
              height={BRUSH_HEIGHT}
              handleSize={8}
              margin={{ left: padding.left }}
              onChange={onBrushChange}
              selectedBoxStyle={selectedBrushStyle}
              useWindowMoveEvents
              renderBrushHandle={(props: any) => <BrushHandle {...props} x={props.x} />}
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
    <ParentSize parentSizeStyles={{ maxWidth: width, height }}>{renderResponsiveChart}</ParentSize>
  );
}
