import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';

const StationarityText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();
  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          A stationary time series is like a stable, predictable process.
          Imagine a process where nothing about its behavior changes as time
          passes. The key points of stationarity are:
          <List sx={{ width: '100%', maxWidth: 'lg' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Fixed Mean.</strong> The average value doesn’t change
                over time.{' '}
                <Typography>
                  <em>Example:</em> If we measure the temperature at noon every
                  day in a city where the climate is very stable, the average
                  temperature might stay around 25°C every day.
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Constant Variance.</strong> The variability around the
                mean is consistent.{' '}
                <Typography>
                  <em>Example:</em> In the same city, the daily temperature
                  might only vary by ±2°C from the average, consistently
                  throughout the year.
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
      </>
    );
  }
  return (
    <>
      <Typography>
        Stationary time series are the time series described by a model which
        assumes that the process remains in statistical equilibrium. The
        probabilistic properties of such a process do not change over time,
        specifically maintaining a fixed constant mean and a constant variance.
        {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
      </Typography>
      <Typography>
        Note: if the data is not stationary, the prediction tasks will try to
        convert it to stationary under the hood. For this, the program will
        apply differencing, run the tests and models on the differenced data,
        and inverse difference the prediction back to get the meaningful result.
      </Typography>
    </>
  );
};

export default StationarityText;
