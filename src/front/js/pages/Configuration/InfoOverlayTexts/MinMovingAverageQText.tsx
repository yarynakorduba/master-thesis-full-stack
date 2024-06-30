import React from 'react';
import { Typography } from '@mui/material';

import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';

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
      </>
    );
  }

  return (
    <>
      <Typography>
        q variable denotes the order of a moving average component of ARIMA
        model.
        {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
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
