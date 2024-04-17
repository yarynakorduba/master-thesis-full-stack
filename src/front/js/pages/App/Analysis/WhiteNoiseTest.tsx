import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../../shared/Loader';
import { Accordion, AccordionDetails, AccordionSummary } from '../../../shared/Accordion';

type TProps = {
  readonly isVisible: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
  readonly handleSelectStep: (stepIndex: number) => () => void;
  readonly index: number;
};

const WhiteNoiseTest = ({
  isVisible,
  whiteNoiseResult,
  isWhiteNoiseLoading,
  handleFetchIsWhiteNoise,
  handleSelectStep,
  index
}: TProps) => {
  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>Is the data a white noise?</Box>
      </StepButton>{' '}
      <StepContent sx={{ paddingTop: 1 }}>
        <Accordion sx={{ maxWidth: 'md' }}>
          <AccordionSummary
            aria-controls="panel1d-content"
            id="panel1d-header"
            sx={{ minHeight: 16, height: 16, margin: 0.5 }}
          >
            <Typography variant="subtitle1">About stationarity</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Stationarity is a fundamental concept in time series analysis. A stationary time
              series is one whose statistical properties, such as mean, variance, and
              autocorrelation, remain constant over time. In simpler terms, it does not exhibit
              trends, seasonal effects, or any other systematic patterns that change over time.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <ButtonContainer>
          {isWhiteNoiseLoading && <Loader />}
          {!whiteNoiseResult && !isWhiteNoiseLoading && (
            <Button size="small" onClick={handleFetchIsWhiteNoise}>
              Run white-noise test
            </Button>
          )}
        </ButtonContainer>
        <Typography variant="body1">
          {whiteNoiseResult &&
            map(whiteNoiseResult, (val, propName) => {
              return `${propName} data ${val?.isWhiteNoise ? 'are white noise' : 'are not white noise'}`;
            }).join('; ')}
        </Typography>
      </StepContent>
    </>
  );
};

export default WhiteNoiseTest;
