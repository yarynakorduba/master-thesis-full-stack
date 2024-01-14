import statsmodels.stats.diagnostic as diag

SIGNIFICANT_P = 0.05

class Analysis():
    def detect_white_noise(data):
        # If lags is None: The test will include autocorrelation up to a default maximum lag.
        # The default maximum lag is often determined based on the size of the data.
        # lags = None
        # print(data)
        result = diag.acorr_ljungbox(data, boxpierce=True, lags=100, model_df=0, period=None, return_df=None)
        print(result)
        # return {"isWhiteNoise": bool(result.loc[lags, "lb_pvalue"] >= SIGNIFICANT_P)}