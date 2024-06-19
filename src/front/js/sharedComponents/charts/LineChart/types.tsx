import { LinearScaleConfig, ScaleConfigToD3Scale } from '@visx/scale';
import { TLineChartDatapoint } from 'front/js/types';

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
