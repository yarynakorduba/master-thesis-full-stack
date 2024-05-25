import numpy as np
from pmdarima.arima.utils import ndiffs
import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests
from itertools import combinations

SIGNIFICANT_P = 0.05

class Analysis():
    def __init__(self):
        self = self

    def test_white_noise(self, data):
        # If lags is None: The test will include autocorrelation up to a default maximum lag.
        # The default maximum lag is often determined based on the size of the data.
        result = diag.acorr_ljungbox(data, boxpierce=True, model_df=0, period=None, return_df=None)
        return { "isWhiteNoise": bool(result.iloc[-1, 1] >= SIGNIFICANT_P) }
    
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
        kpss_n_diffs = ndiffs(np.array(data).astype(float), test='kpss', max_d=5)  # -> 0
        print(f"Stationarity: KPSS Test result: should be differenced {kpss_n_diffs}")

        adf_n_diffs = ndiffs(np.array(data).astype(float), test='adf', max_d=5)  # -> 0
        print(f"Stationarity: ADF Test result: should be differenced {adf_n_diffs}")

        return {
                 "kpss": { "isStationary": kpss_n_diffs == 0, "ndiffs": kpss_n_diffs },\
                 "adf" : { "isStationary": adf_n_diffs == 0, "ndiffs": adf_n_diffs },
            }


    def test_stationarity(self, data):
        # AIC - autolag parameter which automates
        # the selection of the lag length based on information criteria and penalises complex models.

        # ct - ct: It stands for "constant and trend."
        # The regression model includes both a constant (intercept) and a linear trend term.
        # H0: data is not stationary
        result = adfuller(data, autolag="AIC", regression='ct')
        print(result)
        isStationary = False
        if (
            # result[0] < result[4]["1%"] and  and result[0] < result[4]["10%"]\
            result[0] <= result[4]["5%"] and result[1] < SIGNIFICANT_P):
            isStationary = True
        else:
            isStationary = False
        
        return { "stationarity": result, "isStationary": isStationary }
    
    # The Null hypothesis for grangercausalitytests is that the time series in
    # the second column, x2, does NOT Granger cause the time series in the first
    # column, x1.
    def test_granger_causality(self, data, data_key_pair):
        maxlag = 24
    
        data_opposite_direction = [[x[1], x[0]] for x in data]
        # The data for testing whether the time series in the second column Granger
        # causes the time series in the first column
        result = grangercausalitytests(data, maxlag=[maxlag])
        result_opposite_direction = grangercausalitytests(data_opposite_direction, maxlag=[maxlag])
        # flip
        return [
                { "isCausal": (result[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "source": data_key_pair[1], "target": data_key_pair[0]  }, \
                { "isCausal": (result_opposite_direction[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "source": data_key_pair[0], "target": data_key_pair[1]  } \
            ]
    
    def multitest_granger_causality(self, data, data_keys):
        data_pairs = list(combinations(data_keys, 2))
        results = []
        for pair in data_pairs:
            data_for_pair = [[datum[pair[0]], datum[pair[1]]] for datum in data]
            print(data_for_pair)
            result = self.test_granger_causality(data_for_pair, [pair[0], pair[1]])
            print(f'Result: {result}')
            results.append(result)
        return results


