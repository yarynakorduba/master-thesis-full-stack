import React from 'react';
import Link from '@mui/material/Link';
import { List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';

const VARModelText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <Stack gap={1}>
        <Typography>
          The VAR(p) (Vector AutoRegression) model is a model, designed for
          predicting multiple time series at once. It considers that each
          variable in the series affects and is affected by the others. Key
          points:
          <List sx={{ width: '100%', maxWidth: 'lg' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Multivariate Time Series.</strong> Unlike AR, which
                predicts a single time series, VAR predicts multiple time series
                simultaneously.
                {'\n'}
                <em>Example:</em> Imagine we would like to predict both
                temperature and humidity, considering how they influence each
                other.
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Lagged Observations (p).</strong> The parameter 𝑝 p
                indicates how many past observations of each variable are used
                to predict the current value.
                {'\n'}
                <em>Example:</em> If 𝑝 = 2, we use the values from these last
                two time points to predict the next one.
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
        <Typography>
          <em>More real world examples where VAR model could be beneficial:</em>
          <List>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                Economics: To predict inflation and unemployment rates evolve
                together.
                {'\n'}
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                Disease Incidence and Vaccination Rates: To predict how the
                incidence of a disease and the rate of vaccinations change
                together.
                {'\n'}
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
        <Typography>
          If the time series is not a changing process with unstable mean and
          variance (nonstationary data), the app will try to convert it to a
          stable (stationary) process under the hood, and only then use VAR
          model to predict the future values.
        </Typography>
      </Stack>
    );
  }
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
        The parameter 𝑝 indicates the number of lagged observations of each
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
