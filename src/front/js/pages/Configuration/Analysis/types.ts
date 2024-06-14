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

export type TVARUserParams = {
  readonly lagOrder: number;
  readonly horizon: number;
};
export type TResponseVARParams = {
  readonly order: number;
};

export type TPredictionEvaluation = {
  readonly mae: number;
  readonly mape: number;
  readonly me: number;
  readonly mpe: number;
  readonly rmse: number;
};

export type TPredictionResult<T = TResponseARIMAParams | TResponseVARParams> = {
  readonly id: string; // uuid
  readonly createdAt: string; // ISO date string
  readonly lastTrainPoint: TLastTrainPoint;
  readonly testPrediction: TPredictedPoints;
  readonly realPrediction: TPredictedPoints;
  readonly realPredictionParameters: T; //TResponseARIMAParams | TResponseVARParams;
  readonly testPredictionParameters: T; //TResponseARIMAParams | TResponseVARParams;
  readonly evaluation: { readonly [prop: string]: TPredictionEvaluation };
  // the data which was selected for training
  readonly selectedDataBoundaries?: TValueBounds;
  readonly predictionMode: EPredictionMode;
};
export type TARIMAResult = TPredictionResult<TResponseARIMAParams>;
export type TVARResult = TPredictionResult<TResponseVARParams>;

export type THistoryEntry<T = TResponseARIMAParams | TResponseVARParams> =
  TPredictionResult<T> & {
    readonly inputData: any;
  };

export type TARIMAHistoryEntry = THistoryEntry<TResponseARIMAParams>;
export type TVARHistoryEntry = THistoryEntry<TResponseVARParams>;

export type TLastTrainPoint = {
  readonly dateTime: string;
  x;
  readonly value: number;
};

export type TPredictedPoints = { [msTimestamp: string]: number };

export enum EAnalysisFormFields {
  isSeasonal = 'isSeasonal',
  periodsInSeason = 'periodsInSeason',
  lagOrder = 'lagOrder',
  minQ = 'minQ',
  maxQ = 'maxQ',
  minP = 'minP',
  maxP = 'maxP',
  horizon = 'horizon',
  whiteNoiseMaxLagOrder = 'whiteNoiseMaxLagOrder',
  causalityMaxLagOrder = 'causalityMaxLagOrder',
}

export type TCausalityResultItem = {
  readonly source: string;
  readonly target: string;
  readonly isCausal: boolean;
};
export type TCausalityResult = TCausalityResultItem[];
