import { Typography } from '@mui/material';
import React from 'react';

const StationarityText = () => {
  return (
    <>
      <Typography>
        Stationary time series are the time series described by a model which
        assumes that the process remains in statistical equilibrium. The
        probabilistic properties of such a process do not change over time,
        specifically maintaining a fixed constant mean and a constant variance.
        {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
      </Typography>
      <Typography>
        Note: if the data is not stationary, the prediction tasks will try to
        convert it to stationary under the hood. For this, the program will
        apply differencing, run the tests and models on the differenced data,
        and inverse difference the prediction back to get the meaningful result.
      </Typography>
    </>
  );
};

export default StationarityText;
