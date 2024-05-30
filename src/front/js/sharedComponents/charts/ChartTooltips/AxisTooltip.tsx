import { Tooltip } from '@visx/tooltip';
import { isNil } from 'lodash';
import React from 'react';
import { TAxisTooltip } from './types';

type TProps = {
  readonly tooltip: TAxisTooltip;
  readonly styles: { [styleRule: string]: string | number };
};
export default function AxisTooltip({ tooltip, styles }: TProps) {
  if (
    isNil(tooltip?.tooltipData) ||
    isNil(tooltip?.tooltipTop) ||
    isNil(tooltip?.tooltipLeft)
  ) {
    return null;
  }
  return (
    <Tooltip top={tooltip.tooltipTop} left={tooltip.tooltipLeft} style={styles}>
      {tooltip.tooltipData}
    </Tooltip>
  );
}
