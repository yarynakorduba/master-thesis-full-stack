import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from api.services.statistical_tests import StatisticalTests

from api.utils import APIException, forecast_accuracy

TRAIN_TEST_SPLIT_PROPORTION = 0.9

class VARPrediction:
    def __init__(self):
        self = self
    
    def df_test_transformation(self, df, scaler):  
        df_transformed, diff_order, is_stationary, first_elements = StatisticalTests().convert_data_to_stationary(df)

        # Scale data using the previously defined scaler
        df_transformed = pd.DataFrame(scaler.transform(df_transformed.copy()), 
                            columns=df_transformed.columns, 
                            index=df_transformed.index)
        
        return df_transformed, diff_order, first_elements
    
    def inverse_diff(self, s, last_observation):
        series_undifferenced = s.copy()
        print(f"LAST OBS")
        print(last_observation.to_frame().transpose())
        series_undifferenced = pd.concat([last_observation.to_frame().transpose(), series_undifferenced], axis=0)
        print(f"CONCATENATED")
        print(series_undifferenced)

        series_undifferenced = series_undifferenced.cumsum()

        return series_undifferenced
    
    def df_inv_transformation(self, pred, scaler, diff_order, first_elements):
        df_transformed = pred.copy()
        df_transformed = pd.DataFrame(scaler.inverse_transform(df_transformed), 
                        columns=df_transformed.columns, 
                        index=df_transformed.index)
        print(f"Scaling back diff order {diff_order}")
      
        for i in range(diff_order):
            df_transformed = self.inverse_diff(df_transformed, first_elements[-1-i])

        return df_transformed
    
    # Estimate the model (VAR) and show summary
    # Forecast next two weeks
    def run_forecast(self, df_to_run_forecast_on, steps, maxlags, ic=None):
        # Is this ts unique? (check with pandas)
        scaler = StandardScaler()
        scaler.fit(df_to_run_forecast_on)
        # Apply function to our data
        df_scaled, diff_order, first_elements = self.df_test_transformation(df_to_run_forecast_on, scaler)

        model = VAR(df_scaled)

        if (ic != None):
            # Get optimal lag order based on the four criteria
            optimal_lags = model.select_order(maxlags=maxlags, trend="ct")
            print(f"The optimal lag order selected: {optimal_lags.selected_orders}")
            # Fit the model after selecting the lag order
            maxlags = optimal_lags.selected_orders[ic]
        # print(f"Model fit to lag order {optimal_lags}")
        results = model.fit(maxlags=maxlags)
        print(f"After fitting {results.k_ar}")
        # print(f"MODEL INFO {results.summary()}")
        total_horizon = steps
        # Do we need to add one more index here?
        inferred_freq = pd.infer_freq(df_scaled.index)
        print(f"Inferred frequency: {inferred_freq}")
        idx = pd.date_range(start=pd.to_datetime(df_scaled.iloc[-1:].index.item(), unit='ms'), periods=total_horizon + 1, freq=inferred_freq).delete(0) 
        print(f"predict STEPS {steps}")
        lag_order = results.k_ar
        forecast = results.forecast(y=df_scaled.values[-lag_order:], steps=total_horizon)
        print(forecast)
        # Convert to dataframe
        df_forecast = pd.DataFrame(forecast, 
                        columns=df_scaled.columns, 
                        index=idx)
        # # Invert the transformations to bring it back to the original scale
        ## diff_order
        print(f"Applied differencing order: {diff_order}")
        df_forecast_original = self.df_inv_transformation(df_forecast, scaler, diff_order, first_elements)

        return df_forecast_original, results
    
    def test_var(self, data, data_keys, lag_order = 5, horizon=1):
        if len(data) == 0:
            raise APIException('The data for prediction is empty')
        if len(data) < horizon:
            raise APIException('Prediction horizon cannot be higher than the length of the analyzed data')
        if not(data_keys) or "date_key" not in data_keys or "value_keys" not in data_keys or len(data_keys["value_keys"]) == 0:
            raise APIException('Data fields for the analysis are not specified')
        try:
            date_key = data_keys["date_key"]
            value_keys = data_keys["value_keys"]
            df_input = pd.DataFrame.from_records(data, columns=[date_key] + value_keys)

            print(f"Duplicates: {df_input.duplicated().sum()} {len(df_input[date_key])}")
            df_input = df_input.drop_duplicates(subset=[date_key], keep='first')
            df_input.index = pd.DatetimeIndex(pd.to_datetime(df_input[date_key], unit="ms")) #.sort_index(ascending=True, inplace=False)
            df_input = df_input.drop(columns=[date_key])
            print(df_input)
            # ----
            cutoff_index = int(df_input.shape[0] * TRAIN_TEST_SPLIT_PROPORTION)
            df_train = df_input.iloc[:cutoff_index]
            df_test = df_input.iloc[cutoff_index:]
            print(f"Train data length: {df_train.shape}, test data length: {df_test.shape}")

        
            df_forecast_test_data, train_fit_model = self.run_forecast(df_train, df_test.shape[0], lag_order, 'aic')
            optimal_order = train_fit_model.k_ar
            print(f"Optimal order: {optimal_order}")
            df_forecast_future_data, real_fit_model = self.run_forecast(df_input, horizon, optimal_order)
            print("DF FORECAST FUTURE DATA")
            print(df_forecast_future_data)
            predicted_values = df_forecast_test_data[df_forecast_test_data.columns[0]].to_numpy()

            print(f"Evaluate:   {df_forecast_test_data.columns[0]} {df_test[df_forecast_test_data.columns[0]].to_numpy()} {predicted_values}")
            
            evaluation = {}
            for column in df_forecast_test_data.columns:
                predicted_values = df_forecast_test_data[column] #.to_numpy()
                test_values = df_test[column] #.to_numpy()
                evaluation[column] = forecast_accuracy(predicted_values, test_values)

            print(f"evaluation {evaluation}")

            test_json_result = df_forecast_test_data.to_json()
            real_json_result = df_forecast_future_data.to_json()

            print("REAL JSON RESULT: ")
            print(real_json_result)

            return {
                "testPrediction": json.loads(test_json_result),\
                "realPrediction": json.loads(real_json_result),\
                "evaluation": evaluation
            }
    
        except APIException as e:
            print(f"VAR prediction error: {e}")
            raise e
        except Exception as e:
            print(f"VAR prediction error: {str(e)}")
            raise APIException(str(e))