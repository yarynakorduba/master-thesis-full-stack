import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { Group } from '@visx/group';
import { isEmpty, isEqual, isNil, map, max, min, noop, orderBy } from 'lodash';
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
import { Skeleton } from '@mui/material';

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
import type { TLineChartSerie } from '../../../types';
import Legend from './Legend';
import type { TChartThresholdDatapoint } from '../types';
import ChartLine from './ChartLine';
import CustomBrush from './CustomBrush';
import Grid from './Grid';
import DataLabelLine from './DataLabelLine';
import type { TValueBounds } from 'front/js/pages/Configuration/Analysis/types';
import {
  BRUSH_HEIGHT,
  CHART_LEFT_PADDING,
  CHART_RIGHT_PADDING,
  CHART_Y_PADDING,
} from './consts';
import type { TLineChartProps } from './types';
import LineChartDataRegions from './LineChartDataRegions';

/**
 * Line chart has two axes: one of them uses linear scale, and another uses band scale.
 * The vertical (default) variant renders vertical bars with band x-axis and linear y-axis.
 * The horizontal variant renders horizontal bars with linear x-axis and band y-axis.
 */

const LineChart = ({
  width = 2000,
  height = 460,
  heading,
  variant = ChartVariant.vertical,
  data,
  dataRegions = [],
  dataLabels,
  formatXScale,
  formatYScale,
  numXAxisTicks = 4, // approximate
  numYAxisTicks = 4, // approximate
  padding = {
    top: CHART_Y_PADDING,
    bottom: CHART_Y_PADDING,
    left: CHART_LEFT_PADDING,
    right: CHART_RIGHT_PADDING,
  },
  defaultBrushValueBounds = undefined,
  selectedAreaBounds = undefined,
  onSelectArea = noop,
  selectedDataLength,
  thresholdData = [],
  defaultIsTrainingDataSelectionOn = false,
}: TLineChartProps) => {
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
    if (!isEqual(data, visibleLinesData)) {
      setVisibleLinesData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!isEqual(filteredData, visibleLinesData)) {
      setFilteredData(visibleLinesData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleLinesData]);

  const { xyAreaWidth, xyAreaHeight, svgHeight, chartLinesOffset } =
    useChartSizes(width, height, padding);

  const xValues = getUniqueFlatChartValues('valueX', filteredData);
  const xBrushValues = getUniqueFlatChartValues('valueX', visibleLinesData);
  const yValues = getUniqueFlatChartValues('valueY', visibleLinesData);

  const brushExtent: [number, number] | undefined = useMemo(
    () =>
      xBrushValues.length
        ? [min(xBrushValues) || 0, max(xBrushValues) || 0]
        : undefined,
    [xBrushValues],
  );
  const filteredValuesExtent: [number, number] | undefined = useMemo(
    () => (xValues.length ? [min(xValues) || 0, max(xValues) || 0] : undefined),
    [xValues],
  );

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
    if (
      xyAreaWidth &&
      xyAreaHeight &&
      !isEqual(selectedAreaBounds, selectedAreaValueBounds)
    ) {
      setSelectedAreaValueBounds(selectedAreaBounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    chartLinesOffset.top,
    xyAreaHeight,
    xScale,
    yScale,
    formatXScale(brushExtent),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  if (svgHeight <= 0) return <Skeleton height={height} />;
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
          {!isEmpty(dataRegions) && (
            <LineChartDataRegions
              xScale={xScale}
              dataRegions={dataRegions}
              paddingLeft={padding.left}
              maxX={width - padding.right - padding.left}
            />
          )}
          <Group
            left={padding.left}
            top={chartLinesOffset.top}
            width={xyAreaWidth}
            height={xyAreaHeight}
          >
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
              tickFormat={formatAxisTick(formatXScale(filteredValuesExtent))}
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
            offsetTop={chartLinesOffset.top}
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
            formatPointTooltipXScale={formatXScale()}
            formatPointTooltipYScale={formatYScale}
          />
        ) : null}
      </ChartWrapper>
    </>
  );
};

export default LineChart;
