import { LinePath } from '@visx/shape';
import React from 'react';
import { getX, getY } from './utils';

type TProps = {
  readonly lineData;
} & any;

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
