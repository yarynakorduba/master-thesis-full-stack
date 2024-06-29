import React from 'react';

const LagOrderPText = () => {
  return (
    <>
      {' '}
      p variable denotes the order of an autoregressive component (AR).
      {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
      In an autoregression model AR(p), we forecast the variable of interest
      using a linear combination of past values of the variable. The term
      autoregression indicates that it is a regression of the variable against
      itself. In the model, parameter p is the number of past values (lag order)
      of a time series to consider for predicting the next value.
      {/* https://otexts.com/fpp2/AR.html */}
      {/* Lag order (or P variable), helps you control how much the model
  relies on past values to predict the current one. It&apos;s like
  adjusting how far back you want to look to make a good guess
  about today&apos;s weather.
  <br />
  <br />
  Setting min lag order helps to avoid considering overly simple
  models that might not predict future values well. */}
    </>
  );
};

export default LagOrderPText;
