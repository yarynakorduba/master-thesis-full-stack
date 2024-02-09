import { localPoint } from '@visx/event';
import { isNil } from 'lodash';
import { useState, useCallback, useEffect } from 'react';

export enum ChartVariant {
  vertical = 'vertical',
  horizontal = 'horizontal'
}

export enum AxisVariant {
  left = 'left',
  bottom = 'bottom',
  right = 'right'
}

export type TSeries = {
  readonly datapoints: Array<{ readonly valueY: number; readonly valueX: number }>;
  readonly color: string;
};

export const getClosestCoordinate = (scale, point) => {
  const scaleValue = Math.round(scale.invert(point));
  const valueCoordinate = scale(scaleValue);
  const bandMidCoordinate = valueCoordinate ? valueCoordinate : 0;
  return [scaleValue, bandMidCoordinate];
};

export function useClosestPoints(event, xScale, yScale, series: TSeries[] = [], xPadding = 15) {
  const [closestPoints, setClosestPoints] = useState();

  const addPoint = useCallback((accum = [], color, data, x, y) => {
    const pointGroupId = `${x}-${y}`;
    const pointGroup = accum[pointGroupId] ?? { x, y };
    const points = pointGroup?.points ?? [];
    const point = {
      color,
      data
    };
    return {
      ...accum,
      [pointGroupId]: {
        ...pointGroup,
        points: [...points, point]
      }
    };
  }, []);

  const handleSetPoints = useCallback(() => {
    if (!event || !event.target || !xScale || !yScale) {
      setClosestPoints(undefined);
      return;
    }

    const targetName = event?.target?.localName;
    if (targetName !== 'path' && targetName !== 'rect') return;

    const { y, x } = localPoint(event) || { x: 0, y: 0 };
    let points;

    const [xValue, xCoordinate] = getClosestCoordinate(xScale, x - xPadding);

    // Find all the corresponding linear coord based on band coord
    points = series.reduce((accum, serie) => {
      const { datapoints = [], color } = serie;
      const data = datapoints.find((datum) => datum.valueX === xValue);
      if (isNil(data)) return accum;

      const yVal = data?.valueY;
      const yCoordinate = yScale(yVal);
      if (isNil(yCoordinate)) return accum;
      return addPoint(accum, color, data, xCoordinate, yCoordinate);
    }, []);

    setClosestPoints(points);
  }, [addPoint, event, series, xPadding, xScale, yScale]);

  useEffect(() => {
    handleSetPoints();
  }, [handleSetPoints]);

  return closestPoints;
}
