import React from 'react';
import { isEmpty } from 'lodash';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from '@mui/material/Link';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Divider, Grid, Stack, Tooltip } from '@mui/material';

import { EPredictionMode } from './types';

import {
  useConfigData,
  useGetPredictionHistory,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
} from '../../../store/currentConfiguration/selectors';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import PredictionInfoText from './PredictionInfoText';

type TProps = {
  readonly predictionMode: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;
};
const PredictionModelSelection = ({
  predictionMode,
  setPredictionMode,
}: TProps) => {
  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const [isHistoryOpen, setIsHistoryDrawerOpen] = useIsHistoryDrawerOpen();
  const predictionHistory = useGetPredictionHistory();

  const { valueProperties } = useConfigData();

  return (
    <>
      <Typography variant="h5" display="flex">
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
        <Divider
          sx={{ margin: 1 }}
          orientation="vertical"
          variant="middle"
          component="div"
          flexItem
        />
        <PredictionInfoText />
      </Typography>
      <Grid item md={12}>
        <Tooltip
          title={
            isHistoryPredictionSelected
              ? 'Go back to draft to change the model selection'
              : 'Select a model for prediction'
          }
        >
          <ToggleButtonGroup
            value={predictionMode}
            exclusive
            onChange={(e, value) => setPredictionMode(value)}
            aria-label="text alignment"
            size="small"
            disabled={isHistoryPredictionSelected}
          >
            <ToggleButton
              value={EPredictionMode.ARIMA}
              aria-label="left aligned"
              sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              ARIMA model
            </ToggleButton>
            {valueProperties?.length > 1 && (
              <ToggleButton
                value={EPredictionMode.VAR}
                aria-label="right aligned"
                sx={{ ml: 2, paddingTop: 0.5, paddingBottom: 0.5 }}
              >
                VAR model
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </Tooltip>
        <InfoOverlay
          id="more-about-the-models"
          label="More about the models"
          sx={{ ml: 2 }}
          overlayStyles={{ width: '80vw', maxWidth: '800px' }}
        >
          <InfoOverlay.Popover>
            <Stack direction="row" width="auto" columnGap={1}>
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
                      AutoRegressive (AR): This component represents the current
                      value of the process as a finite, linear aggregate of a
                      certain number of previous values of the process plus a
                      random shock.
                      {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf, p.8 */}
                      {/* relationship between an observation and a certain number
                      of lagged observations (i.e., its own past values). It
                      assumes that the current value of a series can be
                      explained by its previous values.{' '} */}
                    </ListItemText>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText>
                      Integrated (I): This component enables the model to handle
                      both stationary and nonstationary processes. It applies
                      differencing d times to a time series data to make it
                      stationary. Usually, 𝑑 is 0, 1, or at most 2, with 𝑑 = 0
                      corresponding to stationary behavior.
                      {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
                    </ListItemText>
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemText>
                      Moving Average (MA): This component expresses the current
                      deviation of the process as a finite weighted sum of a
                      certain number of previous deviations of the process plus
                      a random shock.
                      {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf, p.9 */}
                      {/* This component models the
                      relationship between an observation and a residual error
                      from a moving average model applied to lagged
                      observations. It captures the short-term fluctuations in
                      the data. (AutoRegressive.) */}
                    </ListItemText>
                  </ListItem>
                </List>
                {/* After providing the model parameters values in the form,
                different ARIMA (p, d, q) models are fitted to find out the best
                model for the monthly gold price. Moreover, to choose the best
                model for the data, the estimated model should be compared with
                other ARIMA models. The two common criteria, Bayesian
                Information Criteria (BIC) and Akaike’s Information Criterion
                (AIC), are defined by AIC = 2n−2ln(Lˆ) */}
                {/* https://file.notion.so/f/f/52f58fea-32ae-49e5-b758-e4e8d18d69ab/f680e1f3-6c4e-4844-9791-01f3d1da2476/ARIMA.pdf?id=f23bdd9d-9aab-4555-bfb2-15a9e6a8f253&table=block&spaceId=52f58fea-32ae-49e5-b758-e4e8d18d69ab&expirationTimestamp=1719705600000&signature=y_zY-hQsv1-X_MrVMJ69A1y0-OkPJS8UWDOSsY5l8uw&downloadName=ARIMA.pdf */}
              </div>
              <Divider
                sx={{ margin: 1 }}
                orientation="vertical"
                variant="middle"
                component="div"
                flexItem
              />
              <div>
                <Link href="https://en.wikipedia.org/wiki/Vector_autoregression#:~:text=Vector%20autoregression%20(VAR)%20is%20a,allowing%20for%20multivariate%20time%20series.">
                  VAR(p)
                </Link>{' '}
                (Vector AutoRegression) model is a generalisation of the
                univariate AR (AutoRegressive) model, extending it to predict
                multivariate time series. It assumes that each variable in the
                multivariate time series influences and is influenced by the
                others. The parameter 𝑝 p indicates the number of lagged
                observations of each variable which influence the current
                observation.
                <br />
                If the series are stationary, we forecast them by fitting a VAR
                to the data right away. If the time series are non-stationary,
                we take differences of the data in order to make them
                stationary, and then proceed with fit a VAR model.
                {/* https://otexts.com/fpp2/VAR.html#fn25 */}
                {/* a statistical model used to
                analyze the dynamic relationships among multiple time series
                variables. This model is useful when the variables in the time
                series influence each other. In a VAR model, each variable is
                modeled as a linear function of past values of itself and past
                values of all the other variables in the system. */}
                {/* VAR is bidirectional. */}
              </div>{' '}
            </Stack>
          </InfoOverlay.Popover>
        </InfoOverlay>
      </Grid>
    </>
  );
};

export default PredictionModelSelection;
