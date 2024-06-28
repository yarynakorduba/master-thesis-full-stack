import { ParentSize } from '@visx/responsive';
import { isNil } from 'lodash';
import React, { useCallback } from 'react';
import { TSparkLineChartProps } from './types';
import SparkLineChart from './SparkLineChart';

export default function ResponsiveLineChart({
  width = 900,
  height = 200,
  onClick,
  ...props
}: TSparkLineChartProps & { readonly onClick: () => void }) {
  const renderResponsiveChart = useCallback(
    (parent) => {
      const responsiveWidth = !isNil(width)
        ? Math.min(width, parent.width)
        : undefined;
      const responsiveHeight = !isNil(height)
        ? Math.min(height, parent.height)
        : undefined;

      return (
        <SparkLineChart
          width={responsiveWidth}
          height={responsiveHeight}
          {...props}
        />
      );
    },
    [width, height, props],
  );

  return (
    <ParentSize
      parentSizeStyles={{
        maxHeight: height,
        maxWidth: width,
        width: 'auto',
        height,
      }}
      onClick={onClick}
    >
      {renderResponsiveChart}
    </ParentSize>
  );
}
