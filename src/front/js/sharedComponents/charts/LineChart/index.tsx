import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { ParentSize } from '@visx/responsive';
import { isEmpty, isNil, map, noop, orderBy } from 'lodash';
import { Bounds } from '@visx/brush/lib/types';
import BaseBrush, {
  BaseBrushState,
  UpdateBrush,
} from '@visx/brush/lib/BaseBrush';
import grey from '@mui/material/colors/grey';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { Threshold } from '@visx/threshold';

import ChartOverlays from '../ChartOverlays';
import ChartTooltips from '../ChartTooltips';
import { useChartSizes, useTooltipConfigs } from './hooks';
import {
  formatAxisTick,
  getAxisTickLabelProps,
  getHiddenLineColor,
  getLinearScale,
  getUniqueFlatChartValues,
} from './utils';
import { ChartVariant, AxisVariant } from '../ChartOverlays/hooks';
import { ChartWrapper } from './styles';
import { TDataLabel, TLineChartData, TLineChartSerie } from '../../../types';
import Legend from '../Legend';
import {
  TChartThresholdDatapoint,
  TFormatXScale,
  TFormatYScale,
  TThresholdData,
} from '../types';
import ChartLine from './ChartLine';
import CustomBrush from './CustomBrush';
import Grid from './Grid';
import DataLabelLine from './DataLabelLine';
import { TValueBounds } from 'front/js/pages/Configuration/Analysis/types';
import { BRUSH_HEIGHT, CHART_X_PADDING, CHART_Y_PADDING } from './consts';
import { TPadding } from '../../../types/styles';

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
  readonly thresholdData?: Array<TThresholdData>;
  readonly selectedAreaBounds?: TValueBounds;
  readonly dataLabels?: TDataLabel[];
  readonly formatXScale: TFormatXScale;
  readonly formatYScale: TFormatYScale;
  readonly numXAxisTicks?: number;
  readonly numYAxisTicks?: number;
  readonly padding?: TPadding;
  readonly onClick?: () => void;
  readonly defaultBrushValueBounds?: TValueBounds;
  readonly onSelectArea?: (points) => void;
  readonly selectedDataLength?: string;
  readonly defaultIsTrainingDataSelectionOn?: boolean;
};

