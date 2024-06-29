import { Typography } from '@mui/material';
import React from 'react';

const CausalityMaxLagOrderText = () => {
  return (
    <>
      <Typography>
        The causality lag order m is defined as the smallest integer k at which
        past k values of time series Y start to provide significant information
        in predicting time series X. Before this lag, the inclusion of past
        values of Y does not contribute to improving the prediction of X.
        {/* http://www.econ.uiuc.edu/~econ536/Papers/granger69.pdf */}
      </Typography>
      <Typography>
        In Max lag order field, please provide the maximum number of lags which
        should be tested to find the optimal causality lag. The number should be
        a positive integer.
      </Typography>
    </>
  );
};

export default CausalityMaxLagOrderText;
