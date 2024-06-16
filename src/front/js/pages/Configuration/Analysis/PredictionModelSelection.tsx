import React from 'react';
import { isEmpty } from 'lodash';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Grid, Tooltip } from '@mui/material';

import { EPredictionMode } from './types';

import {
  useGetPredictionHistory,
  useIsHistoryDrawerOpen,
} from '../../../store/currentConfiguration/selectors';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';

type TProps = {
  readonly predictionMode: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;
  readonly isDisabled: boolean;
};
const PredictionModelSelection = ({
  predictionMode,
  setPredictionMode,
  isDisabled,
}: TProps) => {
  const [isHistoryOpen, setIsHistoryDrawerOpen] = useIsHistoryDrawerOpen();
  const predictionHistory = useGetPredictionHistory();

  return (
    <>
      <Typography variant="h5">
        Prediction{' '}
        {!isEmpty(predictionHistory) && (
          <ToggleButton
            sx={{ ml: 2, paddingTop: 0.5, paddingBottom: 0.5 }}
            size="small"
            color="primary"
            selected={isHistoryOpen}
            value={true}
            onChange={() => setIsHistoryDrawerOpen(!isHistoryOpen)}
          >
            History
          </ToggleButton>
        )}
      </Typography>
      <Grid item md={12}>
        <Tooltip title="Select a model for prediction">
          <ToggleButtonGroup
            value={predictionMode}
            exclusive
            onChange={(e, value) => setPredictionMode(value)}
            aria-label="text alignment"
            size="small"
            disabled={isDisabled}
          >
            <ToggleButton
              value={EPredictionMode.ARIMA}
              aria-label="left aligned"
              sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              ARIMA model
            </ToggleButton>
            <ToggleButton
              value={EPredictionMode.VAR}
              aria-label="right aligned"
              sx={{ ml: 2, paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              VAR model
            </ToggleButton>
          </ToggleButtonGroup>
        </Tooltip>
        <InfoOverlay
          id="More about the model"
          label="More about the model"
          sx={{ ml: 2 }}
        >
          <InfoOverlay.Popover>
            {predictionMode === EPredictionMode.ARIMA ? (
              <div>
                <Typography>
                  <Link href="https://en.wikipedia.org/wiki/Autoregressive_integrated_moving_average">
                    ARIMA
                  </Link>{' '}
                  (AutoRegressive Integrated Moving Average) model is a widely
                  used statistical method for analyzing and forecasting time
                  series data. It is primarily designed to predict linear time
                  series data. It can be broken down into 3 components:
                </Typography>
                <List sx={{ width: '100%', maxWidth: 'lg' }}>
                  <ListItem disableGutters>
                    <ListItemText>
                      AR: This component represents the relationship between an
                      observation and a certain number of lagged observations
                      (i.e., its own past values). It assumes that the current
                      value of a series can be explained by its previous values.{' '}
                    </ListItemText>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText>
                      Integrated (I): This component indicates the differencing
                      of raw observations to make the time series stationary.
                      Stationarity is important because many time series
                      forecasting methods assume that the underlying time series
                      is stationary.
                    </ListItemText>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText>
                      Moving Average (MA): This component models the
                      relationship between an observation and a residual error
                      from a moving average model applied to lagged
                      observations. It captures the short-term fluctuations in
                      the data. (AutoRegressive.)
                    </ListItemText>
                  </ListItem>
                </List>
              </div>
            ) : (
              <div>
                <Link href="https://en.wikipedia.org/wiki/Vector_autoregression#:~:text=Vector%20autoregression%20(VAR)%20is%20a,allowing%20for%20multivariate%20time%20series.">
                  VAR
                </Link>{' '}
                (Vector AutoRegression) model is a statistical model used to
                analyze the dynamic relationships among multiple time series
                variables. This model is useful when the variables in the time
                series influence each other. In a VAR model, each variable is
                modeled as a linear function of past values of itself and past
                values of all the other variables in the system.
                {/* VAR is bidirectional. */}
              </div>
            )}
          </InfoOverlay.Popover>
        </InfoOverlay>
      </Grid>
    </>
  );
};

export default PredictionModelSelection;
