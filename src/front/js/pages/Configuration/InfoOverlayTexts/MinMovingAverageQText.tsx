import React from 'react';
import { Typography } from '@mui/material';

import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import OpenAIDisclaimer from './OpenAIDisclaimer';

const MovingAverageQText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          The q variable tells us how many past prediction errors to consider
          while predicting the current value.
        </Typography>
        <Typography>
          <em>Example:</em> Think of it like adjusting today’s weather forecast
          based on how accurate your past forecasts were. If q is 2, you look at
          the errors from the last two days to make today’s forecast better.
        </Typography>
        <Typography>
          If you don’t use enough past experiences (like only remembering the
          last mistake you made while baking), you might not improve much.
          Setting a minimum q variable ensures you don&apos;t use overly simple
          models and consider enough past errors to make better predictions.
        </Typography>
        <Typography>
          Additionally, if you don&apos;t set limits, the model might try too
          many options, which takes a long time. Setting min and max q helps it
          work faster.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }

  return (
    <>
      <Typography>
        q variable denotes the order of a moving average component of ARIMA
        model.
      </Typography>
      <Typography>
        Setting a lower limit for q ensures we don&apos;t take into account
        overly simple models and consider enough past errors to capture
        meaningful patterns while also improving accuracy.
      </Typography>
      <Typography>
        Additionally, searching through a large range of q values to find the
        optimal one can be computationally expensive and time-consuming. By
        setting min and max q, you constrain the search space, making the model
        fitting process more efficient and faster.
      </Typography>
    </>
  );
};

export default MovingAverageQText;