const LineChart = ({
  width = 2000,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
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
  selectedAreaBounds = undefined,
  onSelectArea = noop,
  selectedDataLength,
  thresholdData = [],
  defaultIsTrainingDataSelectionOn = false,
}: TProps) => {
  const { palette } = useTheme();
  const hiddenColor = getHiddenLineColor(palette);

  const [visibleLinesData, setVisibleLinesData] = useState(data);
  const [filteredData, setFilteredData] = useState(visibleLinesData);
  const [isTrainingDataSelectionOn, setIsTrainingDataSelectionOn] = useState(
    defaultIsTrainingDataSelectionOn,
  );

  useEffect(() => {
    setIsTrainingDataSelectionOn(defaultIsTrainingDataSelectionOn);
  }, [defaultIsTrainingDataSelectionOn]);

  useEffect(() => {
    setVisibleLinesData(data);
  }, [data]);

  useEffect(() => {
    setFilteredData(visibleLinesData);
  }, [visibleLinesData]);

  const { xyAreaWidth, xyAreaHeight, svgHeight } = useChartSizes(
    width,
    height,
    padding,
  );

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
  const [brushValueBounds, setBrushValueBounds] = useState<
    TValueBounds | undefined
  >();

  useEffect(() => {
    // set default values if they exist and the width & height of the graph
    // are prepared
    if (xyAreaWidth && xyAreaHeight) {
      setSelectedAreaValueBounds(selectedAreaBounds);
    }
  }, [selectedAreaBounds, xyAreaWidth, xyAreaHeight]);

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
    dataLabels,
  );

  const selectedAreaRef = useRef<BaseBrush | null>(null);
  const selectedAreaOnBrushRef = useRef<BaseBrush | null>(null);
  const brushRef = useRef<BaseBrush | null>(null);

  const handleUpdateSelectedAreaOnBrushVisual = useCallback(
    (x0, x1) => {
      const selectedAreaOnBrushUpdater: UpdateBrush = (prevBrush) => {
        const newExtent = selectedAreaOnBrushRef.current?.getExtent(
          { x: xBrushScale(x0) },
          { x: xBrushScale(x1) },
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
    [xBrushScale],
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
          },
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
      selectedAreaRef.current?.updateBrush(updater);
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
    [handleUpdateSelectedAreaOnBrushVisual, onSelectArea],
  );

  const onBrushChange = useCallback((domain: Bounds | null) => {
    if (!domain) return;
    const { x0, x1 } = domain;
    setBrushValueBounds({ x0, x1 });
  }, []);

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
    handleUpdateSelectedAreaVisual();
    handleUpdateSelectedAreaOnBrushVisual(
      selectedAreaValueBounds?.x0,
      selectedAreaValueBounds?.x1,
    );
  }, [filteredData]);

  const handleHideDataSerie = useCallback(
    (dataSerieId) => {
      const originalColor = data.find(
        (dataSerie) => dataSerie.id === dataSerieId,
      )?.color;
      const newDisplayedData = visibleLinesData.map(
        (dataSerie: TLineChartSerie): TLineChartSerie => {
          if (dataSerie.id === dataSerieId) {
            return {
              ...dataSerie,
              color:
                (dataSerie.color === hiddenColor
                  ? originalColor
                  : hiddenColor) || 'black',
            };
          }
          return dataSerie;
        },
      );
      setVisibleLinesData(newDisplayedData);
    },
    [data, visibleLinesData, hiddenColor],
  );

  const sortedDataForLines = orderBy(
    filteredData,
    (lineData) => lineData.color !== hiddenColor,
  );
  const sortedDataForBrushLines = orderBy(
    visibleLinesData,
    (lineData) => lineData.color !== hiddenColor,
  );

  useEffect(() => {
    handleUpdateSelectedAreaOnBrushVisual(
      selectedAreaValueBounds?.x0,
      selectedAreaValueBounds?.x1,
    );
  }, [
    handleUpdateSelectedAreaOnBrushVisual,
    selectedAreaValueBounds?.x0,
    selectedAreaValueBounds?.x1,
    visibleLinesData,
  ]);

  return (
    <>
      <Stack direction="row" alignItems={'center'} gap={2} sx={{ height: 38 }}>
        <Typography variant="h5" marginRight="auto" noWrap>
          {heading}
        </Typography>
        {!isTrainingDataSelectionOn && (
          <Button
            onClick={() => setIsTrainingDataSelectionOn(true)}
            style={{ width: 'fit-content', whiteSpace: 'nowrap' }}
          >
            Limit data for analysis
          </Button>
        )}
        {isTrainingDataSelectionOn && !selectedAreaValueBounds && (
          <Typography variant="body1" color={palette.text.secondary}>
            Drag&apos;n&apos;drop on the chart to set the data limits
          </Typography>
        )}
        {isTrainingDataSelectionOn &&
          selectedAreaValueBounds &&
          !isNil(selectedDataLength) && (
            <Typography
              variant="body1"
              color={palette.text.secondary}
              marginLeft="auto"
              component="div"
            >
              Selected {selectedDataLength} entries
            </Typography>
          )}
        {isTrainingDataSelectionOn && (
          <Button
            onClick={() => {
              onSelectedAreaChange(null);
              setIsTrainingDataSelectionOn(false);
            }}
            sx={{ justifySelf: 'flex-end' }}
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
              tickFormat={formatAxisTick(formatXScale)}
              tickLabelProps={getAxisTickLabelProps()}
              numTicks={numXAxisTicks}
            />
            <AxisLeft
              scale={yScale}
              stroke={grey[300]}
              tickStroke={grey[300]}
              tickFormat={formatAxisTick(formatYScale)}
              tickLabelProps={getAxisTickLabelProps(AxisVariant.left)}
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
            {thresholdData.map((dataItem) => (
              <Threshold<TChartThresholdDatapoint>
                id={dataItem.id}
                key={dataItem.id}
                clipAboveTo={0}
                clipBelowTo={xyAreaHeight}
                data={dataItem?.data}
                x={({ valueX }) => xScale(valueX)}
                y0={({ valueY0 }) => yScale(valueY0)}
                y1={({ valueY1 }) => yScale(valueY1)}
                belowAreaProps={dataItem.belowAreaProps}
                aboveAreaProps={dataItem.aboveAreaProps}
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
            thresholdData={thresholdData}
            padding={padding}
            svgHeight={svgHeight}
            width={xyAreaWidth}
            xBrushScale={xBrushScale}
            yBrushScale={yBrushScale}
            selectedAreaOnBrushRef={selectedAreaOnBrushRef}
            brushRef={brushRef}
          />
        </svg>
        {width ? (
          <Legend
            data={visibleLinesData}
            maxWidth={width}
            handleHide={handleHideDataSerie}
          />
        ) : null}
        {width ? (
          <ChartTooltips
            pointTooltip={pointTooltip}
            xTooltip={xTooltip}
            yTooltip={yTooltip}
            dataLabelTooltips={dataLabelTooltips}
            formatXScale={formatXScale}
            formatYScale={formatYScale}
          />
        ) : null}
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
  selectedAreaBounds,
  thresholdData,
  defaultIsTrainingDataSelectionOn,
}: TProps & { readonly isResponsive?: boolean }) {
  const renderChart = useCallback(
    (chartWidth, chartHeight) => (
      <LineChart
        width={chartWidth}
        height={chartHeight}
        heading={heading}
        variant={variant}
        data={data}
        selectedAreaBounds={selectedAreaBounds}
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
        thresholdData={thresholdData}
        defaultIsTrainingDataSelectionOn={defaultIsTrainingDataSelectionOn}
      />
    ),
    [
      heading,
      variant,
      data,
      selectedAreaBounds,
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
      thresholdData,
      defaultIsTrainingDataSelectionOn,
    ],
  );

  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width) && Math.min(width, parent.width);
      const responsiveHeight =
        !isNil(height) && Math.min(height, parent.height);

      return renderChart(responsiveWidth, responsiveHeight);
    },
    [renderChart, width, height],
  );

  if (!isResponsive) return renderChart(width, 400);
  return (
    <ParentSize
      parentSizeStyles={{ width: 'auto', maxWidth: '100%', minHeight: 300 }}
    >
      {renderResponsiveChart}
    </ParentSize>
  );
}
