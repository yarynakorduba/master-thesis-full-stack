import { useTooltipInPortal } from '@visx/tooltip';
import { isNil, map } from 'lodash';
import { useState, useCallback, useMemo } from 'react';
import { CHART_HEADING_HEIGHT, LEGEND_HEIGHT, BRUSH_HEIGHT } from '.';
import { TDataLabel } from 'front/js/types';
import { TLinScale } from './types';
import { TFormatXScale, TFormatYScale, TPadding } from '../types';
import { TAxisTooltip, TPointTooltip } from '../ChartTooltips/types';

type TTooltipConfigsResult = {
  readonly pointTooltip: TPointTooltip | undefined;
  readonly xTooltip: TAxisTooltip | undefined;
  readonly yTooltip: TAxisTooltip | undefined;
  readonly dataLabelTooltips: TAxisTooltip[];
  readonly handleHover;
  readonly handleMouseLeave;
  readonly containerRef: (element: HTMLElement | SVGElement | null) => void;
};
export const useTooltipConfigs = (
  xPadding: number,
  yPadding: number,
  chartHeight: number,
  xScale: TLinScale,
  yScale: TLinScale,
  formatXScale: TFormatXScale,
  formatYScale: TFormatYScale,
  dataLabels: TDataLabel[] = []
): TTooltipConfigsResult => {
  const [pointTooltip, setPointTooltip] = useState<TPointTooltip | undefined>();
  const [xTooltip, setXTooltip] = useState<TAxisTooltip | undefined>();
  const [yTooltip, setYTooltip] = useState<TAxisTooltip | undefined>();

  const { containerRef, containerBounds } = useTooltipInPortal({
    scroll: true,
    detectBounds: true
  });

  const handleMouseLeave = (_e, pointGroup) => {
    const noTooltipData = {
      tooltipLeft: undefined,
      tooltipTop: undefined,
      tooltipData: undefined
    };

    if (pointGroup) setPointTooltip(noTooltipData);

    setYTooltip(noTooltipData);
    setXTooltip(noTooltipData);
  };

  const getAxisTooltipData = useCallback(
    (scale: TLinScale, isScaleLinear, formatter, coordinate: number) => {
      if (isNil(coordinate)) return undefined;
      const value = scale.invert(coordinate);
      return formatter ? formatter(value) : value;
    },
    []
  );

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

  const dataLabelTooltips = map(dataLabels, (dataLabel: TDataLabel) => ({
    tooltipLeft: xScale(dataLabel.valueX) + xPadding,
    tooltipTop: 0,
    tooltipData: dataLabel.label
  }));

  return {
    pointTooltip,
    xTooltip,
    yTooltip,
    dataLabelTooltips,
    handleHover,
    handleMouseLeave,
    containerRef
  };
};

export const useChartSizes = (width: number, height: number, padding: TPadding) => {
  const xyAreaWidth = useMemo(() => {
    const clean = width - padding.left - padding.right;
    return clean > 0 ? clean : 0;
  }, [padding.left, padding.right, width]);

  const svgHeight = height - CHART_HEADING_HEIGHT - LEGEND_HEIGHT;
  const xyAreaHeight = useMemo(
    () => svgHeight - padding.top - padding.bottom - BRUSH_HEIGHT,
    [padding.bottom, padding.top, svgHeight]
  );

  return { xyAreaWidth, xyAreaHeight, svgHeight };
};
