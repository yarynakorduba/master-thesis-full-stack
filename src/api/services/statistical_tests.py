import numpy as np
import pandas as pd
from pmdarima.arima.utils import ndiffs
import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import grangercausalitytests
from itertools import combinations

from api.utils import APIException

SIGNIFICANT_P = 0.05

class StatisticalTests():
    def __init__(self):
        self = self

    def test_white_noise(self, data, key, period=None, max_lag_order=None):
        try:
            # If lags is None: The test will include autocorrelation up to a default maximum lag.
            # The default maximum lag is often determined based on the size of the data.
            # H0: The time series data are white noise.
            result = diag.acorr_ljungbox(data, model_df=0, period=period, return_df=None, auto_lag=True, lags=max_lag_order)
            return {
                "key": key,\
                "isWhiteNoise": bool(result.iloc[-1,1] >= SIGNIFICANT_P)
            }
        except APIException as e:
            print(f"White noise error: {e}")
            raise e
        except Exception as e:
            print(f"White noise error: {str(e)}")
            raise APIException(str(e))
    
    def multitest_white_noise(self, data, data_keys, period=None, max_lag_order=None):
        try:
            if period != None and period < 1:
                raise APIException(str("Periods in season, if present, should be a positive integer"))
            elif period == 1:
                period = None
            results = []
            # If lags is None: The test will include autocorrelation up to a default maximum lag.
            # The default maximum lag is often determined based on the size of the data.
            for key in data_keys:
                data_to_analyze = [datum[key] for datum in data]
                print(f"Key: {key}")
                result = self.test_white_noise(data_to_analyze, key, period, max_lag_order)
                print(f'Result: {result}')
                results.append(result)
            return results
        except APIException as e:
            print(f"Multitest white noise error: {e}")
            raise e
        except Exception as e:
            print(f"Multitest white noise error: {str(e)}")
            raise APIException(str(e))
    

    # H0: The time series has a unit root (is non-stationary)
    # p < 0.05 - we reject H0, it means that the data is stationary
    # p >= 0.05 - we prove H0, it means that the data is NOT stationary

    def test_stationarity_adf_pmdarima(self, data):
        # Estimate the number of differences using an ADF test:
        n_diffs = ndiffs(np.array(data), test='adf')  # -> 0
        print(f"Stationarity: ADF Test result: should be differenced {n_diffs}")
        return { "isStationary": n_diffs > 0, "ndiffs": n_diffs }

    def test_stationarity_kpss_adf(self, data):
        # Estimate the number of differences using an ADF test:
        kpss_n_diffs = ndiffs(np.array(data).astype(float), test='kpss', max_d=2)  # -> 0
        print(f"Stationarity: KPSS Test result: should be differenced {kpss_n_diffs}")

        adf_n_diffs = ndiffs(np.array(data).astype(float), test='adf', max_d=2)  # -> 0
        print(f"Stationarity: ADF Test result: should be differenced {adf_n_diffs}")

        return {
            "kpss": { "isStationary": kpss_n_diffs == 0, "ndiffs": kpss_n_diffs },\
            "adf" : { "isStationary": adf_n_diffs == 0, "ndiffs": adf_n_diffs },
        }

    # The Null hypothesis for grangercausalitytests is that the time series in
    # the second column, x2, does NOT Granger cause the time series in the first
    # column, x1.
    def test_granger_causality(self, data, data_key_pair, max_lag_order):
        try:
            if max_lag_order == None or max_lag_order < 1:
                raise APIException("Max lag order should be a positive integer")
            data_opposite_direction = [[x[1], x[0]] for x in data]
            # The data for testing whether the time series in the second column Granger
            # causes the time series in the first column
            result = grangercausalitytests(data, maxlag=[max_lag_order])
            result_opposite_direction = grangercausalitytests(data_opposite_direction, maxlag=[max_lag_order])
            # flip
            return [
                    { "isCausal": (result[max_lag_order][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "source": data_key_pair[1], "target": data_key_pair[0]  }, \
                    { "isCausal": (result_opposite_direction[max_lag_order][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "source": data_key_pair[0], "target": data_key_pair[1]  } \
                ]
        except APIException as e:
            print(f"Multitest granger causality error: {e}")
            raise e
        except Exception as e:
            print(f"Multitest granger causality error: {str(e)}")
            raise APIException(str(e))
    
    def multitest_granger_causality(self, data, data_keys, max_lag_order):
        try:
            if max_lag_order == None or max_lag_order < 1:
                raise APIException("Max lag order should be a positive integer")
            data_df = pd.DataFrame(data)[data_keys]
            stationary_data = self.convert_data_to_stationary(data_df)
            data_pairs = list(combinations(data_keys, 2))
            results = []
            for pair in data_pairs:
                data_for_pair = stationary_data[0][[pair[0], pair[1]]].values
                result = self.test_granger_causality(data_for_pair, [pair[0], pair[1]], max_lag_order)
                results.append(result)
            return results
        except APIException as e:
            print(f"Multitest granger causality error: {e}")
            raise e
        except Exception as e:
            print(f"Multitest granger causality error: {str(e)}")
            raise APIException(str(e))
    
    
    def convert_data_to_stationary(self, df):
        df_diff = df.copy()
        first_elements = []

        def check_all_stationarities(df):
            selected_ndiffs = 0
            is_stationary = False
            for i in range(len(df.columns)):
                stationarity_test_result = self.test_stationarity_kpss_adf(df[df.columns[i]])
                is_stationary = stationarity_test_result["kpss"]["isStationary"] and stationarity_test_result["adf"]["isStationary"]
                selected_ndiffs = np.max([stationarity_test_result["kpss"]["ndiffs"], stationarity_test_result["adf"]["ndiffs"]])
                print(f'{df.columns[i]} is_stationary -> {is_stationary} {selected_ndiffs}')
            return is_stationary, selected_ndiffs
        
        is_stationary, selected_ndiffs = check_all_stationarities(df_diff)
        print(f"Selected ndiffs {selected_ndiffs}")
        # Apply differencing to make data stationary
        for i in range(selected_ndiffs):
            first_elements.append(df_diff.iloc[-1-i])
            df_diff = df_diff.diff().dropna()

        is_stationary = check_all_stationarities(df_diff)

        if not is_stationary:
            warning = f"Differenced {selected_ndiffs} times and still non-stationary"
            print(f"Warn: {warning}")

        return df_diff, selected_ndiffs, is_stationary, first_elements


