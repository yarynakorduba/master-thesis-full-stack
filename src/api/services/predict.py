import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from api.services.analysis import Analysis


class Predict:
    def __init__(self):
        self = self

    def forecast_accuracy(self, forecast, actual):
        print(forecast)
        print("------------")
        print(actual)
        mape = np.mean(np.abs(forecast - actual)/np.abs(actual))  # MAPE
        me = np.mean(forecast - actual)             # ME
        mae = np.mean(np.abs(forecast - actual))    # MAE
        mpe = np.mean((forecast - actual)/actual)   # MPE
        rmse = np.mean((forecast - actual)**2)**.5  # RMSE
        # corr = np.corrcoef(forecast, actual)[0,1]   # corr
        # mins = np.amin(np.hstack([forecast[:,None], 
        #                         actual[:,None]]), axis=1)
        # maxs = np.amax(np.hstack([forecast[:,None], 
        #                         actual[:,None]]), axis=1)
        # minmax = 1 - np.mean(mins/maxs)             # minmax
        return({'mape':mape, 'me':me, 'mae': mae, 
                'mpe': mpe, 'rmse':rmse })

    
    def convert_data_to_stationary(self, df, max_diff_order=5):
        # how to deal with non linear non stationarity?
        # put an upper limit on the order
        df_diff = df.copy()
        print(df_diff.shape)
        diff_order = -1
        is_stationary = False
        while is_stationary == False and diff_order <= max_diff_order:
            diff_order += 1
            for i in range(len(df_diff.columns)):

                stationarityTestResult = Analysis().test_stationarity(df_diff[df_diff.columns[i]])
                is_stationary = stationarityTestResult["isStationary"]
                print(f'{df_diff.columns[i]} is_stationary -> {is_stationary}')
                if is_stationary == False:
                    break
            # Apply differencing to make data stationary
            df_diff = df_diff.diff().dropna()
        if not is_stationary:
            raise Exception(f"Differenced {max_diff_order} times and still non-stationary")
        return df_diff, diff_order

    def df_test_transformation(self, df, scaler):
        
        # df_diff, diff_order = self.convert_data_to_stationary(df)
        df_diff = df
        # Scale data using the previously defined scaler
        df_scaled = pd.DataFrame(scaler.fit_transform(df_diff.copy()), 
                            columns=df_diff.columns, 
                            index=df_diff.index)
        
        return df_scaled, 0 #diff_order
    
    def df_inv_transformation(self, pred, df_original, scaler):
        forecast = pred.copy()
        df_diff = pd.DataFrame(scaler.inverse_transform(forecast, copy=True), 
                        columns=forecast.columns, 
                        index=forecast.index)
        # columns = df_original.columns
        # for col in columns:
        #     df_diff[str(col)] = df_original[col][df_original.index < pred.index[0]].iloc[-1] + \
        #         df_diff[str(col)].cumsum()
        return df_diff
    
    def test_var(self, data):
        print("here")
        df_input = pd.DataFrame.from_records(data, columns=['timestamp', 'oxygen', 'co2'])

        df_input.index = pd.to_datetime(df_input['timestamp'], unit = 'ms')
        df_input = df_input.drop(columns=['timestamp'])
        print(df_input.head())
        # Is this ts unique? (check with pandas)
        scaler = StandardScaler()

        # # Apply function to our data
        df_scaled, diff_order = self.df_test_transformation(df_input, scaler)
        cutoff_index = int(df_scaled.shape[0] * 0.9)
        df_train = df_scaled.iloc[:cutoff_index]
        df_test = df_scaled.iloc[cutoff_index:]

        model = VAR(df_train)
        # Get optimal lag order based on the four criteria
        optimal_lags = model.select_order()

        print(f"The optimal lag order selected: {optimal_lags.selected_orders}")
        # Fit the model after selecting the lag order
        lag_order = 62 # optimal_lags.selected_orders['aic']
        results = model.fit(lag_order)

        # Estimate the model (VAR) and show summary
        # Forecast next two weeks
        horizon = 100
        def run_forecast(df_to_run_forecast_on, df_original):
            forecast = results.forecast(df_to_run_forecast_on.values[-lag_order:], steps=horizon)

            idx = pd.date_range(pd.to_datetime(df_to_run_forecast_on.iloc[-1:].index.item(), unit='ms'), periods=horizon, freq='120s')
            print(idx)
            # Convert to dataframe
            df_forecast = pd.DataFrame(forecast, 
                            columns=df_to_run_forecast_on.columns, 
                            index=idx)
            # # Invert the transformations to bring it back to the original scale
            df_forecast_original = self.df_inv_transformation(df_forecast, df_original, scaler)

            return df_forecast_original
        df_forecast_on_train_data = run_forecast(df_train, df_input)

        df_forecast_test_data = run_forecast(df_test, df_input)
    
        df_forecast_future_data = run_forecast(df_scaled, df_input)

        predicted_values = df_forecast_test_data[df_forecast_test_data.columns[0]]
        actual_values_df = df_input[df_input.index.isin(predicted_values.index)] 
        actual_values = actual_values_df[actual_values_df.columns[0]]

        evaluation_result = self.forecast_accuracy(predicted_values, actual_values)

        print("Evaluate: ")
        print(evaluation_result)
        
        json_result = df_forecast_future_data.to_json()
        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(json_result, f, ensure_ascii=False, indent=4)
        return json_result