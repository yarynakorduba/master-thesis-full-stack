export enum EPredictionMode {
  ARIMA = 'ARIMA',
  VAR = 'VAR',
}

export type TValueBounds = {
  readonly x0: number;
  readonly x1: number;
};

// params which are passed to the model from the UI
export type TARIMAUserParams = {
  readonly lagOrder: number;
  readonly horizon: number;
  readonly isSeasonal: boolean;
  readonly minP: number;
  readonly maxP: number;
  readonly minQ: number;
  readonly maxQ: number;
  readonly periodsInSeason?: number;
};
// params which come back as a part of the response
export type TResponseARIMAParams = {
  readonly order: [number, number, number];
  readonly seasonal_order?: [number, number, number, number];
  // rest of params which are not used on the client side atm
  readonly maxiter: number;
  readonly method:
    | 'newton'
    | 'nm'
    | 'bfgs'
    | 'lbfgs'
    | 'powell'
    | 'cg'
    | 'ncg'
    | 'basinhopping'; // The method determines which solver from scipy.optimize is used
  readonly out_of_sample_size: number;
  readonly scoring?: 'mse' | 'mae';
  readonly scoring_args?: {};
  readonly start_params: null;
  readonly suppress_warnings: boolean;
  readonly with_intercept: boolean;
  readonly trend: null;
};

export type TPredictionEvaluation = {
  readonly mae: number;
  readonly mape: number;
  readonly me: number;
  readonly mpe: number;
  readonly rmse: number;
};

export type THistoryEntry = {
  readonly id: number;
  readonly createdAt: string; // ISO date string
  readonly predictionMode: EPredictionMode;
  readonly testPrediction: TPredictedPoints;
  readonly realPrediction: TPredictedPoints;

  readonly lastTrainPoint: TLastTrainPoint;

  readonly realPredictionParameters: TResponseARIMAParams;
  readonly testPredictionParameters: TResponseARIMAParams;

  readonly evaluation: { readonly [prop: string]: TPredictionEvaluation };

  // the data which was selected for training
  readonly selectedDataBoundaries?: TValueBounds;
};

export type TLastTrainPoint = {
  readonly dateTime: string;
  x;
  readonly value: number;
};

export type TPredictedPoints = { [msTimestamp: string]: number };

export type TARIMAResult = {
  readonly lastTrainPoint: TLastTrainPoint;
  readonly testPrediction: TPredictedPoints;
  readonly realPrediction: TPredictedPoints;
  readonly realPredictionParameters: any;
};

export type TVARResult = any;

export enum EAnalysisFormFields {
  isSeasonal = 'isSeasonal',
  periodsInSeason = 'periodsInSeason',
  lagOrder = 'lagOrder',
  minQ = 'minQ',
  maxQ = 'maxQ',
  minP = 'minP',
  maxP = 'maxP',
  horizon = 'horizon',
}
