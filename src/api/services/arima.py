import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from api.services.statistical_tests import Analysis
import pmdarima as pm


class Arima:
    def __init__(self):
        self = self

    def forecast_accuracy(self, forecast, actual):
        mape = np.mean(np.abs(forecast - actual)/np.abs(actual))  # MAPE
        me = np.mean(forecast - actual)             # ME
        mae = np.mean(np.abs(forecast - actual))    # MAE
        mpe = np.mean((forecast - actual)/actual)   # MPE
        rmse = np.mean((forecast - actual)**2)**.5  # RMSE

        return({'mape':mape, 'me':me, 'mae': mae, 
                'mpe': mpe, 'rmse':rmse })

    
    def convert_data_to_stationary(df):
        # how to deal with non linear non stationarity?
        # put an upper limit on the order
        df_diff = df.copy()
        diff_order = 0
        is_stationary = False
        diffs = [df_diff]
        while is_stationary == False:
            for i in range(len(df_diff.columns)):

                stationarityTestResult = Analysis.test_stationarity(df_diff[df_diff.columns[i]])
                is_stationary = stationarityTestResult["isStationary"]
                print('Column {0} stationarity: {1}'.format(df_diff.columns[i], is_stationary))
                if is_stationary == False:
                    break
            if is_stationary == False:
                print("is_stationary -> {0}, differenced {1} times".format(is_stationary, diff_order))
                diff_order += 1
                # Apply differencing to make data stationary
                df_diff = df_diff.copy().diff().dropna()
                diffs.append(df_diff)
            print(f"Diff order: {diff_order}")
            df_diff.plot()
        return df_diff, diff_order, diffs

    def df_test_transformation(self, df):
        
        df_diff, diff_order = self.convert_data_to_stationary(df)
        
        return df_diff, diff_order
    
    def arima_predict(self, data):
        print("here")
        # if data empty -> exit with error
        df_input = pd.DataFrame.from_records(data)
        df_input["date"] = pd.to_datetime(df_input['date'], unit = 'ms')
        df_input = df_input.set_index(df_input['date']).sort_index(ascending=True, inplace=False)
        df_input = df_input.drop(columns=['date'])
        print(df_input)
        size = int(len(df_input) - 40)
        train, test = df_input['value'][0:size], df_input['value'][size:len(df_input)]

        # Seasonal - fit stepwise auto-ARIMA
        smodel = pm.auto_arima(train, start_p=1, start_q=1,
                                test='adf',
                                max_p=1, max_q=1, m=12,
                                start_P=0, seasonal=True,
                                d=None, D=1, trace=True,
                                error_action='ignore',  
                                suppress_warnings=True, 
                                stepwise=True)


        # Forecast
        n_periods = 40
        fitted, confint = smodel.predict(n_periods=n_periods, return_conf_int=True)
        index_of_fc = pd.date_range(train.index[-1], periods = n_periods, freq='MS')
        # make series for plotting purpose
        print(fitted)
        print(index_of_fc)
        fitted_series = pd.Series(fitted, index=index_of_fc).dropna()

        json_result = fitted_series.to_json()
        print("-----")
        print(fitted_series)
        print(json_result)

        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(json_result, f, ensure_ascii=False, indent=4)

        return json_result