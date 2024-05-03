import React, { useCallback, useEffect, useRef, useState } from "react";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { isEmpty, isNil, map, noop, orderBy } from "lodash";
import { Bounds } from "@visx/brush/lib/types";
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from "@visx/brush/lib/BaseBrush";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";

import ChartOverlays from "../ChartOverlays";
import ChartTooltips from "../ChartTooltips";
import { useChartSizes, useTooltipConfigs } from "./hooks";
import {
  formatAxisTick,
  getAxisTickLabelProps,
  getHiddenLineColor,
  getLinearScale,
  getUniqueFlatChartValues,
} from "./utils";
import { ChartVariant, AxisVariant } from "../ChartOverlays/hooks";
import { ChartWrapper } from "./styles";
import { TDataLabel, TLineChartData, TLineChartSerie } from "../../../types";
import Legend from "../Legend";
import { TFormatXScale, TFormatYScale, TPadding } from "../types";
import ChartLine from "./ChartLine";
import CustomBrush from "./CustomBrush";
import Grid from "./Grid";
import DataLabelLine from "./DataLabelLine";
import { grey } from "@mui/material/colors";

export const CHART_X_PADDING = 40;
export const CHART_Y_PADDING = 20;
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
  readonly selectedDataLength: number;
  readonly dataLabels?: TDataLabel[];
  readonly formatXScale: TFormatXScale;
  readonly formatYScale: TFormatYScale;
  readonly numXAxisTicks?: number;
  readonly numYAxisTicks?: number;
  readonly padding?: TPadding;
  readonly onClick?: () => void;
  readonly defaultBrushValueBounds?: TValueBounds;
  readonly onSelectArea?: (points) => void;
};

