import pandas as pd
import json
from api.services.statistical_tests import StatisticalTests
import pmdarima as pm

from api.utils import APIException, forecast_accuracy

TRAIN_TEST_SPLIT_PROPORTION = 0.8
    
class ARIMAPrediction:
    def __init__(self):
        self = self
    
    def arima_predict(self, request_data):
        data = request_data.get("data", None)
        data_keys = request_data.get("data_keys", None)
        params = request_data.get('parameters', None)

        if not(data) or len(data) == 0:
            raise APIException('The data for prediction is empty')
        if not(data_keys) or len(data_keys) == 0:
            raise APIException('The fields to analyze were not specified')
        if not(params) or len(params) == 0:
            raise APIException('The parameters for prediction were not provided')
        
        horizon = params.get("horizon", 40)
        is_seasonal = params.get("isSeasonal", False)

        max_p = params.get("maxP", None)
        max_q = params.get("maxQ", None)
        # 1 is default value
        periods_in_season = params.get("periodsInSeason", 1)

        if len(data) < horizon:
            raise APIException('Prediction horizon cannot be higher than the length of the analyzed data')
        if not(data_keys) or "date_key" not in data_keys or "value_key" not in data_keys:
            raise APIException('Data fields for the analysis are not specified')
        try:
            date_key = data_keys["date_key"]
            value_key = data_keys["value_key"]
            df_input = pd.DataFrame.from_records(data)
            # Drop duplicates
            df_input = df_input.drop_duplicates(subset=[date_key], keep='first')

            df_input[date_key] = pd.to_datetime(df_input[date_key], unit='ms')
            df_input = df_input.set_index(df_input[date_key]).sort_index(ascending=True, inplace=False)
            df_input = df_input.drop(columns=[date_key])
            train_data_size = int(round(len(df_input) * TRAIN_TEST_SPLIT_PROPORTION))
            train, test = df_input[value_key][0:train_data_size], df_input[value_key][train_data_size:len(df_input)]
            print(f"Train size: {train.size}, test size: {test.size}")
            if (train.size == 0 or test.size == 0):
                raise APIException('Too little data to predict')
            

            smodel = pm.auto_arima(
                train,
                test='kpss',
                max_p=max_p,
                max_q=max_q,
                m=periods_in_season,
                start_P=0,
                seasonal=is_seasonal,
                d=None,
                D=None,
                trace=True,
                error_action='ignore',
                suppress_warnings=True, 
                stepwise=True,
                maxiter=1,
                seasonal_test="ch"
            )

            test_prediction, test_confint = smodel.predict(n_periods=len(test), return_conf_int=True)
            
            inferred_freq = pd.infer_freq(df_input.index)
            print(f"Inferred frequency: {inferred_freq}")
            test_indexes = test.index#pd.date_range(test.index[0], periods = len(test), freq=inferred_freq) # month start frequency
            # In case frequency could not be inferred, the data probably have wrong indexes
            if (inferred_freq == None):
                test_prediction.index = test_indexes
            test_predicted_series = pd.Series(test_prediction).dropna()
            
            json_result = test_predicted_series.to_json()
            test_prediction_parameters = smodel.get_params()
            # --------------------------------------

            smodel.update(test)
            real_prediction, new_conf_int = smodel.predict(n_periods=horizon, return_conf_int=True)
            real_prediction_parameters = smodel.get_params()
            real_indexes = pd.date_range(test.index[-1], periods = horizon+1, freq=inferred_freq) # month start frequency

            real_indexes = real_indexes[1:]
            real_predicted_series = pd.Series(real_prediction, index=real_indexes).dropna()
            json_real_prediction_result = real_predicted_series.to_json()
            evaluation = forecast_accuracy(test_predicted_series, test)
            # --------------------------------------
            return {
                "testPrediction": { value_key: json.loads(json_result) },\
                "realPrediction": { value_key: json.loads(json_real_prediction_result) },\
                "testPredictionParameters": test_prediction_parameters,\
                "realPredictionParameters": real_prediction_parameters,\
                "trainExtent": { "from": df_input.index[0], "to":  df_input.index[train_data_size-1] },
                "evaluation": { value_key: evaluation },
                "predictionMode": 'ARIMA'
                
            }
        except APIException as e:
            print(f"ARIMA prediction error: {e.message}")
            raise e
        except Exception as e:
            print(f"ARIMA prediction error: {str(e)}")
            raise APIException(str(e))
