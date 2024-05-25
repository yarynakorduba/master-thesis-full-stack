import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from api.services.statistical_tests import Analysis

from api.utils import APIException, forecast_accuracy

TRAIN_TEST_SPLIT_PROPORTION = 0.9

class VARPrediction:
    def __init__(self):
        self = self
    
    def convert_data_to_stationary(self, df, max_diff_order=5):
        # how to deal with non linear non stationarity?
        # put an upper limit on the order
        df_diff = df.copy()
        diff_order = -1
        is_stationary = False
        while is_stationary == False and diff_order <= max_diff_order:
            diff_order += 1
            for i in range(len(df_diff.columns)):
                stationarityTestResult = Analysis().test_stationarity_kpss_adf(df_diff[df_diff.columns[i]])
                is_stationary = stationarityTestResult["kpss"]["isStationary"] and stationarityTestResult["adf"]["isStationary"]
                print(f'{df_diff.columns[i]} is_stationary -> {is_stationary}')
                if is_stationary == False:
                    break
            # Apply differencing to make data stationary
            df_diff = df_diff.diff().dropna()
        if not is_stationary:
            raise Exception(f"Differenced {max_diff_order} times and still non-stationary")
        return df_diff, diff_order

    def df_test_transformation(self, df, scaler):        
        df_diff, diff_order = self.convert_data_to_stationary(df)
        # Scale data using the previously defined scaler
        df_scaled = pd.DataFrame(scaler.transform(df_diff.copy()), 
                            columns=df_diff.columns, 
                            index=df_diff.index)
        
        return df_scaled, diff_order
    
    def df_inv_transformation(self, pred, df_original, scaler, diff_order):
        df_diff = pd.DataFrame(scaler.inverse_transform(pred.copy(), copy=True), 
                        columns=pred.columns, 
                        index=pred.index)
        df_transformed = df_diff.copy()
        for i in range(diff_order):
            df_transformed = df_transformed.cumsum() + df_original[df_original.index < df_transformed.index[0]].iloc[-1]
                
        return df_transformed
    
    def test_var(self, data, data_keys, lag_order = 5, horizon=1):
        if len(data) == 0:
            raise APIException('The data for prediction is empty')
        if len(data) < horizon:
            raise APIException('Prediction horizon cannot be higher than the length of the analyzed data')
        if not(data_keys) or "date_key" not in data_keys or "value_keys" not in data_keys or len(data_keys["value_keys"]) == 0:
            raise APIException('Data fields for the analysis are not specified')
        try:
            data_keys["value_keys"] = ["rain(mm)", "mosquito_Indicator"]
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

            # Estimate the model (VAR) and show summary
            # Forecast next two weeks
            def run_forecast(df_to_run_forecast_on, steps):
                # Is this ts unique? (check with pandas)
                scaler = StandardScaler()
                scaler.fit(df_to_run_forecast_on)
                # Apply function to our data
                df_train_scaled, diff_order = self.df_test_transformation(df_to_run_forecast_on, scaler)

                model = VAR(df_train_scaled)
                # Get optimal lag order based on the four criteria
                # optimal_lags = model.select_order(maxlags=lag_order,trend="ct")
                # print(f"The optimal lag order selected: {optimal_lags.selected_orders}")
                # Fit the model after selecting the lag order
                # optimal_lag_order = optimal_lags.selected_orders['aic']
                # print(f"Model fit to lag order {optimal_lags}")
                results = model.fit(lag_order)
                print(f"After fitting {results.k_ar}")
                total_horizon = steps
                # Do we need to add one more index here?
                inferred_freq = pd.infer_freq(df_train_scaled.index)
                print(f"Inferred frequency: {inferred_freq}")
                idx = pd.date_range(start=pd.to_datetime(df_train_scaled.iloc[-1:].index.item(), unit='ms'), periods=total_horizon + 1, freq=inferred_freq).delete(0) 
                print(f"predict STEPS {steps}")
                forecast = results.forecast(y=df_train_scaled.values[-lag_order:], steps=total_horizon)
                print(forecast)
                # Convert to dataframe
                df_forecast = pd.DataFrame(forecast, 
                                columns=df_train_scaled.columns, 
                                index=idx)
                # # Invert the transformations to bring it back to the original scale
                ## diff_order
                print(f"Applied differencing order: {diff_order}")
                df_forecast_original = self.df_inv_transformation(df_forecast, df_to_run_forecast_on, scaler, diff_order)

                return df_forecast_original            

            df_forecast_test_data = run_forecast(df_train, df_test.shape[0])
            df_forecast_future_data = run_forecast(df_input, horizon)
            # run_forecast(df_train, df_input, horizon)

            predicted_values = df_forecast_test_data[df_forecast_test_data.columns[0]].to_numpy()
            # actual_values_df = df_input[df_input.index.isin(predicted_values.index)] 
            # actual_values = actual_values_df[actual_values_df.columns[0]]

            print(f"Evaluate:   {df_forecast_test_data.columns[0]} {df_test[df_forecast_test_data.columns[0]].to_numpy()} {predicted_values}")
            
            evaluation = {}
            for column in df_forecast_test_data.columns:
                predicted_values = df_forecast_test_data[column].to_numpy()
                test_values = df_test[column].to_numpy()
                evaluation[column] = forecast_accuracy(predicted_values, test_values)

            print(f"evaluation {evaluation}")

            test_json_result = df_forecast_test_data.to_json()
            real_json_result = df_forecast_future_data.to_json()

            return {
                "testPrediction": json.loads(test_json_result),\
                "realPrediction": json.loads(real_json_result),\
                "evaluation": evaluation
            }
    
        except APIException as e:
            print(f"VAR prediction error: {e.message}")
            raise e
        except Exception as e:
            print(f"VAR prediction error: {str(e)}")
            raise APIException(str(e))