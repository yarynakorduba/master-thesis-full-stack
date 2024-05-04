import React from 'react';
import { Group } from '@visx/group';
import { noop } from 'lodash';
import { Brush } from '@visx/brush';
import BaseBrush from '@visx/brush/lib/BaseBrush';
import { Bounds } from '@visx/brush/lib/types';

import BrushHandle from './BrushHandle';
import ChartLine from './ChartLine';
import { BRUSH_HEIGHT, selectedAreaStyle, selectedBrushStyle } from './consts';
import { TLinScale } from './types';
import { TPadding } from '../types';
import { TLineChartData } from 'front/js/types';
import { BrushHandleRenderProps } from '@visx/brush/lib/BrushHandle';
import { useTheme } from '@mui/material';
import { Threshold } from '@visx/threshold';

type TProps = {
  readonly xBrushScale: TLinScale;
  readonly yBrushScale: TLinScale;
  readonly svgHeight: number;
  readonly width: number;
  readonly selectedAreaOnBrushRef: React.MutableRefObject<BaseBrush | null>;
  readonly brushRef: React.MutableRefObject<BaseBrush | null>;

  readonly onChange: (domain: Bounds | null) => void;
  readonly data: TLineChartData;
  readonly thresholdData?: any;
  readonly padding: TPadding;
};
const CustomBrush = ({
  data,
  thresholdData = [],
  padding,
  svgHeight,
  width,
  xBrushScale,
  yBrushScale,
  onChange,
  selectedAreaOnBrushRef,
  brushRef,
}: TProps) => {
  if (xBrushScale.range()?.[1] === 0) return null;
  return (
    <Group
      left={padding.left}
      top={svgHeight - BRUSH_HEIGHT}
      width={width}
      style={{ pointerEvents: 'auto' }}
    >
      <Brush
        brushDirection="horizontal"
        xScale={xBrushScale}
        yScale={yBrushScale}
        width={width}
        height={BRUSH_HEIGHT}
        margin={{ left: padding.left, top: padding.top }}
        resizeTriggerAreas={[]}
        onChange={noop}
        selectedBoxStyle={selectedAreaStyle}
        innerRef={selectedAreaOnBrushRef}
        disableDraggingOverlay
        disableDraggingSelection
      />
      {data?.map((lineData) => (
        <ChartLine
          key={lineData.label}
          lineData={lineData}
          xScale={xBrushScale}
          yScale={yBrushScale}
          style={{ pointerEvents: 'none' }}
        />
      ))}
      {thresholdData.map((dataItem) => (
        <Threshold<any>
          id={dataItem.id}
          key={dataItem.id}
          clipAboveTo={0}
          clipBelowTo={BRUSH_HEIGHT}
          data={dataItem?.datapoints}
          x={({ valueX }) => xBrushScale(valueX)}
          y0={({ valueY0 }) => yBrushScale(valueY0)}
          y1={({ valueY1 }) => yBrushScale(valueY1)}
          belowAreaProps={dataItem.belowAreaProps}
          aboveAreaProps={dataItem.aboveAreaProps}
        />
      ))}
      <Brush
        brushDirection="horizontal"
        xScale={xBrushScale}
        yScale={yBrushScale}
        width={width}
        height={BRUSH_HEIGHT}
        handleSize={8}
        margin={{ left: padding.left }}
        onChange={onChange}
        selectedBoxStyle={selectedBrushStyle()}
        innerRef={brushRef}
        initialBrushPosition={{
          start: { x: xBrushScale.range()?.[0] ?? 0 },
          end: { x: xBrushScale.range()?.[1] ?? 0 },
        }}
        useWindowMoveEvents
        renderBrushHandle={(props: BrushHandleRenderProps) => (
          <BrushHandle {...props} x={props.x} />
        )}
      />
    </Group>
  );
};

export default CustomBrush;
