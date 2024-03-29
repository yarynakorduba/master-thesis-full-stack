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
    
    SIGNIFICANT_P = 0.05
    def test_stationarity(data):
        # AIC - autolag parameter which automates
        # the selection of the lag length based on information criteria and penalises complex models.

        # ct - ct: It stands for "constant and trend."
        # The regression model includes both a constant (intercept) and a linear trend term.
        # H0: data is not stationary
        result = adfuller(data, autolag="AIC")#maxlag=maxlag, regression='ct')

        isStationary = False
        if (
            # result[0] < result[4]["1%"] and  and result[0] < result[4]["10%"]\
            result[0] < result[4]["5%"] and result[1] < SIGNIFICANT_P):
            isStationary = True
        else:
            isStationary = False
        
        return { "stationarity": result, "isStationary": isStationary }
    
    def test_granger_causality(self, data, dataKeys):
        maxlag = 24
        data_opposite_direction = [[x[1], x[0]] for x in data]
        # The data for testing whether the time series in the second column Granger
        # causes the time series in the first column
        result = grangercausalitytests(data, maxlag=[maxlag])
        result_opposite_direction = grangercausalitytests(data_opposite_direction, maxlag=[maxlag])
        # flip
        return [
                { "isCausal": (result[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "dataKeys": dataKeys }, \
                { "isCausal": (result_opposite_direction[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P, "dataKeys": [dataKeys[1], dataKeys[0]] } \
            ]

