import React, { useCallback, useState, useMemo } from 'react';
import { Group } from '@visx/group';
import { Line, Bar } from '@visx/shape';
import { localPoint } from '@visx/event';
import { noop, map } from 'lodash';

import { useClosestPoints } from './hooks';

export default function ChartOverlays({
  height,
  width,
  xScale,
  yScale,
  dataSeries,
  offsetLeft = 0,
  offsetTop = 0,
  onHover = noop,
  onMouseLeave = noop
}) {
  const [mouseEvent, setMouseEvent] = useState();
  const [pointerCoords, setPointerCoords] = useState<{
    readonly x: number | undefined;
    readonly y: number | undefined;
  }>();
  const isLocationDefined = useMemo(
    () => (pointerCoords?.y ?? false) && (pointerCoords?.x ?? false),
    [pointerCoords?.x, pointerCoords?.y]
  );

  const closestPoints = useClosestPoints(mouseEvent, xScale, yScale, dataSeries, offsetLeft);
  const handleHover = useCallback(
    (pointGroup) => (event) => {
      const { x, y } = localPoint(event.target, event) || {
        x: undefined,
        y: undefined
      };
      setPointerCoords({
        x: x ? x - offsetLeft : 0,
        y: y ? y - offsetTop : 0
      });

      setMouseEvent(event);
      onHover(event, pointGroup);
    },
    [onHover, offsetLeft, offsetTop]
  );

  const handleMouseLeave = useCallback(
    (pointGroup) => (event) => {
      if (!pointGroup) {
        setPointerCoords({
          x: undefined,
          y: undefined
        });
      }
      setMouseEvent(event);
      onMouseLeave(event, pointGroup);
    },
    [onMouseLeave]
  );

  const renderDataPointIndicators = useCallback(
    () =>
      map(closestPoints, (pointGroup) => {
        if (!pointGroup) return null;
        const { points, x: pX, y: pY } = pointGroup as any;
        const lastPointColor = points?.[points?.length - 1]?.color;
        const hover = handleHover(pointGroup);
        const leave = handleMouseLeave(pointGroup);
        return (
          <>
            <circle
              key={`c1-${pX}-${pY}`}
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
          </>
        );
      }),
    [closestPoints, handleHover, handleMouseLeave]
  );

  return (
    <Group width={width} height={height} top={offsetTop} left={offsetLeft}>
      <Bar
        width={width}
        height={height}
        fill="transparent"
        // onMouseMove={handleHover()}
        // onMouseLeave={handleMouseLeave()}
        pointerEvents="all"
      />
      {isLocationDefined && (
        <Group pointerEvents="none">
          <Line
            from={{ x: pointerCoords?.x, y: 0 }}
            to={{ x: pointerCoords?.x, y: height }}
            stroke={'red'}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="3,6"
          />
          <Line
            from={{ x: 0, y: pointerCoords?.y }}
            to={{ x: width, y: pointerCoords?.y }}
            stroke={'red'}
            strokeWidth={1}
            pointerEvents="none"
            strokeDasharray="3,6"
          />
          {renderDataPointIndicators()}
        </Group>
      )}
    </Group>
  );
}
