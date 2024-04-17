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

export type TARIMAResult = {
  readonly lastTrainPoint: {
    readonly dateTime: string;
    readonly value: number;
  };
  readonly parameters: any;
  readonly prediction: { [msTimestamp: string]: number };
  readonly realPrediction: { [msTimestamp: string]: number };
};

export type TVARResult = any;
