import statsmodels.stats.diagnostic as diag
from random import gauss

class Analysis():
    def detect_white_noise(data):
        random_data = [gauss(0.0, 1.0) for i in range(1000)]
        result = diag.acorr_ljungbox(random_data, lags=[40], boxpierce=True, model_df=0, period=None, return_df=None)
        return (result["lb_pvalue"] > 0.05)