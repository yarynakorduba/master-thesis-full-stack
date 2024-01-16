import statsmodels.stats.diagnostic as diag
from statsmodels.tsa.stattools import adfuller

SIGNIFICANT_P = 0.05

class Analysis():
    def test_white_noise(data):
        # If lags is None: The test will include autocorrelation up to a default maximum lag.
        # The default maximum lag is often determined based on the size of the data.
        result = diag.acorr_ljungbox(data, boxpierce=True, model_df=0, period=None, return_df=None)
        print(result)
        return { "isWhiteNoise": bool(result.iloc[-1, 1] >= SIGNIFICANT_P) }
    
    def test_stationarity(data):
        result = adfuller(data, autolag='AIC', regression='ct')
        print(result)
        print(result[0])
        isStationary = False
        if (result[0] < result[4]["1%"] and result[0] < result[4]["5%"] and result[0] < result[4]["10%"]\
            and result[1] < SIGNIFICANT_P):
            isStationary = True
        else:
            isStationary = False
        
        return { "stationarity": result, "isStationary": isStationary }

