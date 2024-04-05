import React from 'react';
import { Line } from '@visx/shape';
import { useTheme } from '@mui/material/styles';

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
      strokeDasharray="2,2"
    />
  );
};

export default DataLabel;
