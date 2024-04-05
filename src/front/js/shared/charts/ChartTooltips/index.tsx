import React from 'react';
import { defaultStyles } from '@visx/tooltip';
import { useTheme } from '@mui/material/styles';

import AxisTooltip from './AxisTooltip';
import PointTooltip from './PointTooltip';
import { map } from 'lodash';

const sharedStyles = {
  ...defaultStyles,
  minWidth: '2rem',
  fontSize: '0.75rem',
  pointerEvents: 'none'
};

const pointTooltipStyles = {
  ...sharedStyles,
  maxWidth: '20rem',
  textAlign: 'center',
  pointerEvents: 'none'
};

export const xAxisTooltipStyles = {
  ...sharedStyles,
  minWidth: '2rem',
  maxWidth: '7rem',
  textAlign: 'center',
  color: 'white',
  transform: 'translate(calc(-50% - 0.6rem), -0.5rem)'
};

const yAxisTooltipStyles = {
  ...sharedStyles,
  minWidth: '2rem',
  maxWidth: '7rem',
  width: 'fit-content',
  textAlign: 'center',
  color: 'white',
  transform: 'translate(calc(-100% - 0.75rem), calc(-50% - 0.6rem))'
};

type TChartTooltipProps = {
  readonly pointTooltip: any;
  readonly xTooltip: number;
  readonly yTooltip: number;
  readonly dataLabelTooltips: any[];
} & any;
export default function ChartTooltips({
  pointTooltip,
  xTooltip,
  yTooltip,
  formatXScale,
  dataLabelTooltips
}: TChartTooltipProps) {
  const { palette } = useTheme();

  return (
    <>
      <AxisTooltip
        tooltip={xTooltip}
        styles={{ ...xAxisTooltipStyles, background: palette.secondary.dark }}
      />
      <AxisTooltip
        tooltip={yTooltip}
        styles={{ ...yAxisTooltipStyles, background: palette.secondary.dark }}
      />
      {map(dataLabelTooltips, (tooltip) => (
        <AxisTooltip // data label tooltip
          tooltip={tooltip}
          styles={{
            ...xAxisTooltipStyles,
            background: 'red',
            top: 0,
            transform: 'translate(calc(-50% - 0.6rem), -50%)'
          }}
        />
      ))}
      <PointTooltip
        tooltip={pointTooltip}
        styles={pointTooltipStyles}
        formatXScale={formatXScale}
      />
    </>
  );
}
