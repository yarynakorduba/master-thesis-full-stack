import React from 'react';
import { Button } from '../../../pages/App/DatasetForm/styles';
import { Step, StepName, Question, Test, ButtonContainer } from './styles';
import Loader from '../../Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly varTestResult;
  readonly isVARTestLoading: boolean;
  readonly handleFetchVARTest;
};
const Prediction = ({ isVisible, varTestResult, isVARTestLoading, handleFetchVARTest }: TProps) => {
  if (!isVisible) return null;
  return (
    <Step>
      <StepName>4</StepName>
      <Question>What is the prediction for the future?</Question>
      <Test>
        <ButtonContainer>
          {isVARTestLoading ? (
            <Loader />
          ) : (
            <Button onClick={handleFetchVARTest}>Run the prediction model</Button>
          )}
        </ButtonContainer>
        <div>
          {varTestResult && (varTestResult ? 'Predicted' : 'Could not predict the future data')}
        </div>
      </Test>
    </Step>
  );
};

export default Prediction;
