import React from 'react';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import { Typography } from '@mui/material';

const LagOrderPText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          In an autoregressive model AR(p), the lag order variable p tells us
          how many past values of a variable we use to predict its future
          values. This method forecasts the variable of interest by looking at
          its own past data points.
        </Typography>
        <Typography>
          <em>Example:</em> If the lag order variable p is 3 in an AR(3) model,
          we use the last three days&apos; temperatures to predict today&apos;s
          temperature.
        </Typography>
        <Typography>
          Setting max lag order helps to avoid overly complex models, where too
          high lag order leads to overfitting. Overfitting happens when the
          model becomes too complex and captures noise in the data instead of
          the actual pattern.
        </Typography>
      </>
    );
  }

  return (
    <>
      <Typography>
        {' '}
        p variable denotes the order of an autoregressive component (AR).{' '}
        {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
        In an autoregression model AR(p), we forecast the variable of interest
        using a linear combination of past values of the variable. The term
        autoregression indicates that it is a regression of the variable against
        itself. In the model, parameter p is the number of past values (lag
        order) of a time series to consider for predicting the next value.
        {/* https://otexts.com/fpp2/AR.html */}
        {/* Lag order (or P variable), helps you control how much the model
  relies on past values to predict the current one. It&apos;s like
  adjusting how far back you want to look to make a good guess
  about today&apos;s weather.

  Setting min lag order helps to avoid considering overly simple
  models that might not predict future values well. */}
      </Typography>
      <Typography>
        Setting max lag order helps to avoid overly complex models, where too
        high lag order leads to overfitting. Overfitting happens when the model
        becomes too complex and captures noise in the data instead of the actual
        pattern.
      </Typography>
    </>
  );
};

export default LagOrderPText;
