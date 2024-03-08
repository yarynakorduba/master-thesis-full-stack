import React, { useCallback } from 'react';
import { defaultStyles, Tooltip, TooltipWithBounds } from '@visx/tooltip';
import { isNil, map } from 'lodash';
import { TooltipContent, TooltipText } from './styles';

const pointTooltipStyles = {
  ...defaultStyles,
  minWidth: '2rem',
  maxWidth: '20rem',
  textAlign: 'center',
  pointerEvents: 'none'
};

const xAxisTooltipStyles = {
  ...defaultStyles,
  minWidth: '2rem',
  maxWidth: '7rem',
  textAlign: 'center',
  pointerEvents: 'none',
  color: 'white',
  background: '#827397',
  transform: 'translate(calc(-50% - 0.6rem), -0.5rem)'
};

const yAxisTooltipStyles = {
  ...defaultStyles,
  minWidth: '2rem',
  maxWidth: '7rem',
  width: 'fit-content',
  textAlign: 'center',
  pointerEvents: 'none',
  color: 'white',
  transform: 'translate(calc(-100% - 0.75rem), calc(-50% - 0.6rem))',
  background: '#827397'
};

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

type TChartTooltipProps = {
  readonly pointTooltip: any;
  readonly xTooltip: number;
  readonly yTooltip: number;
} & any;
export default function ChartTooltips({
  pointTooltip,
  xTooltip,
  yTooltip,
  formatXScale
}: TChartTooltipProps) {
  const renderPointTooltipText = useCallback(
    () =>
      map(pointTooltip?.tooltipData, (point) => (
        <TooltipContent key={point?.data?.id}>
          <TooltipDatumIndicator color={point?.color} />
          <TooltipText>
            {formatXScale(point.data.valueX)} - {point.data.valueY}
          </TooltipText>
        </TooltipContent>
      )),
    [formatXScale, pointTooltip?.tooltipData]
  );

  console.log('Rendering tooltip', pointTooltip);

  const renderTooltip = useCallback(
    (tooltip, styles, isTooltipForPoint = false) => {
      if (
        isNil(tooltip?.tooltipData) ||
        isNil(tooltip?.tooltipTop) ||
        isNil(tooltip?.tooltipLeft)
      ) {
        return null;
      }

      const TooltipComponent = isTooltipForPoint ? TooltipWithBounds : Tooltip;
      return (
        <TooltipComponent top={tooltip?.tooltipTop} left={tooltip?.tooltipLeft} style={styles}>
          {isTooltipForPoint ? renderPointTooltipText() : tooltip?.tooltipData}
        </TooltipComponent>
      );
    },
    [renderPointTooltipText]
  );

  return (
    <>
      {renderTooltip(xTooltip, xAxisTooltipStyles)}
      {renderTooltip(yTooltip, yAxisTooltipStyles)}
      {renderTooltip(pointTooltip, pointTooltipStyles, true)}
    </>
  );
}
