import { Group } from '@visx/group';
import React from 'react';
import { filter, flow, map, max, min } from 'lodash';
import { alpha } from '@mui/material';
import type { TLinScale, TLineChartDataRegion } from './types';
import { REGION_FONT_SIZE, REGION_HEIGHT } from './consts';

type TProps = {
  readonly paddingLeft?: number;
  readonly dataRegions: TLineChartDataRegion[];
  readonly xScale: TLinScale;
  readonly maxX: number;
};

const LineChartDataRegions = ({
  paddingLeft = 0,
  dataRegions,
  xScale,
  maxX,
}: TProps) => {
  const regionPositions = flow(
    (r) =>
      map(r, (region) => ({
        ...region,
        from: max([xScale(region.from), 0]),
        to: min([xScale(region.to), maxX]),
      })),
    (r) => filter(r, ({ from, to }) => from < to),
  )(dataRegions);

  return (
    <Group left={paddingLeft} top={0}>
      {map(regionPositions, (region) => {
        const width = region.to - region.from;
        return (
          <Group>
            <rect
              x={region.from}
              y={0}
              width={width}
              height={REGION_HEIGHT}
              fill={alpha(region.fill, 0.25)}
            />
            {region.label.length * 6 < width && (
              <text
                x={region.from + 4}
                y={REGION_HEIGHT - (REGION_HEIGHT - REGION_FONT_SIZE) / 2 - 2}
                fontSize={REGION_FONT_SIZE}
              >
                {region.label}
              </text>
            )}
          </Group>
        );
      })}
    </Group>
  );
};

export default LineChartDataRegions;
