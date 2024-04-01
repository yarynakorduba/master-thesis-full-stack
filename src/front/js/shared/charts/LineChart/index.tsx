import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { isNil, noop, orderBy } from 'lodash';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush, { BaseBrushState, UpdateBrush } from '@visx/brush/lib/BaseBrush';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';

import ChartOverlays from '../ChartOverlays';
import ChartTooltips from '../ChartTooltips';
import { useChartSizes, useTooltipConfigs } from './hooks';
import {
  formatAxisTick,
  getAxisTickLabelProps,
  getLinearScale,
  getUniqueFlatChartValues
} from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartWrapper } from './styles';
import { TLineChartData } from 'front/js/types';
import Legend from '../Legend';
import { TPadding } from '../types';
import ChartLine from './ChartLine';
import CustomBrush from './CustomBrush';
import Grid from './Grid';

export const CHART_X_PADDING = 40;
export const CHART_Y_PADDING = 0;
export const CHART_HEADING_HEIGHT = 36;
export const BRUSH_HEIGHT = 40;
export const LEGEND_HEIGHT = 16;

/**
 * Line chart has two axes: one of them uses linear scale, and another uses band scale.
 * The vertical (default) variant renders vertical bars with band x-axis and linear y-axis.
 * The horizontal variant renders horizontal bars with linear x-axis and band y-axis.
 */

type TValueBounds = {
  readonly x0: number;
  readonly x1: number;
};

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
  readonly defaultBrushValueBounds?: TValueBounds;
  readonly onSelectArea?: (datapoints: any) => void;
};

