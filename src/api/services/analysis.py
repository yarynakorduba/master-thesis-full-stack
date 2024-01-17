import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.stattools import grangercausalitytests

SIGNIFICANT_P = 0.05

class Analysis():
    def test_white_noise(data):
        # If lags is None: The test will include autocorrelation up to a default maximum lag.
        # The default maximum lag is often determined based on the size of the data.
        result = diag.acorr_ljungbox(data, boxpierce=True, model_df=0, period=None, return_df=None)
        return { "isWhiteNoise": bool(result.iloc[-1, 1] >= SIGNIFICANT_P) }
    
    def test_stationarity(data):
        result = adfuller(data, autolag='AIC', regression='ct')
        isStationary = False
        if (result[0] < result[4]["1%"] and result[0] < result[4]["5%"] and result[0] < result[4]["10%"]\
            and result[1] < SIGNIFICANT_P):
            isStationary = True
        else:
            isStationary = False
        
        return { "stationarity": result, "isStationary": isStationary }
    
    def test_granger_causality(data):
        maxlag = 24
        result = grangercausalitytests(data, maxlag=[maxlag])
        print(result)
        return { "isCausal": (result[maxlag][0]["ssr_ftest"][1]).item() < SIGNIFICANT_P }

