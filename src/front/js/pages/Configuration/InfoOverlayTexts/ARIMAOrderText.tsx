import { Typography } from '@mui/material';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import React from 'react';
import OpenAIDisclaimer from './OpenAIDisclaimer';

const ARIMAOrderText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          Here, order refers to the best ARIMA(p, d, q) settings the model
          selected considering the min / max values you provided in the form.
          The p, d, and q are numbers that tell the model how much past data to
          use, how to smooth out changes, and how to adjust for past errors.
        </Typography>
        <Typography>
          The model tested different combinations of these numbers and picked
          the one that works best. It used a special criterion called Akaike
          Information Criterion AIC to help find the best settings. The lower
          the AIC score, the better the model.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }

  return (
    <>
      <Typography>
        Here, order refers to the optimal ARIMA(p, d, q) parameters which the
        model selected considering the min / max values you provided in the
        form. The parameters p, d, and q represent the autoregressive order (p),
        the degree of differencing (d), and the moving average order (q),
        respectively.
      </Typography>
      <Typography>
        To identify the optimal parameters, the model used Akaike Information
        Criterion (AIC), which evaluates model performance based on goodness of
        fit and complexity. Lower AIC values indicate better model performance,
        balancing accuracy and simplicity.
      </Typography>
    </>
  );
};

export default ARIMAOrderText;
