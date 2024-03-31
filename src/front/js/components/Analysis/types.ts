export enum EPredictionMode {
  ARIMA = 'ARIMA',
  VAR = 'VAR'
}

export type TARIMAParams = {
  readonly lagOrder: number;
  readonly horizon: number;
  readonly isSeasonal: boolean;
  readonly minP: number;
  readonly maxP: number;
  readonly minQ: number;
  readonly maxQ: number;
  readonly periodsInSeason?: number;
};
