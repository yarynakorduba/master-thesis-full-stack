import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box, Grid, alpha, useTheme } from '@mui/material';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import { TTimeseriesData } from '../../../types';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import AnalysisSection from './AnalysisSection';
import StationarityText from '../InfoOverlayTexts/StationarityText';

type TProps = {
  readonly index: number;
  readonly isVisible: boolean;
  readonly stationarityTestResult;
  readonly propertiesToTest;
  readonly timeseriesData: TTimeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
};

const StationarityTest = ({
  index,
  isVisible,
  stationarityTestResult,
  handleFetchDataStationarityTest,
  isStationarityTestLoading,
}: TProps) => {
  const { palette } = useTheme();
  const getStationaryTxt = (isStationary: boolean) => (
    <Typography
      component="span"
      sx={{
        background: isStationary
          ? alpha(palette.success.light, 0.2)
          : alpha(palette.warning.light, 0.2),
      }}
    >
      {isStationary ? '' : 'not '}stationary
    </Typography>
  );

  if (!isVisible) return null;
  return (
    <AnalysisSection md={6}>
      <AnalysisSection.Header index={index}>
        Check data consistency over time{' '}
        <InfoOverlay id="stationarity-test" label="(stationarity)">
          <InfoOverlay.Popover>
            <StationarityText />
          </InfoOverlay.Popover>
        </InfoOverlay>{' '}
      </AnalysisSection.Header>
      <Grid item md={12}>
        <ButtonContainer>
          {isStationarityTestLoading && <Loader />}
          {!isStationarityTestLoading && (
            <Button size="small" onClick={handleFetchDataStationarityTest}>
              Run stationarity test
            </Button>
          )}
        </ButtonContainer>
      </Grid>
      <Grid item md={12}>
        <Typography variant="body1">
          {map(stationarityTestResult, (val, propName) => {
            return (
              <Box>
                {propName}:
                <ul>
                  <li>
                    <InfoOverlay id={`KPSS-${propName}`} label="KPSS">
                      KPSS<InfoOverlay.Popover>AAA</InfoOverlay.Popover>
                    </InfoOverlay>{' '}
                    test: {getStationaryTxt(val.kpss?.isStationary)}
                  </li>
                  <li>
                    {' '}
                    <InfoOverlay id={`ADF-${propName}`} label="ADF">
                      ADF<InfoOverlay.Popover>AAA</InfoOverlay.Popover>
                    </InfoOverlay>{' '}
                    test: {getStationaryTxt(val.adf?.isStationary)}
                  </li>
                </ul>
              </Box>
            );
          })}
        </Typography>
      </Grid>
    </AnalysisSection>
  );
};

export default StationarityTest;

// {/* <StepButton onClick={handleSelectStep(index)}> */}
// <Box sx={{ fontSize: 16 }}>
//   Is the data{' '}
//   <InfoOverlay id="stationary" label="stationary">
//     <InfoOverlay.Popover>
//       <Typography variant="body1">
//         A time series is stationary when its statistical properties, such
//         as mean, variance, and autocorrelation, remain constant over time.
//         In simpler terms, it does not exhibit trends, seasonal effects, or
//         any other systematic patterns that change over time.
//       </Typography>
//       <Typography variant="body1">
//         To test the data stationarity, we run the{' '}
//         <Link href="https://en.wikipedia.org/wiki/Augmented_Dickey%E2%80%93Fuller_test">
//           Augmented Dickey-Fuller statistical test
//         </Link>{' '}
//         with the lag order automatically detected by Akaike Information
//         Criterion (autolag=&quot;AIC&quot;).
//       </Typography>
//       <Typography>
//         Many time-series methods may perform better when a time-series is
//         stationary, since forecasting values becomes a far easier task for
//         a stationary time series. ARIMAs that include differencing (i.e.,
//         &gt; 0) assume that the data becomes stationary after
//         differencing. This is called difference-stationary. Note that Auto
//         ARIMA will automatically determine the appropriate differencing
//         term for you by default.
//         {/* https://alkaline-ml.com/pmdarima/tips_and_tricks.html#enforcing-stationarity */}
//       </Typography>
//     </InfoOverlay.Popover>
//   </InfoOverlay>
//   ?
// </Box>
// {/* </StepButton>{' '} */}
// {/* <StepContent sx={{ paddingTop: 1 }}> */}
