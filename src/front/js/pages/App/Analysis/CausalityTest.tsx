import React from 'react';
import Button from '@mui/material/Button';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../../shared/Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly causalityTestResult;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest;
  readonly index: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
};

const CausalityTest = ({
  isVisible,
  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest,
  index,
  handleSelectStep
}: TProps) => {
  const causalityTexts = [
    `${causalityTestResult?.[0]?.dataKeys?.[1]} ${causalityTestResult?.[0]?.isCausal ? '->' : 'x'} ${causalityTestResult?.[0]?.dataKeys?.[0]}`,
    `${causalityTestResult?.[1]?.dataKeys?.[1]} ${causalityTestResult?.[1]?.isCausal ? '->' : 'x'} ${causalityTestResult?.[1]?.dataKeys?.[0]}`
  ].join(';\n');

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>Do selected variables have a causal relautionship?</Box>
      </StepButton>
      <StepContent sx={{ paddingTop: 1 }}>
        <ButtonContainer>
          {isCausalityTestLoading && <Loader />}
          {!isCausalityTestLoading && !causalityTestResult && (
            <Button size="small" onClick={handleFetchGrangerDataCausalityTest}>
              Run the causality test
            </Button>
          )}
        </ButtonContainer>
        <div>{causalityTestResult ? causalityTexts : null}</div>
      </StepContent>
    </>
  );
};

export default CausalityTest;
