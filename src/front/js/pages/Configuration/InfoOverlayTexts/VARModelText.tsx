import React from 'react';
import Link from '@mui/material/Link';
import { Stack, Typography } from '@mui/material';

const VARModelText = () => {
  return (
    <Stack gap={1}>
      <Typography>
        <Link href="https://en.wikipedia.org/wiki/Vector_autoregression#:~:text=Vector%20autoregression%20(VAR)%20is%20a,allowing%20for%20multivariate%20time%20series.">
          VAR(p)
        </Link>{' '}
        (Vector AutoRegression) model is a generalisation of the univariate AR
        (AutoRegressive) model, extending it to predict multivariate time
        series.{' '}
        <Typography component="strong" fontWeight={600}>
          It assumes that each variable in the multivariate time series
          influences and is influenced by the others.
        </Typography>
      </Typography>{' '}
      <Typography>
        The parameter 𝑝 p indicates the number of lagged observations of each
        variable which influence the current observation.
      </Typography>
      <Typography>
        If the series are stationary, we forecast them by fitting a VAR to the
        data right away. If the time series are non-stationary, we take
        differences of the data in order to make them stationary, and then
        proceed with fit a VAR model.
        {/* https://otexts.com/fpp2/VAR.html#fn25 */}
        {/* a statistical model used to
  analyze the dynamic relationships among multiple time series
  variables. This model is useful when the variables in the time
  series influence each other. In a VAR model, each variable is
  modeled as a linear function of past values of itself and past
  values of all the other variables in the system. */}
        {/* VAR is bidirectional. */}
      </Typography>
    </Stack>
  );
};
export default VARModelText;
