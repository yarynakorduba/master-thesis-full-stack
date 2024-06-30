import { Typography, List, ListItem, ListItemText, Stack } from '@mui/material';
import React from 'react';
import Link from '@mui/material/Link';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';

const ARIMAModelText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <Stack gap={1}>
        <Typography>
          ARIMA (AutoRegressive Integrated Moving Average) model is a popular
          method for analyzing and forecasting time series data. It&apos;s
          mainly used to predict linear patterns in data over time. ARIMA has
          three main parts:
          <List sx={{ width: '100%', maxWidth: 'lg' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>AutoRegressive (AR).</strong> This part uses past values
                to predict the current value.
                {'\n'}
                <em>Example:</em> If we want to predict today’s temperature, we
                might look at the temperatures from the past few days to make
                our prediction.
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Integrated (I).</strong> This part helps the model work
                with both stable and changing (stationary and nonstationary)
                data by making the data stable.
                {'\n'}
                <em>Example:</em> If we’re looking at stock prices that keep
                increasing, we will convert them to be stable before predicting.
                For that we subtract each day’s price from the previous day’s to
                get the differences and make predictions on these differences.
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Moving Average (MA).</strong> This part uses past errors
                to improve the current prediction.
                {'\n'}
                <em>Example:</em> If our prediction was too high yesterday, we
                might adjust today&apos;s prediction based on that error to make
                it more accurate.
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={1}>
      <Typography>
        <Link href="https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average">
          ARIMA
        </Link>{' '}
        (AutoRegressive Integrated Moving Average) model is a widely used
        statistical method for analyzing and forecasting time series data. It is
        primarily designed to predict linear time series data. It can be broken
        down into 3 components:
        <List sx={{ width: '100%', maxWidth: 'lg' }}>
          <ListItem disableGutters disablePadding>
            <ListItemText>
              <Typography component="strong" fontWeight={600}>
                AutoRegressive (AR):
              </Typography>{' '}
              This component represents the current value of the process as a
              finite, linear aggregate of a certain number of previous values of
              the process plus a random shock.
              {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf, p.8 */}
              {/* relationship between an observation and a certain number
          of lagged observations (i.e., its own past values). It
          assumes that the current value of a series can be
          explained by its previous values.{' '} */}
            </ListItemText>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText>
              <Typography component="strong" fontWeight={600}>
                Integrated (I):
              </Typography>
              This component enables the model to handle both stationary and
              nonstationary processes. It applies differencing d times to a time
              series data to make it stationary. Usually, 𝑑 is 0, 1, or at most
              2, with 𝑑 = 0 corresponding to stationary behavior.
              {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
            </ListItemText>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText>
              <Typography component="strong" fontWeight={600}>
                Moving Average (MA):
              </Typography>
              This component expresses the current deviation of the process as a
              finite weighted sum of a certain number of previous deviations of
              the process plus a random shock.
              {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf, p.9 */}
            </ListItemText>
          </ListItem>
        </List>
      </Typography>
      {/* After providing the model parameters values in the form,
    different ARIMA (p, d, q) models are fitted to find out the best
    model for the monthly gold price. Moreover, to choose the best
    model for the data, the estimated model should be compared with
    other ARIMA models. The two common criteria, Bayesian
    Information Criteria (BIC) and Akaike’s Information Criterion
    (AIC), are defined by AIC = 2n−2ln(Lˆ) */}
      {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
    </Stack>
  );
};

export default ARIMAModelText;
