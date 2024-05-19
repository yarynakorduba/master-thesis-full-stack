import { AreaProps } from '@visx/shape/lib/shapes/Area';

export type TFormatXScale = (value: number) => string;
export type TFormatYScale = (value: number) => string;

export type TChartThresholdDatapoint = {
  readonly valueX: number;
  readonly valueY0: number;
  readonly valueY1: number;
};

type TFillProps = {
  readonly fill: string;
  readonly fillOpacity: number;
};
export type TThresholdData = {
  readonly id: string;
  readonly data: TChartThresholdDatapoint[];
  readonly label?: string;
  /** Additional props passed to the "above" Area shape. */
  readonly aboveAreaProps?: AreaProps<TChartThresholdDatapoint> & TFillProps;
  /** Additional props passed to the "below" Area shape. */
  readonly belowAreaProps?: AreaProps<TChartThresholdDatapoint> & TFillProps;
};
