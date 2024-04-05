import React from 'react';
import { Group } from '@visx/group';
import { noop } from 'lodash';
import { Brush } from '@visx/brush';
import BaseBrush from '@visx/brush/lib/BaseBrush';
import { Bounds } from '@visx/brush/lib/types';

import { BRUSH_HEIGHT } from '.';
import BrushHandle from './BrushHandle';
import ChartLine from './ChartLine';
import { selectedAreaStyle, selectedBrushStyle } from './consts';
import { TLinScale } from './types';
import { TPadding } from '../types';
import { TLineChartData } from 'front/js/types';

type TProps = {
  readonly xBrushScale: TLinScale;
  readonly yBrushScale: TLinScale;
  readonly svgHeight: number;
  readonly width: number;
  readonly selectedAreaOnBrushRef: React.MutableRefObject<BaseBrush | null>;
  readonly onChange: (domain: Bounds | null) => void;
  readonly data: TLineChartData;
  readonly padding: TPadding;
};
const CustomBrush = ({
  data,
  padding,
  svgHeight,
  width,
  xBrushScale,
  yBrushScale,
  onChange,
  selectedAreaOnBrushRef
}: TProps) => {
  return (
    <Group left={padding.left} top={svgHeight - BRUSH_HEIGHT} width={width}>
      {data?.map((lineData) => (
        <ChartLine
          key={lineData.label}
          lineData={lineData}
          xScale={xBrushScale}
          yScale={yBrushScale}
        />
      ))}
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
      <Brush
        brushDirection="horizontal"
        xScale={xBrushScale as any}
        yScale={yBrushScale as any}
        width={width}
        height={BRUSH_HEIGHT}
        handleSize={8}
        margin={{ left: padding.left }}
        onChange={onChange}
        selectedBoxStyle={selectedBrushStyle}
        useWindowMoveEvents
        renderBrushHandle={(props: any) => <BrushHandle {...props} x={props.x} />}
      />
    </Group>
  );
};

export default CustomBrush;
