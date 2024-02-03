import React from 'react';

import { Button } from '../../../pages/App/DatasetForm/styles';
import { Step, StepName, Question, Test, ButtonContainer } from './styles';
import Loader from '../../Loader';

type TProps = {};

const CausalityTest = ({
  isVisible,
  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest
}) => {
  if (!isVisible) return null;
  return (
    <Step>
      <StepName>3</StepName>
      <Question>Do selected variables have a causal relautionship?</Question>
      <Test>
        <ButtonContainer>
          {isCausalityTestLoading && <Loader />}
          {!isCausalityTestLoading && !causalityTestResult && (
            <Button onClick={handleFetchGrangerDataCausalityTest}>Run the causality test</Button>
          )}
        </ButtonContainer>
        <div>
          {causalityTestResult &&
            (causalityTestResult
              ? 'The data has a causal relationship'
              : 'The data does not have a causal relationship')}
        </div>
      </Test>
    </Step>
  );
};

export default CausalityTest;
