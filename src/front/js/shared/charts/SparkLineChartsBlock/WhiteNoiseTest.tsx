import React from 'react';
import { Button } from '../../../pages/App/DatasetForm/styles';
import { Step, StepName, Question, Test, ButtonContainer } from './styles';
import Loader from '../../Loader';

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
      <Question>Is the data a white noise?</Question>
      <Test>
        <ButtonContainer>
          {isWhiteNoiseLoading ? (
            <Loader />
          ) : (
            <Button onClick={handleFetchIsWhiteNoise}>Run white-noise test</Button>
          )}
        </ButtonContainer>
        <div>
          {whiteNoiseResult &&
            (whiteNoiseResult?.isWhiteNoise
              ? 'The data is a white noise'
              : 'The data is not a white noise')}
        </div>
      </Test>
    </Step>
  );
};

export default WhiteNoiseTest;
