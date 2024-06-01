import React from 'react';
import Button from '@mui/material/Button';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import { Typography } from '@mui/material';
import { find, map } from 'lodash';
import { TrendingFlatSharp, SyncAltSharp } from '@mui/icons-material';

type TProps = {
  readonly isVisible: boolean;
  readonly causalityTestResult;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest;
  readonly index: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
};

// Granger’s causality test can be used to identify the relationship between variables prior to model building.
// This is important because if there is no relationship between variables, they can be excluded and modeled separately.
// Conversely, if a relationship exists, the variables must be considered in the modeling phase.

const CausalityTest = ({
  isVisible,
  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest,
  index,
  handleSelectStep,
}: TProps) => {
  console.log('CAUSALITY TEST RESULT -- > ', { causalityTestResult });

  const causalityTexts = map(causalityTestResult, (keyPair) => {
    const first = keyPair[0];
    const second = keyPair[1];

    const elementWithCausality = find(keyPair, 'isCausal');
    if (!elementWithCausality) return null;
    return (
      <Box sx={{ mt: 1, mb: 1 }}>
        {first.isCausal && second.isCausal ? (
          <>
            {first.source} <SyncAltSharp /> {first.target}
          </>
        ) : (
          <>
            {elementWithCausality.source} <TrendingFlatSharp />{' '}
            {elementWithCausality.target}
          </>
        )}
      </Box>
    );
  });

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>
          Do selected variables have a{' '}
          <InfoOverlay id="whiteNoise" label="causal relautionship">
            <InfoOverlay.Popover>
              <Typography></Typography>
            </InfoOverlay.Popover>
          </InfoOverlay>
          ?
        </Box>
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
