import React, { useCallback, useState, useMemo, Fragment } from 'react';
import { Group } from '@visx/group';
import { Line, Bar } from '@visx/shape';
import { localPoint } from '@visx/event';
import { noop, map } from 'lodash';
import { useTheme } from '@mui/material/styles';
import { Brush } from '@visx/brush';
import { Bounds } from '@visx/brush/lib/types';

import { useClosestPoints } from './hooks';
import { TClosestChartPointGroup, TLinScale } from '../LineChart/types';
import { TLineChartData, TLineChartDatapoint } from 'front/js/types';
import zIndex from '@mui/material/styles/zIndex';

type TProps = {
  readonly xScale: TLinScale;
  readonly yScale: TLinScale;
  readonly offsetTop?: number;
  readonly offsetLeft?: number;

  readonly onClick?: (datum: TLineChartDatapoint) => void;
  readonly onHover?: (
    event: MouseEvent,
    datum?: TClosestChartPointGroup,
  ) => void;
  readonly onMouseLeave?: (
    event: MouseEvent,
    datum?: TClosestChartPointGroup,
  ) => void;

  readonly dataSeries: TLineChartData;
  readonly height: number;
  readonly width: number;

  readonly isAreaSelectionOn?: boolean;
  readonly onSelectedAreaChange?: (bounds: Bounds | null) => void;
};

function ChartOverlays(
  {
    height,
    width,
    xScale,
    yScale,
    dataSeries,
    offsetLeft = 0,
    offsetTop = 0,
    onHover = noop,
    onMouseLeave = noop,
    onSelectedAreaChange = noop,
    isAreaSelectionOn = false,
  }: TProps,
  selectedAreaRef,
) {
  const { palette } = useTheme();
  const selectedAreaStyle = { fill: palette.charts.chartOverlaySelectedArea };

  const [mouseEvent, setMouseEvent] = useState();
  const [pointerCoords, setPointerCoords] = useState<{
    readonly x: number | undefined;
    readonly y: number | undefined;
  }>();
  const isLocationDefined = useMemo(
    () => (pointerCoords?.y ?? false) && (pointerCoords?.x ?? false),
    [pointerCoords?.x, pointerCoords?.y],
  );

  const closestPoints = useClosestPoints(
    mouseEvent,
    xScale,
    yScale,
    dataSeries,
    offsetLeft,
  );
  const handleHover = useCallback(
    (pointGroup?: TClosestChartPointGroup) => (event) => {
      if (pointGroup) {
        event.stopPropagation();
      }
      const { x, y } = localPoint(event.target, event) || {
        x: undefined,
        y: undefined,
      };

      setPointerCoords({
        x: x ? x - offsetLeft : 0,
        y: y ? y - offsetTop : 0,
      });

      setMouseEvent(event);
      onHover(event, pointGroup);
    },
    [onHover, offsetLeft, offsetTop],
  );

  const handleMouseLeave = useCallback(
    (pointGroup?: TClosestChartPointGroup) => (event) => {
      if (!pointGroup) {
        setPointerCoords({
          x: undefined,
          y: undefined,
        });
      }
      setMouseEvent(event);
      onMouseLeave(event, pointGroup);
    },
    [onMouseLeave],
  );

  const [isBrushing, setIsBrushing] = useState(false);
  const handleBrushStart = () => {
    if (!isAreaSelectionOn) return;
    setIsBrushing(true);
  };
  const handleBrushEnd = (args) => {
    if (!isAreaSelectionOn) return;
    setIsBrushing(false);
    onSelectedAreaChange(args);
  };

  const renderDataPointIndicators = useCallback(
    () =>
      map(closestPoints, (pointGroup) => {
        if (!pointGroup) return null;
        const { points, x: pX, y: pY } = pointGroup;
        const lastPointColor = points?.[points?.length - 1]?.color;
        const hover = handleHover(pointGroup);
        const leave = handleMouseLeave(pointGroup);
        return (
          <Fragment key={`c1-${pX}-${pY}`}>
            <circle
              cx={pX}
              cy={pY}
              r={7.5}
              pointerEvents="all"
              onMouseEnter={hover}
              onMouseMove={hover}
              onMouseLeave={leave}
              fill={'gray'}
            />
            <circle
              key={`c2-${pX}-${pY}`}
              cx={pX}
              cy={pY}
              r={6.5}
              pointerEvents="all"
              onMouseEnter={hover}
              onMouseMove={hover}
              onMouseLeave={leave}
              fill={'white'}
            />
            <circle
              key={`c3-${pX}-${pY}`}
              cx={pX}
              cy={pY}
              r={4.5}
              pointerEvents="all"
              onMouseEnter={hover}
              onMouseMove={hover}
              onMouseLeave={leave}
              fill={lastPointColor}
            />
          </Fragment>
        );
      }),
    [closestPoints, handleHover, handleMouseLeave],
  );

  return (
    <Group
      width={width}
      height={height}
      top={offsetTop}
      left={offsetLeft}
      onMouseMove={handleHover()}
      onMouseLeave={handleMouseLeave()}
    >
      <Bar
        width={width}
        height={height}
        fill="transparent"
        pointerEvents={isBrushing ? 'none' : 'all'}
      />
      {isLocationDefined && !isBrushing && (
        <Group pointerEvents="none">
          <Line
            from={{ x: pointerCoords?.x, y: 0 }}
            to={{ x: pointerCoords?.x, y: height }}
            stroke={palette.secondary.dark}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="3,6"
          />
          <Line
            from={{ x: 0, y: pointerCoords?.y }}
            to={{ x: width, y: pointerCoords?.y }}
            stroke={palette.secondary.dark}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="3,6"
          />
        </Group>
      )}
      <clipPath id="brushAreaClip">
        <rect x="0" width={width} height={height} />
      </clipPath>
      <Group style={{ clipPath: 'url(#brushAreaClip)', zIndex: 100000000 }}>
        <Brush
          brushDirection="horizontal"
          xScale={xScale}
          yScale={yScale}
          width={width}
          height={height}
          margin={{ left: offsetLeft, top: offsetTop }}
          onBrushEnd={handleBrushEnd}
          onBrushStart={handleBrushStart}
          innerRef={selectedAreaRef}
          selectedBoxStyle={selectedAreaStyle}
          disableDraggingSelection={!isAreaSelectionOn}
          disableDraggingOverlay={!isAreaSelectionOn}
          useWindowMoveEvents={false}
          resizeTriggerAreas={isAreaSelectionOn ? ['left', 'right'] : []}
        />
      </Group>
      {isLocationDefined && !isBrushing && renderDataPointIndicators()}
    </Group>
  );
}

export default React.forwardRef(ChartOverlays);
