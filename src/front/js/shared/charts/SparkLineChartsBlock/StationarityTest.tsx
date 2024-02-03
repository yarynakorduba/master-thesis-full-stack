import React from 'react';
import { map } from 'lodash';

import { Button } from '../../../pages/App/DatasetForm/styles';
import { Step, StepName, Question, Test, ButtonContainer } from './styles';
import Loader from '../../Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly stationarityTestResult;
  readonly selectedProp;
  readonly timeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
};

const StationarityTest = ({
  isVisible,
  stationarityTestResult,
  selectedProp,
  timeseriesData,
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
          {isStationarityTestLoading ? (
            <Loader />
          ) : (
            <Button
              onClick={() => {
                const dataForAnalysis = selectedProp?.value
                  ? map(timeseriesData, (datum) => datum[selectedProp.value])
                  : undefined;
                if (dataForAnalysis) {
                  handleFetchDataStationarityTest(dataForAnalysis);
                }
              }}
            >
              Run stationarity test
            </Button>
          )}
        </ButtonContainer>
        <div>
          {stationarityTestResult &&
            ((stationarityTestResult as any)?.isStationary
              ? 'The data is stationary'
              : 'The data is not stationary')}
        </div>
      </Test>
    </Step>
  );
};

export default StationarityTest;
