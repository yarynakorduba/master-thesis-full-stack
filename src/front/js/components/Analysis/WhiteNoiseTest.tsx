import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
  Step,
  StepName,
  Test,
  ButtonContainer
} from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
};

const WhiteNoiseTest = ({
  isVisible,
  whiteNoiseResult,
  isWhiteNoiseLoading,
  handleFetchIsWhiteNoise
}: TProps) => {
  if (!isVisible) return null;
  return (
    <Step>
      <StepName>2</StepName>
      <Typography variant="subtitle1">Is the data a white noise?</Typography>
      <Test>
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
      </Test>
    </Step>
  );
};

export default WhiteNoiseTest;
