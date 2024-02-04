import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from statsmodels.tsa.vector_ar.var_model import VAR
import pandas as pd
from sklearn.preprocessing import StandardScaler

SIGNIFICANT_P = 0.05

class Analysis():
    def __init__(self):
        self = self

    def test_white_noise(self, data):
        # If lags is None: The test will include autocorrelation up to a default maximum lag.
        # The default maximum lag is often determined based on the size of the data.
        result = diag.acorr_ljungbox(data, boxpierce=True, model_df=0, period=None, return_df=None)
        return { "isWhiteNoise": bool(result.iloc[-1, 1] >= SIGNIFICANT_P) }
    
    def test_stationarity(self, data):
        # AIC - autolag parameter which automates
        # the selection of the lag length based on information criteria
        # and penalises complex models.

        # ct - ct: It stands for "constant and trend."
        # The regression model includes both a constant (intercept) and a linear trend term.
        result = adfuller(data, autolag='AIC', regression='ct')
        isStationary = False
        if (result[0] < result[4]["1%"] and result[0] < result[4]["5%"] and result[0] < result[4]["10%"]\
            and result[1] < SIGNIFICANT_P):
            isStationary = True
        else:
            isStationary = False
        
        return { "stationarity": result, "isStationary": isStationary }
    
    def test_granger_causality(self, data):
        maxlag = 24
        result = grangercausalitytests(data, maxlag=[maxlag])
        return { "isCausal": (result[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P }


    def test_var(self, data):
        print("KEYS")
        for i in data.keys():
            print(i)
        df_input = pd.DataFrame.from_dict({(i): data[i] 
                           for i in data.keys()},
                       orient='index')
        print(df_input)
        print("-----")
        df_input.index = pd.to_datetime(df_input.index, unit = 'ms')
        print(df_input)
        # pd.Timestamp((np.fromstring(i, dtype=np.uint16)), unit="ms")
        # df_diff = df_train.diff().dropna()
        scaler = StandardScaler()
        # Define function for data transformation
        def df_test_transformation(df, scaler):
            
            # Apply differencing to make data stationary
            df_diff = df.diff().dropna()
            # Scale data using the previously defined scaler
            df_scaled = pd.DataFrame(scaler.fit_transform(df_diff), 
                                columns=df_diff.columns, 
                                index=df_diff.index)
            return df_scaled

        # # Apply function to our data
        df_scaled = df_test_transformation(df_input, scaler)
        cutoff_index = int(df_scaled.shape[0] * 0.9)
        df_train = df_scaled.iloc[:cutoff_index]
        df_test = df_scaled.iloc[cutoff_index:]

        # Define function for inverting data transformation
        def df_inv_transformation(df_processed, df, scaler):
            # Invert StandardScaler transformation
            df_diff = pd.DataFrame(scaler.inverse_transform(df_processed), 
                                        columns=df_processed.columns, 
                                        index=df_processed.index)
            print("AAAAAAAAA!@#$%^&######################")
            print(df)
            print("---")
            print(df_processed)
            print("$$$$$", df_diff)
            print(df[df.index < df_diff.index[0]])
            # Invert differenting
            df_original = df_diff.cumsum() + df[df.index < df_diff.index[0]].iloc[-1]    
            return df_original
        
        model = VAR(df_train)
        # Get optimal lag order based on the four criteria
        optimal_lags = model.select_order()

        print(f"The optimal lag order selected: {optimal_lags.selected_orders}")
        # Fit the model after selecting the lag order
        lag_order = optimal_lags.selected_orders['aic']
        results = model.fit(lag_order)

        # Estimate the model (VAR) and show summary
        print(df_train.values[-lag_order:])
        # Forecast next two weeks
        horizon = 100
        def run_forecast(df_to_run_forecast_on, df_original):
            forecast = results.forecast(df_to_run_forecast_on.values[-lag_order:], steps=horizon)

            # idx = pd.date_range('2015-01-01', periods=horizon, freq='MS')
            idx = pd.date_range(pd.to_datetime(df_to_run_forecast_on.iloc[-1:].index.item(), unit='ms'), periods=horizon, freq='120s')
            # Convert to dataframe
            df_forecast = pd.DataFrame(forecast, 
                            columns=df_to_run_forecast_on.columns, 
                            index=idx)
            print("~DF DORECASR!!!!")
            print(df_forecast)
            print("--------------ORIGINAL!!!")

            # # Invert the transformations to bring it back to the original scale
            df_forecast_original = df_inv_transformation(df_forecast, df_original, scaler)
            print("ORIGINAL!!!")
            print(df_forecast_original)
            return df_forecast_original
        
        df_forecast_on_train_data = run_forecast(df_train, df_input)
        print("0-- TRAIN --- 0 ")
        print(df_forecast_on_train_data)

        df_forecast_test_data = run_forecast(df_test, df_input)
        print("0-- TEST --- 0 ")
        print(df_forecast_test_data)

        df_forecast_future_data = run_forecast(df_scaled, df_input)
        print("0-- df_forecast_future_data --- 0 ")
        print(df_forecast_future_data)

        return df_forecast_future_data.to_json()