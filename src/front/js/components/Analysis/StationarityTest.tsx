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
  readonly stationarityTestResult;
  readonly propertiesToTest;
  readonly timeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
};

const StationarityTest = ({
  isVisible,
  stationarityTestResult,
  handleFetchDataStationarityTest,
  isStationarityTestLoading
}: TProps) => {
  if (!isVisible) return null;
  return (
    <Step>
      <StepName>1</StepName>
      <Typography variant="subtitle1">Is the data stationary?</Typography>
      <Test>
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
      </Test>
    </Step>
  );
};

export default StationarityTest;
