import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
  readonly handleSelectStep;
  readonly index;
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
      {' '}
      <StepButton onClick={handleSelectStep(index)}>Is the data a white noise?</StepButton>{' '}
      <StepContent>
        <ButtonContainer>
          {isWhiteNoiseLoading && <Loader />}
          {!whiteNoiseResult && !isWhiteNoiseLoading && (
            <Button size="small" onClick={handleFetchIsWhiteNoise}>
              Run white-noise test
            </Button>
          )}
        </ButtonContainer>
        <div>
          {whiteNoiseResult &&
            map(whiteNoiseResult, (val, propName) => {
              return `${propName} data ${val?.isWhiteNoise ? 'are white noise' : 'are not white noise'}`;
            }).join('; ')}
        </div>
      </StepContent>
    </>
  );
};

export default WhiteNoiseTest;
