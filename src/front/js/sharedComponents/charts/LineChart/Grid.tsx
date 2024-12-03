import { GridRows, GridColumns } from '@visx/grid';
import React from 'react';
import { ChartVariant } from '../ChartOverlays/hooks';
import type { TLinScale } from './types';

type TProps = {
  readonly xScale: TLinScale;
  readonly yScale: TLinScale;
  readonly width: number;
  readonly height: number;
  readonly chartVariant: ChartVariant;
  readonly numTicks: number;
};

const GRAY = '#E1E5EA';

const Grid = ({
  chartVariant,
  xScale,
  yScale,
  width,
  height,
  numTicks = 4,
}: TProps) => {
  return chartVariant === ChartVariant.vertical ? (
    <GridRows
      scale={yScale}
      width={width}
      height={height}
      stroke={GRAY}
      numTicks={numTicks}
    />
  ) : (
    <GridColumns
      scale={xScale}
      width={width}
      height={height}
      stroke={GRAY}
      numTicks={numTicks}
    />
  );
};

export default Grid;
