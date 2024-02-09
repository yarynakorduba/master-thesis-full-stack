import React from 'react';

import { Button } from '../../../pages/App/DatasetForm/styles';
import { Step, StepName, Question, Test, ButtonContainer } from './styles';
import Loader from '../../Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly causalityTestResult;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest;
};

const CausalityTest = ({
  isVisible,
  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest
}: TProps) => {
  const causalityTexts = [
    `${causalityTestResult?.[0]?.dataKeys?.[1]} ${causalityTestResult?.[0]?.isCausal ? '->' : 'x'} ${causalityTestResult?.[0]?.dataKeys?.[0]}`,
    `${causalityTestResult?.[1]?.dataKeys?.[1]} ${causalityTestResult?.[1]?.isCausal ? '->' : 'x'} ${causalityTestResult?.[1]?.dataKeys?.[0]}`
  ].join(';\n');

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
        <div>{causalityTestResult ? causalityTexts : null}</div>
      </Test>
    </Step>
  );
};

export default CausalityTest;
