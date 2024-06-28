import { LinearScaleConfig, ScaleConfigToD3Scale } from '@visx/scale';
import { TValueBounds } from 'front/js/pages/Configuration/Analysis/types';
import {
  TDataLabel,
  TLineChartData,
  TLineChartDatapoint,
} from 'front/js/types';
import { TPadding } from 'front/js/types/styles';
import { ChartVariant } from '../ChartOverlays/hooks';
import { TThresholdData, TFormatXScale, TFormatYScale } from '../types';

export type TLineChartProps = {
  readonly width?: number;
  readonly height?: number;
  readonly heading?: string;
  readonly variant?: ChartVariant;
  readonly data: TLineChartData;
  readonly dataRegions?: any[];
  readonly thresholdData?: Array<TThresholdData>;
  readonly selectedAreaBounds?: TValueBounds;
  readonly dataLabels?: TDataLabel[];
  readonly formatXScale: (extent?: [number, number]) => TFormatXScale;

  readonly formatYScale: TFormatYScale;
  readonly numXAxisTicks?: number;
  readonly numYAxisTicks?: number;
  readonly padding?: TPadding;
  readonly onClick?: () => void;
  readonly defaultBrushValueBounds?: TValueBounds;
  readonly onSelectArea?: (points) => void;
  readonly selectedDataLength?: string;
  readonly defaultIsTrainingDataSelectionOn?: boolean;
};

export type TSparkLineChartProps = {
  readonly data: TLineChartData;
  readonly thresholdData?: Array<TThresholdData>;
  readonly heading?: string;
  readonly headingMark?: string;
  readonly width?: number;
  readonly height?: number;
  readonly formatXScale?: TFormatXScale;
  readonly formatYScale?: TFormatYScale;
  readonly padding?: TPadding;
  readonly variant?: ChartVariant;
  readonly numTicks?: number;
  readonly strokeWidth?: number;
};

export type TLinDomainValue = number;
export type TLinScale = ScaleConfigToD3Scale<
  LinearScaleConfig<number>,
  number,
  TLinDomainValue
>;

export type TClosestChartPoint = {
  readonly color: string;
  readonly data?: TLineChartDatapoint;
};
export type TClosestChartPointGroup = {
  readonly x: number;
  readonly y: number;
  readonly points: TClosestChartPoint[];
};

export type TClosestChartPointGroups = {
  readonly [pointGroupId: string]: TClosestChartPointGroup;
};
