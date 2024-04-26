import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../../shared/Loader';
import InfoOverlay from '../../../shared/InfoOverlay';
import { Link } from 'react-router-dom';

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
        <Box sx={{ fontSize: 16 }}>
          Is the data a{' '}
          <InfoOverlay id="stationary" label="white noise">
            <InfoOverlay.Popover>
              <Typography variant="body1">
                A time series is white noise if the variables are independent and identically
                distributed with a mean of zero. This means that all variables have the same
                variance (sigma^2) and each value has a zero correlation with all other values in
                the series.
              </Typography>
              <Typography variant="body1">
                If a time series is white noise, it is a sequence of random numbers and cannot be
                predicted.
              </Typography>
            </InfoOverlay.Popover>
          </InfoOverlay>
          ?
        </Box>
      </StepButton>{' '}
      <StepContent sx={{ paddingTop: 1 }}>
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
