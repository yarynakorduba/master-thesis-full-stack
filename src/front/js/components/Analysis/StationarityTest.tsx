import React from 'react';
import { map } from 'lodash';

import { Button } from '../../pages/App/DatasetForm/styles';
import {
  Step,
  StepName,
  Question,
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
      <Question>Is the data stationary?</Question>
      <Test>
        <ButtonContainer>
          {isStationarityTestLoading && <Loader />}
          {!stationarityTestResult && !isStationarityTestLoading && (
            <Button onClick={handleFetchDataStationarityTest}>Run stationarity test</Button>
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
