export type TTimeseriesData = Array<{ [key: string]: string | number }>;

export type TDataProperty = {
  readonly value: string;
  readonly label: string;
};

export type TLineChartDatapoint = {
  readonly valueX: number;
  readonly valueY: number;
};

export type TLineChartSerie = {
  readonly id: string | number;
  readonly color: string;
  readonly label: string;
  readonly datapoints: Array<TLineChartDatapoint>;
};

export type TLineChartData = Array<TLineChartSerie>;