const LineChart = ({
  width = 2000,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
  formatXScale,
  formatYScale,
  numXAxisTicks = 5, // approximate
  numYAxisTicks = 5, // approximate
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING
  },
  defaultBrushValueBounds = undefined,
  onSelectArea = noop
}: TProps) => {
  const { palette } = useTheme();
  const hiddenColor = palette.grey[300];
  console.log('AAA --!!!-- > ', data, hiddenColor);

  const [visibleLinesData, setVisibleLinesData] = useState(data);
  const [filteredData, setFilteredData] = useState(visibleLinesData);
  const [isTrainingDataSelectionOn, setIsTrainingDataSelectionOn] = useState(false);

  useEffect(() => {
    setVisibleLinesData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(visibleLinesData);
  }, [visibleLinesData]);

  const { xyAreaWidth, xyAreaHeight, svgHeight } = useChartSizes(width, height, padding);

  const xValues = getUniqueFlatChartValues('valueX', filteredData);
  const xBrushValues = getUniqueFlatChartValues('valueX', visibleLinesData);
  const yValues = getUniqueFlatChartValues('valueY', visibleLinesData);

  const xScale = getLinearScale(xValues, [0, xyAreaWidth]);
  const xBrushScale = getLinearScale(xBrushValues, [0, xyAreaWidth]);
  const yScale = getLinearScale(yValues, [xyAreaHeight, 0]);
  const yBrushScale = getLinearScale(yValues, [BRUSH_HEIGHT, 0]);

  const [selectedAreaValueBounds, setSelectedAreaValueBounds] = useState<
    TValueBounds | undefined
  >();
  const [brushValueBounds, setBrushValueBounds] = useState<TValueBounds | undefined>(
    defaultBrushValueBounds
  );

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
        const newExtent = selectedAreaRef.current?.getExtent(
          { x: selectedAreaValueBounds?.x0 ? xScale(selectedAreaValueBounds?.x0) : undefined },
          { x: selectedAreaValueBounds?.x1 ? xScale(selectedAreaValueBounds?.x1) : undefined }
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
      selectedAreaRef.current.updateBrush(updater);
    }
  };

  // this is needed to remove the selected area when the selection
  // is cleared
  useEffect(() => {
    handleUpdateSelectedAreaVisual();
  }, [selectedAreaValueBounds]);

  const onSelectedAreaChange = (domain: Bounds | null) => {
    if (!isTrainingDataSelectionOn) return;
    if (!domain) {
      setSelectedAreaValueBounds(undefined);
      handleUpdateSelectedAreaOnBrushVisual(undefined, undefined);
      onSelectArea(undefined);

      return;
    }
    const { x0, x1 } = domain;
    if (x0 && x1) {
      setSelectedAreaValueBounds({ x0, x1 });
      handleUpdateSelectedAreaOnBrushVisual(x0, x1);
      onSelectArea({ x0, x1 });
    }
  };

  const onBrushChange = (domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    setBrushValueBounds({ x0, x1 });
    if (isTrainingDataSelectionOn) {
      handleUpdateSelectedAreaVisual();
      handleUpdateSelectedAreaOnBrushVisual(
        selectedAreaValueBounds?.x0,
        selectedAreaValueBounds?.x1
      );
    }
  };

  useEffect(() => {
    if (isNil(brushValueBounds)) setFilteredData(visibleLinesData);
    else {
      const updatedData = visibleLinesData.map(({ datapoints, ...rest }) => ({
        ...rest,
        datapoints: datapoints.filter((s) => {
          return s.valueX > brushValueBounds?.x0 && s.valueX < brushValueBounds?.x1;
        })
      }));
      setFilteredData(updatedData);
    }
  }, [brushValueBounds, visibleLinesData]);

  useEffect(() => {
    setBrushValueBounds(defaultBrushValueBounds);
  }, [defaultBrushValueBounds]);

  useEffect(() => {
    if (isTrainingDataSelectionOn) handleUpdateSelectedAreaVisual();
  }, [isTrainingDataSelectionOn, filteredData]);

  const handleHideDataSerie = useCallback(
    (dataSerieId) => {
      const originalColor = data.find((dataSerie) => dataSerie.id === dataSerieId)?.color;
      const newDisplayedData = visibleLinesData.map((dataSerie) => {
        if (dataSerie.id === dataSerieId) {
          return {
            ...dataSerie,
            color: dataSerie.color === hiddenColor ? originalColor : hiddenColor
          };
        }
        return dataSerie;
      });
      setVisibleLinesData(newDisplayedData as any);
    },
    [data, visibleLinesData, hiddenColor]
  );

  const sortedDataForLines = orderBy(filteredData, (lineData) => lineData.color !== hiddenColor);

  return (
    <>
      <Stack direction="row" alignItems={'baseline'} spacing={2} sx={{ height: 38 }}>
        <Typography variant="h5">{heading} </Typography>
        {!isTrainingDataSelectionOn && (
          <Button onClick={() => setIsTrainingDataSelectionOn(true)}>
            Limit data for prediction
          </Button>
        )}
        {isTrainingDataSelectionOn && !selectedAreaValueBounds && (
          <Typography variant="body1" color={palette.text.secondary}>
            Drag&apos;n&apos;drop on the chart to set the data limits
          </Typography>
        )}
        {isTrainingDataSelectionOn && selectedAreaValueBounds && (
          <Button
            onClick={() => {
              onSelectedAreaChange(null);
              setIsTrainingDataSelectionOn(false);
            }}
          >
            Cancel selection
          </Button>
        )}
      </Stack>
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
              scale={yScale}
              hideTicks
              hideAxisLine
              tickFormat={formatAxisTick(formatYScale)}
              tickLabelProps={getAxisTickLabelProps(AxisVariant.left) as any}
              numTicks={numYAxisTicks}
            />
            {sortedDataForLines.map((lineData) => (
              <ChartLine key={lineData.label} lineData={lineData} xScale={xScale} yScale={yScale} />
            ))}
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
            ref={selectedAreaRef}
            onSelectedAreaChange={onSelectedAreaChange}
            isAreaSelectionOn={isTrainingDataSelectionOn}
            selectedAreaRef={selectedAreaRef}
          />

          <CustomBrush
            onChange={onBrushChange}
            data={sortedDataForLines}
            padding={padding}
            svgHeight={svgHeight}
            width={xyAreaWidth}
            xBrushScale={xBrushScale}
            yBrushScale={yBrushScale}
            selectedAreaOnBrushRef={selectedAreaOnBrushRef}
          />
        </svg>
        {visibleLinesData.length > 1 ? (
          <Legend data={visibleLinesData} maxWidth={width} handleHide={handleHideDataSerie} />
        ) : null}
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
  numXAxisTicks = 5, // approximate
  numYAxisTicks = 5, // approximate
  isResponsive = true,
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING
  },
  onClick = noop,
  onSelectArea = noop,
  defaultBrushValueBounds
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
        onSelectArea={onSelectArea}
        numXAxisTicks={numXAxisTicks} // approximate
        numYAxisTicks={numYAxisTicks}
        padding={padding}
        defaultBrushValueBounds={defaultBrushValueBounds}
      />
    ),
    [
      heading,
      variant,
      data,
      formatXScale,
      formatYScale,
      onClick,
      onSelectArea,
      numXAxisTicks,
      numYAxisTicks,
      padding,
      defaultBrushValueBounds
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
    <ParentSize parentSizeStyles={{ width: 'auto', height }}>{renderResponsiveChart}</ParentSize>
  );
}
