import { Tooltip } from '@visx/tooltip';
import { isNil } from 'lodash';
import React from 'react';

export default function AxisTooltip({ tooltip, styles }: any) {
  console.log('---toooltip, stykles === > ', tooltip, styles);
  if (isNil(tooltip?.tooltipData) || isNil(tooltip?.tooltipTop) || isNil(tooltip?.tooltipLeft)) {
    return null;
  }
  return (
    <Tooltip top={tooltip.tooltipTop} left={tooltip.tooltipLeft} style={styles}>
      {tooltip.tooltipData}
    </Tooltip>
  );
}
