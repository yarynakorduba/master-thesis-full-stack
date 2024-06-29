import { Typography } from '@mui/material';
import React from 'react';

const CausalRelationshipsText = () => {
  return (
    <>
      <Typography>
        To find the causal relationships between the data fields of the dataset,
        we perform pairwise Granger causality tests.
      </Typography>
      <Typography>
        Granger causality. Time series Y is said to Granger cause time series X
        if the prediction error variance of X at a present time can be reduced
        by additionally including the past values of Y, compared to only
        including the past values of X.
        {/* http://www.econ.uiuc.edu/~econ536/Papers/granger69.pdf */}
      </Typography>
    </>
  );
};

export default CausalRelationshipsText;
