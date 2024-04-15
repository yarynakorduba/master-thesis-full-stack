import { TooltipWithBounds } from '@visx/tooltip';
import { map, isNil } from 'lodash';
import React, { useCallback } from 'react';
import { TooltipContent, TooltipText } from './styles';
import { TFormatXScale } from '../types';
import { TPointTooltip, TPointTooltipDatum } from './types';

type TTooltipDatumIndicatorProps = {
  readonly color: string;
};
function TooltipDatumIndicator({ color }: TTooltipDatumIndicatorProps) {
  return (
    <svg viewBox="0 0 4 4" width="0.5rem" height="0.5rem" style={{ margin: '0 0.5rem 0 0' }}>
      <circle cx="50%" cy="50%" r="2" fill={color} stroke="none" />
    </svg>
  );
}

type TProps = {
  readonly tooltip: TPointTooltip;
  readonly styles: { readonly [cssRule: string]: string | number };
  readonly formatXScale: TFormatXScale;
};
export default function PointTooltip({ tooltip, styles, formatXScale }: TProps) {
  const renderPointTooltipText = useCallback(
    () =>
      map(tooltip?.tooltipData, (point: TPointTooltipDatum) => (
        <TooltipContent key={`${point?.data?.id}-${point.data.valueX}`}>
          <TooltipDatumIndicator color={point?.color} />
          <TooltipText>
            {formatXScale(point.data.valueX)} - {point.data.valueY}
          </TooltipText>
        </TooltipContent>
      )),
    [formatXScale, tooltip?.tooltipData]
  );

  if (isNil(tooltip?.tooltipData) || isNil(tooltip?.tooltipTop) || isNil(tooltip?.tooltipLeft)) {
    return null;
  }

  return (
    <TooltipWithBounds top={tooltip.tooltipTop} left={tooltip.tooltipLeft} style={styles}>
      {renderPointTooltipText()}
    </TooltipWithBounds>
  );
}
