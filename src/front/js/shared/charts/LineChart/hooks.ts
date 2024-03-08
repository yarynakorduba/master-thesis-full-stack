import { useTooltipInPortal } from '@visx/tooltip';
import { isNil } from 'lodash';
import { useState, useCallback } from 'react';

export const useTooltipConfigs = (
  xPadding,
  yPadding,
  chartHeight,
  variant,
  xScale,
  yScale,
  formatXScale,
  formatYScale
) => {
  const [pointTooltip, setPointTooltip] = useState<any>();
  const [xTooltip, setXTooltip] = useState<any>();
  const [yTooltip, setYTooltip] = useState<any>();

  const { containerRef, containerBounds } = useTooltipInPortal({
    scroll: true,
    detectBounds: true
  });

  const handleMouseLeave = (event, pointGroup) => {
    const noTooltipData = {
      tooltipLeft: undefined,
      tooltipTop: undefined,
      tooltipData: undefined
    };

    if (pointGroup) setPointTooltip(noTooltipData);

    setYTooltip(noTooltipData);
    setXTooltip(noTooltipData);
  };

  const getAxisTooltipData = useCallback((scale, isScaleLinear, formatter, coordinate) => {
    if (isNil(coordinate)) return undefined;
    const value = scale.invert(coordinate);

    return formatter ? formatter(value) : value;
  }, []);

  const handleHover = useCallback(
    (event, pointGroup) => {
      const top = 'clientY' in event ? event.clientY : 0;
      const left = 'clientX' in event ? event.clientX : 0;
      setPointTooltip({
        tooltipLeft: left - containerBounds.left,
        tooltipTop: top - containerBounds.top,
        tooltipData: pointGroup?.points
      });
      setYTooltip({
        tooltipLeft: xPadding,
        tooltipTop: top - containerBounds.top,
        tooltipData: getAxisTooltipData(
          yScale,
          true,
          formatYScale,
          top > yPadding + containerBounds.top ? top - yPadding - containerBounds.top : 0
        )
      });
      setXTooltip({
        tooltipLeft: left - containerBounds.left,
        tooltipTop: chartHeight + yPadding,
        tooltipData: getAxisTooltipData(
          xScale,
          true,
          formatXScale,
          left > xPadding + containerBounds.left ? left - xPadding - containerBounds.left : 0
        )
      });
    },
    [
      containerBounds,
      xPadding,
      getAxisTooltipData,
      yScale,
      formatYScale,
      yPadding,
      chartHeight,
      xScale,
      formatXScale
    ]
  );

  return {
    pointTooltip,
    xTooltip,
    yTooltip,
    handleHover,
    handleMouseLeave,
    containerRef
  };
};
