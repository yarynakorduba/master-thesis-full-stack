import { Group } from '@visx/group';
import React from 'react';
import { REGION_FONT_SIZE, REGION_HEIGHT } from './consts';
import { map } from 'lodash';
import { Typography, alpha } from '@mui/material';

const LineChartDataRegions = ({
  paddingLeft = 0,
  dataRegions,
  xScale,
}: any) => {
  const regionPositions = map(dataRegions, (region) => ({
    ...region,
    from: { x: xScale(region.from) },
    to: { x: xScale(region.to) },
  }));

  return (
    <Group left={paddingLeft} top={0}>
      {map(regionPositions, (region) => {
        const width = region.to.x - region.from.x;
        return (
          <Group>
            <rect
              x={region.from.x}
              y={0}
              width={width}
              height={REGION_HEIGHT}
              fill={alpha((region as any).fill, 0.25)}
            />
            {region.label.length * 6 < width && (
              <text
                x={region.from.x + 4}
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
