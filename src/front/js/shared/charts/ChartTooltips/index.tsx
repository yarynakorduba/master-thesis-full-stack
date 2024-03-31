import React, { useCallback } from 'react';
import { defaultStyles, Tooltip, TooltipWithBounds } from '@visx/tooltip';
import { isNil, map } from 'lodash';
import { useTheme } from '@mui/material/styles';

import { TooltipContent, TooltipText } from './styles';

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

const xAxisTooltipStyles = {
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
  const { palette } = useTheme();

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
      const componentStyles = isTooltipForPoint
        ? styles
        : { ...styles, background: palette.secondary.dark };
      return (
        <TooltipComponent
          top={tooltip?.tooltipTop}
          left={tooltip?.tooltipLeft}
          style={componentStyles}
        >
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
