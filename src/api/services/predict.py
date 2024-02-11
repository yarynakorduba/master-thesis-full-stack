import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
from sklearn.preprocessing import StandardScaler
from api.services.analysis import Analysis


class Predict:
    def __init__(self):
        self = self
    
    def convert_data_to_stationary(self, df):
        df_diff = df.copy()
        diff_order = -1
        is_stationary = False
        while is_stationary == False:
            diff_order += 1
            for i in range(len(df_diff.columns)):

                stationarityTestResult = Analysis().test_stationarity(df_diff[df_diff.columns[i]])
                is_stationary = stationarityTestResult["isStationary"]
                if is_stationary == False:
                    break
            print("is_stationary -> ")
            print(is_stationary)
            # Apply differencing to make data stationary
            df_diff = df_diff.diff().dropna()
        return df_diff, diff_order

    def df_test_transformation(self, df, scaler):
        
        df_diff, diff_order = self.convert_data_to_stationary(df)  


        # Scale data using the previously defined scaler
        df_scaled = pd.DataFrame(scaler.fit_transform(df_diff), 
                            columns=df_diff.columns, 
                            index=df_diff.index)
        return df_scaled, diff_order
    
    def df_inv_transformation(self, pred, df_original, scaler):
        forecast = pred.copy()
        df_diff = pd.DataFrame(scaler.inverse_transform(forecast), 
                        columns=forecast.columns, 
                        index=forecast.index)
        columns = df_original.columns
        for col in columns:
            df_diff[str(col)] = df_original[col][df_original.index < pred.index[0]].iloc[-1] + \
                df_diff[str(col)+"_pred"].cumsum()
        return df_diff
    
    def test_var(self, data):
        df_input = pd.DataFrame.from_dict({(i): data[i] 
                           for i in data.keys()},
                       orient='index')
        df_input.index = pd.to_datetime(df_input.index, unit = 'ms')

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
        lag_order = optimal_lags.selected_orders['aic']
        results = model.fit(lag_order)

        # Estimate the model (VAR) and show summary
        # print(df_train.values[-lag_order:])
        # Forecast next two weeks
        horizon = 100
        def run_forecast(df_to_run_forecast_on, df_original):
            forecast = results.forecast(df_to_run_forecast_on.values[-lag_order:], steps=horizon)

            # idx = pd.date_range('2015-01-01', periods=horizon, freq='MS')
            idx = pd.date_range(pd.to_datetime(df_to_run_forecast_on.iloc[-1:].index.item(), unit='ms'), periods=horizon, freq='120s')
            # Convert to dataframe
            df_forecast = pd.DataFrame(forecast, 
                            columns=df_to_run_forecast_on.columns + '_pred', 
                            index=idx)
            # # Invert the transformations to bring it back to the original scale
            df_forecast_original = self.df_inv_transformation(df_forecast, df_original, scaler)

            return df_forecast_original
        df_forecast_on_train_data = run_forecast(df_train, df_input)

        df_forecast_test_data = run_forecast(df_test, df_input)

        df_forecast_future_data = run_forecast(df_scaled, df_input)

        return df_forecast_test_data.to_json()