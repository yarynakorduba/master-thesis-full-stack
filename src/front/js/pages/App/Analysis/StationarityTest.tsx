import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import Box from '@mui/material/Box';
import { ButtonContainer } from '../../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../../shared/Loader';
import { Accordion, AccordionDetails, AccordionSummary } from '../../../shared/Accordion';
import { TTimeseriesData } from '../../../types';
import InfoOverlay from '../../../shared/InfoOverlay';

type TProps = {
  readonly isVisible: boolean;
  readonly stationarityTestResult;
  readonly propertiesToTest;
  readonly timeseriesData: TTimeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly handleSelectStep: (stepIndex: number) => () => void;
  readonly index: number;
};

const StationarityTest = ({
  isVisible,
  stationarityTestResult,
  handleFetchDataStationarityTest,
  isStationarityTestLoading,
  handleSelectStep,
  index
}: TProps) => {
  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>
          Is the data{' '}
          <InfoOverlay id="stationary" label="stationary">
            <InfoOverlay.Popover>
              <Typography variant="body1">
                Stationarity is a fundamental concept in time series analysis. A stationary time
                series is one whose statistical properties, such as mean, variance, and
                autocorrelation, remain constant over time. In simpler terms, it does not exhibit
                trends, seasonal effects, or any other systematic patterns that change over time.
              </Typography>
              <Typography variant="body1">
                To test the data stationarity, we run the{' '}
                <Link href="https://en.wikipedia.org/wiki/Augmented_Dickey%E2%80%93Fuller_test">
                  Augmented Dickey-Fuller statistical test
                </Link>{' '}
                with the lag order automatically detected by Akaike Information Criterion
                (autolag=&quot;AIC&quot;).
              </Typography>
            </InfoOverlay.Popover>
          </InfoOverlay>
          ?
        </Box>
      </StepButton>{' '}
      <StepContent sx={{ paddingTop: 1 }}>
        <ButtonContainer>
          {isStationarityTestLoading && <Loader />}
          {!isStationarityTestLoading && (
            <Button size="small" onClick={handleFetchDataStationarityTest} sx={{ marginTop: 0.75 }}>
              Run stationarity test
            </Button>
          )}
        </ButtonContainer>
        <Typography variant="body1">
          {stationarityTestResult &&
            map(stationarityTestResult, (val, propName) => {
              return `${propName} data ${val?.isStationary ? 'are stationary' : 'are not stationary'}`;
            }).join('; ')}
        </Typography>
      </StepContent>
    </>
  );
};

export default StationarityTest;
