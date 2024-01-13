import statsmodels.stats.diagnostic as diag

SIGNIFICANT_P = 0.05

class Analysis():
    def detect_white_noise(data):
        lags = 100
        result = diag.acorr_ljungbox(data, lags=[lags], boxpierce=True, model_df=0, period=None, return_df=None)
        return {"isWhiteNoise": bool(result.loc[lags, "lb_pvalue"] >= SIGNIFICANT_P)}