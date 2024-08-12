import React from 'react';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import { Divider, Typography } from '@mui/material';
import OpenAIDisclaimer from './OpenAIDisclaimer';
import Cite from './Cite';

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
        <OpenAIDisclaimer />
      </>
    );
  }

  return (
    <>
      <Typography>
        {' '}
        p variable denotes the order of an autoregressive component (AR). In an
        autoregression model AR(p), we forecast the variable of interest using a
        linear combination of past values of the variable. The term
        autoregression indicates that it is a regression of the variable against
        itself. In the model, parameter p is the number of past values (lag
        order) of a time series to consider for predicting the next value{' '}
        <Cite index={1} />.{/* https://otexts.com/fpp2/AR.html */}
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
      <Divider />
      <Cite.Source index={1}>
        Hyndman, R. J., & Athanasopoulos, G. (2018). Forecasting: principles and
        practice (2nd ed). OTexts.
      </Cite.Source>
    </>
  );
};

export default LagOrderPText;
