import { localPoint } from '@visx/event';
import { isNil, minBy, pickBy, values } from 'lodash';
import { useState, useCallback, useEffect } from 'react';
import { TClosestChartPointGroups, TLinScale } from '../LineChart/types';
import { TLineChartSerie } from 'front/js/types';

export enum ChartVariant {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export enum AxisVariant {
  left = 'left',
  bottom = 'bottom',
  right = 'right',
}

export type TSeries = {
  readonly datapoints: Array<{
    readonly valueY: number;
    readonly valueX: number;
  }>;
  readonly color: string;
};

export const getClosestCoordinate = (scale, point) => {
  const scaleValue = Math.round(scale.invert(point));
  const valueCoordinate = scale(scaleValue);
  const bandMidCoordinate = valueCoordinate ? valueCoordinate : 0;
  return [scaleValue, bandMidCoordinate];
};

export function useClosestPoints(
  event: MouseEvent | undefined,
  xScale: TLinScale,
  yScale: TLinScale,
  series: TLineChartSerie[] = [],
  xPadding: number = 15,
): TClosestChartPointGroups | undefined {
  const [closestPoints, setClosestPoints] =
    useState<TClosestChartPointGroups>();

  const addPoint = useCallback(
    (
      accum: TClosestChartPointGroups,
      color,
      data,
      x,
      y,
      valueX,
    ): TClosestChartPointGroups => {
      const pointGroupId = `${x}-${y}`;
      const pointGroup = accum[pointGroupId] ?? { x, y };
      const points = pointGroup?.points ?? [];
      const point = { color, data };
      return {
        ...accum,
        [pointGroupId]: {
          ...pointGroup,
          valueX,
          points: [...points, point],
        },
      };
    },
    [],
  );

  const handleSetPoints = useCallback(() => {
    if (!event || !event.target || !xScale || !yScale) {
      return;
    }

    const targetName = (event?.target as HTMLElement)?.localName;
    if (targetName !== 'path' && targetName !== 'rect') return;

    const { x } = localPoint(event) || { x: 0, y: 0 };
    const [pointerXValue] = getClosestCoordinate(xScale, x - xPadding);
    const findClosest = (prev, curr) => {
      return !prev ||
        Math.abs(curr.valueX - pointerXValue) <
          Math.abs(prev.valueX - pointerXValue)
        ? curr
        : prev;
    };

    const points = series.reduce(
      (
        accum: TClosestChartPointGroups,
        serie: TLineChartSerie,
      ): TClosestChartPointGroups => {
        const { datapoints = [], color } = serie;
        const data = datapoints.reduce(findClosest, undefined);
        if (isNil(data)) return accum;
        const yVal = data?.valueY;
        const xVal = data?.valueX;
        const yCoordinate = yScale(yVal);
        const xCoordinate = xScale(xVal);
        if (isNil(yCoordinate)) return accum;
        return addPoint(accum, color, data, xCoordinate, yCoordinate, xVal);
      },
      {},
    );

    const minPointByDistance = minBy(values(points), (pointGroup) => {
      return Math.abs(pointerXValue - pointGroup?.valueX);
    });

    const filteredPoints = minPointByDistance
      ? pickBy(points, (pointGroup) => {
          return (
            Math.abs(pointerXValue - minPointByDistance?.valueX) ===
            Math.abs(pointerXValue - pointGroup?.valueX)
          );
        })
      : points;

    setClosestPoints(filteredPoints);
  }, [addPoint, event, series, xPadding, xScale, yScale]);

  useEffect(() => {
    handleSetPoints();
  }, [handleSetPoints]);

  return closestPoints;
}
