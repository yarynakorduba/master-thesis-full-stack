import React from 'react';
import { Line } from '@visx/shape';
import { useTheme } from '@mui/material/styles';
import { getX, getY } from './utils';
import AxisTooltip from '../ChartTooltips/AxisTooltip';
import { xAxisTooltipStyles } from '../ChartTooltips';
import { useTooltipInPortal } from '@visx/tooltip';

type TProps = {} & any;
const DataLabel = ({ lineData, xScale, height }: TProps) => {
  const { palette } = useTheme();
  const strokeColor = palette.grey['400'];

  const x = xScale(lineData?.valueX);

  return (
    <Line
      from={{ x, y: 0 }}
      to={{ x, y: height }}
      stroke={strokeColor}
      strokeWidth={1}
      pointerEvents="none"
      strokeDasharray="4,6"
    />
  );
};

export default DataLabel;
