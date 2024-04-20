import { StateCreator } from 'zustand';
import { EPredictionMode } from '../../pages/App/Analysis/types';
import { TConfigurationSlice, TStoreMiddlewares } from '../types';
import actions from './actions';

const predictionHistoryStub = [
  {
    predictionMode: 'ARIMA',
    evaluation: {
      mae: 4.632051840204896,
      mape: 0.19360650296081933,
      me: -4.3279621361691785,
      mpe: -0.17526187827168574,
      rmse: 5.440473872737464
    },
    lastTrainPoint: {
      dateTime: 'Sun, 01 Oct 2006 00:00:00 GMT',
      value: 21.430241
    },
    prediction: {
      '1162339200000': 18.1604128884,
      '1164931200000': 18.1493075165,
      '1167609600000': 18.1382089357,
      '1170288000000': 18.1271171419,
      '1172707200000': 18.1160321309,
      '1175385600000': 18.1049538985,
      '1177977600000': 23.0938824406,
      '1180656000000': 18.0828177531,
      '1183248000000': 18.0717598318,
      '1185926400000': 18.0607086726,
      '1188604800000': 18.0496642714,
      '1191196800000': 18.0386266239,
      '1193875200000': 18.0275957262,
      '1196467200000': 18.0165715741,
      '1199145600000': 18.0055541633,
      '1201824000000': 17.9945434899,
      '1204329600000': 17.9835395497,
      '1207008000000': 17.9725423386,
      '1209600000000': 17.9615518524,
      '1212278400000': 17.9505680871
    },
    realPrediction: {
      '1214870400000': 21.4992292873,
      '1217548800000': 21.4860809877,
      '1220227200000': 21.4729407291,
      '1222819200000': 21.4598085068,
      '1225497600000': 21.4466843158,
      '1228089600000': 21.4335681511,
      '1230768000000': 21.4204600079,
      '1233446400000': 21.4073598813,
      '1235865600000': 21.3942677663,
      '1238544000000': 21.381183658,
      '1241136000000': 21.3681075517,
      '1243814400000': 21.3550394422,
      '1246406400000': 21.3419793249,
      '1249084800000': 21.3289271947,
      '1251763200000': 21.3158830469,
      '1254355200000': 21.3028468764,
      '1257033600000': 21.2898186785,
      '1259625600000': 29.2767984483,
      '1262304000000': 21.2637861809,
      '1264982400000': 21.2507818714
    },
    realPredictionParameters: {
      maxiter: 50,
      method: 'lbfgs',
      order: [1, 0, 1],
      out_of_sample_size: 0,
      scoring: 'mse',
      scoring_args: {},
      seasonal_order: [0, 0, 0, 0],
      start_params: null,
      suppress_warnings: true,
      trend: null,
      with_intercept: false
    },
    testPredictionParameters: {
      maxiter: 50,
      method: 'lbfgs',
      order: [1, 0, 1],
      out_of_sample_size: 0,
      scoring: 'mse',
      scoring_args: {},
      seasonal_order: [0, 0, 0, 0],
      start_params: null,
      suppress_warnings: true,
      trend: null,
      with_intercept: false
    },
    timestamp: '2024-04-19T09:21:56.317Z',
    id: 0
  },
  {
    evaluation: {
      mae: 4.632051840204896,
      mape: 0.19360650296081933,
      me: -4.3279621361691785,
      mpe: -0.17526187827168574,
      rmse: 5.440473872737464
    },
    lastTrainPoint: {
      dateTime: 'Sun, 01 Oct 2006 00:00:00 GMT',
      value: 21.430241
    },
    prediction: {
      '1162339200000': 18.1604128884,
      '1164931200000': 18.1493075165,
      '1167609600000': 18.1382089357,
      '1170288000000': 18.1271171419,
      '1172707200000': 18.1160321309,
      '1175385600000': 18.1049538985,
      '1177977600000': 18.0938824406,
      '1180656000000': 18.0828177531,
      '1183248000000': 9.0717598318,
      '1185926400000': 18.0607086726,
      '1188604800000': 18.0496642714,
      '1191196800000': 18.0386266239,
      '1193875200000': 18.0275957262,
      '1196467200000': 18.0165715741,
      '1199145600000': 18.0055541633,
      '1201824000000': 17.9945434899,
      '1204329600000': 17.9835395497,
      '1207008000000': 17.9725423386,
      '1209600000000': 17.9615518524,
      '1212278400000': 17.9505680871
    },
    realPrediction: {
      '1214870400000': 21.4992292873,
      '1217548800000': 21.4860809877,
      '1220227200000': 21.4729407291,
      '1222819200000': 21.4598085068,
      '1225497600000': 21.4466843158,
      '1228089600000': 21.4335681511,
      '1230768000000': 21.4204600079,
      '1233446400000': 21.4073598813,
      '1235865600000': 21.3942677663,
      '1238544000000': 21.381183658,
      '1241136000000': 21.3681075517,
      '1243814400000': 21.3550394422,
      '1246406400000': 8.3419793249,
      '1249084800000': 21.3289271947,
      '1251763200000': 21.3158830469,
      '1254355200000': 21.3028468764,
      '1257033600000': 21.2898186785,
      '1259625600000': 21.2767984483,
      '1262304000000': 21.2637861809,
      '1264982400000': 21.2507818714
    },
    realPredictionParameters: {
      maxiter: 50,
      method: 'lbfgs',
      order: [1, 0, 1],
      out_of_sample_size: 0,
      scoring: 'mse',
      scoring_args: {},
      seasonal_order: [0, 0, 0, 0],
      start_params: null,
      suppress_warnings: true,
      trend: null,
      with_intercept: false
    },
    testPredictionParameters: {
      maxiter: 50,
      method: 'lbfgs',
      order: [1, 0, 1],
      out_of_sample_size: 0,
      scoring: 'mse',
      scoring_args: {},
      seasonal_order: [0, 0, 0, 0],
      start_params: null,
      suppress_warnings: true,
      trend: null,
      with_intercept: false
    },
    timestamp: '2024-04-19T09:21:56.317Z',
    predictionMode: 'VAR',
    id: 1
  }
];

export const createConfigurationSlice: StateCreator<
  TConfigurationSlice,
  TStoreMiddlewares,
  [],
  TConfigurationSlice
> = (set, get) => ({
  data: [],
  selectedData: [],

  whiteNoiseTest: undefined,
  isWhiteNoiseTestLoading: false,

  stationarityTest: undefined,
  isStationarityTestLoading: false,

  causalityTest: undefined,
  isCausalityTestLoading: false,

  displayedPredictionId: 'latestPrediction',

  latestPrediction: {
    predictionMode: EPredictionMode.ARIMA,
    prediction: undefined,
    isPredictionLoading: false
  },

  predictionHistory: predictionHistoryStub as any,

  ...actions(set, get)
});
