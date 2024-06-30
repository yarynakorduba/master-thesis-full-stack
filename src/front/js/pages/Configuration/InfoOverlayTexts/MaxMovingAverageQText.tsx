import React from 'react';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import { Typography } from '@mui/material';

const MinMovingAverageQText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          The max q value which ARIMA should explore in combinations with the
          other variables to find the optimal model.
        </Typography>
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
          Setting max q helps us avoid the overly complex models with bad
          accuracy. If q is too high, the model might use too many past errors
          and get confused by noise instead of finding real patterns.
        </Typography>
        <Typography>
          Additionally, if you don&apos;t set limits, ARIMA might try too many
          parameter combinations, which takes a long time. Setting min and max q
          helps it work faster.
        </Typography>
      </>
    );
  }

  return (
    <>
      {/* Q variable indicates how much the current observation is
  influenced by prediction errors made by the model for previous
  values. */}
      <Typography>
        The max q value which ARIMA should explore in combinations with the
        other variables to find the optimal model.
      </Typography>
      <Typography>
        q variable denotes the order of a moving average component of ARIMA
        model.
        {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
      </Typography>
      <Typography>
        By setting max q value to check, you ensure that ARIMA does not consider
        overly complex models that incorporate too many past error terms and
        capture noise rather than the underlying data structure.
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

export default MinMovingAverageQText;
