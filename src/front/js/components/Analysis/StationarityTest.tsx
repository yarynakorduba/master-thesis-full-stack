import React from 'react';
import { map } from 'lodash';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly stationarityTestResult;
  readonly propertiesToTest;
  readonly timeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly handleSelectStep: any;
  readonly index: any;
};

const StationarityTest = ({
  isVisible,
  stationarityTestResult,
  handleFetchDataStationarityTest,
  isStationarityTestLoading,
  handleSelectStep,
  index
}: TProps) => {
  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>Is the data stationary?</StepButton>{' '}
      <StepContent>
        <Box sx={{ mb: 2 }}>
          <ButtonContainer>
            {isStationarityTestLoading && <Loader />}
            {!stationarityTestResult && !isStationarityTestLoading && (
              <Button size="small" onClick={handleFetchDataStationarityTest}>
                Run stationarity test
              </Button>
            )}
          </ButtonContainer>
          <div>
            {stationarityTestResult &&
              map(stationarityTestResult, (val, propName) => {
                return `${propName} data ${val?.isStationary ? 'are stationary' : 'are not stationary'}`;
              }).join('; ')}
          </div>
        </Box>
      </StepContent>
    </>
  );
};

export default StationarityTest;
