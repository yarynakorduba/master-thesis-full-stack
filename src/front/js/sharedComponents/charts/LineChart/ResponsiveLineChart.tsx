import { ParentSize } from '@visx/responsive';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import type { TLineChartProps } from './types';
import LineChart from './LineChart';

const MIN_HEIGHT = 350;

export default function ResponsiveLineChart({
  width = 2000,
  height = MIN_HEIGHT,
  isResponsive,
  ...props
}: TLineChartProps & { readonly isResponsive?: boolean }) {
  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width) && Math.min(width, parent.width);
      const responsiveHeight =
        !isNil(height) && Math.min(height, parent.height);

      if (!responsiveWidth || !responsiveHeight) return null;
      return (
        <LineChart
          {...props}
          width={responsiveWidth}
          height={responsiveHeight}
        />
      );
    },
    [width, height, props],
  );

  if (!isResponsive) {
    return <LineChart width={width} height={MIN_HEIGHT} {...props} />;
  }
  return (
    <ParentSize
      parentSizeStyles={{
        width: 'auto',
        height: 'auto',
        maxWidth: '100%',
        minHeight: MIN_HEIGHT,
      }}
    >
      {renderResponsiveChart}
    </ParentSize>
  );
}
