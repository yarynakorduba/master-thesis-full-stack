import pandas as pd
import numpy as np
import json
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
    
    # smodel = pm.auto_arima(train, start_p=1, start_q=1,
    #                     test='adf',
    #                     max_p=3,max_q=1, m=12,
    #                     start_P=0, seasonal=is_seasonal,
    #                     d=None, D=1, trace=True,
    #                     error_action='ignore',  
    #                     suppress_warnings=True, 
    #                     stepwise=True)
    
    def arima_predict(self, data, horizon=40, is_seasonal=False, min_p=0, max_p=0, min_q=0, max_q=0, periods_in_season=1):
        # TODO: if data empty -> exit with error
        df_input = pd.DataFrame.from_records(data)
        df_input["date"] = pd.to_datetime(df_input['date'], unit = 'ms')
        df_input = df_input.set_index(df_input['date']).sort_index(ascending=True, inplace=False)
        df_input = df_input.drop(columns=['date'])
        print(df_input)
        train_data_size = int(round(len(df_input) * 0.9))
        train, test = df_input['value'][0:train_data_size], df_input['value'][train_data_size:len(df_input)]

        print("Periods: ")
        print("-----$$$$$-----")
        # Seasonal - fit stepwise auto-ARIMA
        smodel = pm.auto_arima(train, start_p=min_p, start_q=min_q,
                                test='adf',
                                # TODO: why does ARIMA model intercept approx at 3 when we pass higher max_p / max_q
                                max_p=max_p,
                                max_q=max_q,
                                m=periods_in_season, # the number of periods in each season
                                start_P=0,
                                seasonal=is_seasonal,
                                d=None,
                                D=1,
                                trace=True,
                                error_action='ignore',
                                suppress_warnings=True, 
                                stepwise=True
                                )
        # Forecast
        test_prediction, test_confint = smodel.predict(n_periods=len(test), return_conf_int=True)
        # smodel.get_prediction()
        # TODO: move frequency to configurable params
        print(f"Frequency: {train.index.freq}")
        inferred_freq = pd.infer_freq(df_input.index)
        test_indexes = pd.date_range(test.index[0], periods = len(test), freq=inferred_freq) # month start frequency
        # make series for plotting purpose
        print(test_prediction)
        print(smodel.summary())
        test_predicted_series = pd.Series(test_prediction, index=test_indexes).dropna()
        json_result = test_predicted_series.to_json()
        parameters = smodel.get_params()
        print(f"Parameters: {parameters}")
        print(json_result)
        # --------------------------------------

        # test_prediction, test_confint = smodel.predict(n_periods=horizon, return_conf_int=True)
        # # TODO: move frequency to configurable params
        # test_indexes = pd.date_range(train.index[-1], periods = horizon, freq='MS') # month start frequency
        # # make series for plotting purpose
        # print(test_prediction)
        # print("=========")
        # print(smodel.summary())
        # test_predicted_series = pd.Series(test_prediction, index=test_indexes).dropna()
        # json_result = test_predicted_series.to_json()
        # parameters = smodel.get_params()
        # print("-----")
        # print(test_predicted_series)
        # print(json_result)

        # --------------------------------------

        with open('data.json', 'w', encoding='utf-8') as f:
            json.dump(json_result, f, ensure_ascii=False, indent=4)

        return {"prediction": json.loads(json_result),\
                "parameters": parameters,\
                "lastTrainPoint": {\
                    "date": df_input.index[train_data_size-1],\
                    "value": df_input['value'][train_data_size-1]\
                } }