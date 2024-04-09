import React from 'react';
import { defaultStyles } from '@visx/tooltip';
import { useTheme } from '@mui/material/styles';
import { map } from 'lodash';

import AxisTooltip from './AxisTooltip';
import PointTooltip from './PointTooltip';
import { TFormatXScale } from '../types';
import { TAxisTooltip, TPointTooltip } from './types';

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
  maxWidth: '7rem',
  textAlign: 'center',
  color: 'white',
  transform: 'translate(calc(-50% - 0.6rem), -0.5rem)'
};

export const dataLabelTooltipStyles = {
  ...sharedStyles,
  maxWidth: '40rem',
  textAlign: 'center',
  color: 'white',
  width: 'fit-content',
  whiteSpace: 'pre-wrap',
  // display: 'inline-block',
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

type TProps = {
  readonly pointTooltip?: TPointTooltip;
  readonly xTooltip?: TAxisTooltip;
  readonly yTooltip?: TAxisTooltip;
  readonly dataLabelTooltips: TAxisTooltip[];
  readonly formatXScale: TFormatXScale;
};

export default function ChartTooltips({
  pointTooltip,
  xTooltip,
  yTooltip,
  formatXScale,
  dataLabelTooltips
}: TProps) {
  const { palette } = useTheme();

  return (
    <>
      {xTooltip && (
        <AxisTooltip
          tooltip={xTooltip}
          styles={{ ...xAxisTooltipStyles, background: palette.secondary.dark }}
        />
      )}
      {yTooltip && (
        <AxisTooltip
          tooltip={yTooltip}
          styles={{ ...yAxisTooltipStyles, background: palette.secondary.dark }}
        />
      )}
      {map(dataLabelTooltips, (tooltip) => (
        <AxisTooltip // data label tooltip
          key={tooltip.tooltipData}
          tooltip={tooltip}
          styles={{
            ...dataLabelTooltipStyles,
            background: palette.secondary.main,
            top: 0,
            transform: 'translate(calc(-50% - 0.6rem), -50%)'
          }}
        />
      ))}
      {pointTooltip && (
        <PointTooltip
          tooltip={pointTooltip}
          styles={pointTooltipStyles}
          formatXScale={formatXScale}
        />
      )}
    </>
  );
}
