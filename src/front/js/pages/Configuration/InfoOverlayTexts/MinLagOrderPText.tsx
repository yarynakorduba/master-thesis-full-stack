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
          In an autoregressive model AR(p), the p variable tells us how many
          past values of a variable we use to predict its future values. This
          method forecasts the variable of interest by looking at its own past
          data points.
        </Typography>
        <Typography>
          <em>Example:</em> If p is 3 in an AR(3) model, we use the last three
          days&apos; temperatures to predict today&apos;s temperature.
        </Typography>
        <Typography>
          Setting min lag order helps to avoid considering overly simple models
          that might not predict future values well.
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
      </Typography>
      <Typography>
        Setting min lag order helps to avoid considering overly simple models
        that might not predict future values well.
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
