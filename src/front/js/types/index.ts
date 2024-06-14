export type TTimeseriesDatum = { readonly [key: string]: string | number };
export type TTimeseriesData = Array<TTimeseriesDatum>;

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

// Data labels
export type TDataLabel = Pick<TLineChartDatapoint, 'valueX'> & {
  readonly label: string;
};

///////////////

export type TWhiteNoiseResponse = { readonly isWhiteNoise: boolean };
export type TWhiteNoiseResult =
  | { [key: string]: TWhiteNoiseResponse }
  | undefined;
