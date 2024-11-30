import { LinePath } from '@visx/shape';
import { curveLinear } from '@visx/curve';

import React, { CSSProperties } from 'react';
import { getX, getY } from './utils';
import type { TLinScale } from './types';
import type { TLineChartSerie } from '../../../types';

type TProps = {
  readonly lineData: TLineChartSerie;
  readonly xScale: TLinScale;
  readonly yScale: TLinScale;
  readonly style?: CSSProperties;
};

const ChartLine = ({ lineData, xScale, yScale, style = {} }: TProps) => {
  return (
    <LinePath
      key={lineData?.id}
      data={lineData?.datapoints}
      x={getX(xScale)}
      y={getY(yScale)}
      stroke={lineData?.color}
      strokeWidth={2}
      style={style}
      curve={curveLinear}
    />
  );
};

export default ChartLine;