const LineChart = ({
  width = 2000,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
  selectedDataLength,
  dataLabels,
  formatXScale,
  formatYScale,
  numXAxisTicks = 4, // approximate
  numYAxisTicks = 4, // approximate
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING,
  },
  defaultBrushValueBounds = undefined,
  onSelectArea = noop,
}: TProps) => {
  const { palette } = useTheme();
  const hiddenColor = getHiddenLineColor(palette);

  const [visibleLinesData, setVisibleLinesData] = useState(data);
  const [filteredData, setFilteredData] = useState(visibleLinesData);
  const [isTrainingDataSelectionOn, setIsTrainingDataSelectionOn] =
    useState(false);

  useEffect(() => {
    setVisibleLinesData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(visibleLinesData);
  }, [visibleLinesData]);

  const { xyAreaWidth, xyAreaHeight, svgHeight } = useChartSizes(
    width,
    height,
    padding
  );

  const xValues = getUniqueFlatChartValues("valueX", filteredData);
  const xBrushValues = getUniqueFlatChartValues("valueX", visibleLinesData);
  const yValues = getUniqueFlatChartValues("valueY", visibleLinesData);

  const xScale = getLinearScale(xValues, [0, xyAreaWidth]);
  const xBrushScale = getLinearScale(xBrushValues, [0, xyAreaWidth]);
  const yScale = getLinearScale(yValues, [xyAreaHeight, 0]);
  const yBrushScale = getLinearScale(yValues, [BRUSH_HEIGHT, 0]);

  const [selectedAreaValueBounds, setSelectedAreaValueBounds] = useState<
    TValueBounds | undefined
  >();
  const [brushValueBounds, setBrushValueBounds] = useState<
    TValueBounds | undefined
  >(defaultBrushValueBounds);

  const {
    pointTooltip,
    xTooltip,
    yTooltip,
    dataLabelTooltips,
    handleHover,
    handleMouseLeave,
    containerRef,
  } = useTooltipConfigs(
    padding.left,
    padding.top,
    xyAreaHeight,
    xScale,
    yScale,
    formatXScale,
    formatYScale,
    dataLabels
  );

  const selectedAreaRef = useRef<BaseBrush | null>(null);
  const selectedAreaOnBrushRef = useRef<BaseBrush | null>(null);

  const handleUpdateSelectedAreaOnBrushVisual = useCallback(
    (x0, x1) => {
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
          extent: newExtent,
        };

        return newState;
      };
      selectedAreaOnBrushRef.current?.updateBrush(selectedAreaOnBrushUpdater);
    },
    [xBrushScale]
  );

  const handleUpdateSelectedAreaVisual = useCallback(() => {
    if (selectedAreaRef?.current) {
      const updater: UpdateBrush = (prevBrush) => {
        const newExtent = selectedAreaRef.current?.getExtent(
          {
            x: selectedAreaValueBounds?.x0
              ? xScale(selectedAreaValueBounds?.x0)
              : undefined,
          },
          {
            x: selectedAreaValueBounds?.x1
              ? xScale(selectedAreaValueBounds?.x1)
              : undefined,
          }
        );
        if (!newExtent) return prevBrush;
        const newState: BaseBrushState = {
          ...prevBrush,
          start: { y: 0, x: newExtent?.x0 },
          end: { y: xyAreaHeight, x: newExtent?.x1 },
          extent: { ...newExtent, y0: 0, y1: xyAreaHeight },
        };

        return newState;
      };
      selectedAreaRef.current.updateBrush(updater);
    }
  }, [
    selectedAreaValueBounds?.x0,
    selectedAreaValueBounds?.x1,
    xScale,
    xyAreaHeight,
  ]);

  // this is needed to remove the selected area when the selection
  // is cleared
  useEffect(() => {
    handleUpdateSelectedAreaVisual();
  }, [isEmpty(selectedAreaValueBounds)]);

  const onSelectedAreaChange = useCallback(
    (domain: Bounds | null) => {
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
    },
    [
      handleUpdateSelectedAreaOnBrushVisual,
      isTrainingDataSelectionOn,
      onSelectArea,
    ]
  );

  const onBrushChange = useCallback(
    (domain: Bounds | null) => {
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
    },
    [
      handleUpdateSelectedAreaOnBrushVisual,
      handleUpdateSelectedAreaVisual,
      isTrainingDataSelectionOn,
      selectedAreaValueBounds?.x0,
      selectedAreaValueBounds?.x1,
    ]
  );

  useEffect(() => {
    if (isNil(brushValueBounds)) setFilteredData(visibleLinesData);
    else {
      const updatedData = visibleLinesData.map(({ datapoints, ...rest }) => ({
        ...rest,
        datapoints: datapoints.filter((s) => {
          return (
            s.valueX > brushValueBounds?.x0 && s.valueX < brushValueBounds?.x1
          );
        }),
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
      const originalColor = data.find(
        (dataSerie) => dataSerie.id === dataSerieId
      )?.color;
      const newDisplayedData = visibleLinesData.map(
        (dataSerie: TLineChartSerie): TLineChartSerie => {
          if (dataSerie.id === dataSerieId) {
            return {
              ...dataSerie,
              color:
                (dataSerie.color === hiddenColor
                  ? originalColor
                  : hiddenColor) || "black",
            };
          }
          return dataSerie;
        }
      );
      setVisibleLinesData(newDisplayedData);
    },
    [data, visibleLinesData, hiddenColor]
  );

  const sortedDataForLines = orderBy(
    filteredData,
    (lineData) => lineData.color !== hiddenColor
  );
  const sortedDataForBrushLines = orderBy(
    visibleLinesData,
    (lineData) => lineData.color !== hiddenColor
  );

  useEffect(() => {
    handleUpdateSelectedAreaOnBrushVisual(
      selectedAreaValueBounds?.x0,
      selectedAreaValueBounds?.x1
    );
  }, [
    handleUpdateSelectedAreaOnBrushVisual,
    selectedAreaValueBounds?.x0,
    selectedAreaValueBounds?.x1,
    visibleLinesData,
  ]);

  return (
    <>
      <Stack
        direction="row"
        alignItems={"baseline"}
        spacing={2}
        sx={{ height: 38 }}
      >
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
          <Typography variant="body1" color={palette.text.secondary}>
            Selected {selectedDataLength} entries
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
              numTicks={numYAxisTicks}
            />
            <AxisBottom
              top={xyAreaHeight}
              scale={xScale}
              stroke={grey[300]}
              tickStroke={grey[300]}
              tickFormat={formatAxisTick(formatXScale) as any}
              tickLabelProps={getAxisTickLabelProps() as any}
              numTicks={numXAxisTicks}
            />
            <AxisLeft
              scale={yScale}
              stroke={grey[300]}
              tickStroke={grey[300]}
              tickFormat={formatAxisTick(formatYScale) as any}
              tickLabelProps={getAxisTickLabelProps(AxisVariant.left) as any}
              numTicks={numYAxisTicks}
            />
            {map(dataLabels, (dataLabel) => (
              <DataLabelLine
                key={`${dataLabel.label}-${dataLabel.valueX}`}
                lineData={dataLabel}
                height={xyAreaHeight}
                xScale={xScale}
              />
            ))}
            {sortedDataForLines.map((lineData) => (
              <ChartLine
                key={lineData.label}
                lineData={lineData}
                xScale={xScale}
                yScale={yScale}
              />
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
          />
          <CustomBrush
            onChange={onBrushChange}
            data={sortedDataForBrushLines}
            padding={padding}
            svgHeight={svgHeight}
            width={xyAreaWidth}
            xBrushScale={xBrushScale}
            yBrushScale={yBrushScale}
            selectedAreaOnBrushRef={selectedAreaOnBrushRef}
          />
        </svg>
        <Legend
          data={visibleLinesData}
          maxWidth={width}
          handleHide={handleHideDataSerie}
        />
        <ChartTooltips
          pointTooltip={pointTooltip}
          xTooltip={xTooltip}
          yTooltip={yTooltip}
          dataLabelTooltips={dataLabelTooltips}
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
  numXAxisTicks = 4, // approximate
  numYAxisTicks = 4, // approximate
  isResponsive = true,
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_X_PADDING,
    right: CHART_X_PADDING,
  },
  onClick = noop,
  onSelectArea = noop,
  defaultBrushValueBounds,
  dataLabels,
  selectedDataLength,
}: TProps & { readonly isResponsive?: boolean }) {
  const renderChart = useCallback(
    (chartWidth, chartHeight) => (
      <LineChart
        width={chartWidth}
        height={chartHeight}
        heading={heading}
        variant={variant}
        data={data}
        dataLabels={dataLabels}
        formatXScale={formatXScale}
        formatYScale={formatYScale}
        onClick={onClick}
        onSelectArea={onSelectArea}
        numXAxisTicks={numXAxisTicks} // approximate
        numYAxisTicks={numYAxisTicks}
        padding={padding}
        defaultBrushValueBounds={defaultBrushValueBounds}
        selectedDataLength={selectedDataLength}
      />
    ),
    [
      heading,
      variant,
      data,
      dataLabels,
      formatXScale,
      formatYScale,
      onClick,
      onSelectArea,
      numXAxisTicks,
      numYAxisTicks,
      padding,
      defaultBrushValueBounds,
      selectedDataLength,
    ]
  );

  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width) && Math.min(width, parent.width);
      const responsiveHeight =
        !isNil(height) && Math.min(height, parent.height);

      return renderChart(responsiveWidth, responsiveHeight);
    },
    [renderChart, width, height]
  );

  if (!isResponsive) return renderChart(width, 400);
  return (
    <ParentSize parentSizeStyles={{ width: "auto", minHeight: height }}>
      {renderResponsiveChart}
    </ParentSize>
  );
}
