import { LinePath } from '@visx/shape';
import React from 'react';
import { getX, getY } from './utils';
import { TLinScale } from './types';
import { TLineChartSerie } from '../../../types';

type TProps = {
  readonly lineData: TLineChartSerie;
  readonly xScale: TLinScale;
  readonly yScale: TLinScale;
};

const ChartLine = ({ lineData, xScale, yScale }: TProps) => {
  return (
    <LinePath
      key={lineData?.id}
      data={lineData?.datapoints}
      x={getX(xScale)}
      y={getY(yScale)}
      stroke={lineData?.color}
      strokeWidth={2}
    />
  );
};

export default ChartLine;
