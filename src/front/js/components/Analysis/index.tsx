import React, { useState } from 'react';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import { AnalysisContainer, Subtitle } from './styles';
import { Button } from '../../pages/App/DatasetForm/styles';

enum EPredictionMode {
  ARIMA = 'ARIMA',
  VAR = 'VAR'
}

const Analysis = ({
  stationarityTestResult,
  valueProperties,
  timeseriesData,
  handleFetchDataStationarityTest,
  isStationarityTestLoading,
  whiteNoiseResult,
  isWhiteNoiseLoading,
  handleFetchIsWhiteNoise,
  arimaResult,
  isARIMALoading,
  handleFetchARIMA
}: any) => {
  const [predictionMode, setPredictionMode] = useState(EPredictionMode.ARIMA);
  return (
    <AnalysisContainer>
      <h5>Prediction</h5>
      <Button
        onClick={() => {
          setPredictionMode(EPredictionMode.ARIMA);
        }}
      >
        ARIMA
      </Button>
      <Button
        onClick={() => {
          setPredictionMode(EPredictionMode.VAR);
        }}
      >
        VAR
      </Button>
      {predictionMode}
      <Subtitle>To make a prediction, we need to know a few characteristics of the data</Subtitle>

      <StationarityTest
        isVisible
        stationarityTestResult={stationarityTestResult}
        propertiesToTest={valueProperties}
        timeseriesData={timeseriesData}
        handleFetchDataStationarityTest={handleFetchDataStationarityTest}
        isStationarityTestLoading={isStationarityTestLoading}
      />
      <WhiteNoiseTest
        isVisible={!!stationarityTestResult}
        whiteNoiseResult={whiteNoiseResult}
        isWhiteNoiseLoading={isWhiteNoiseLoading}
        handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
      />
      {/* <CausalityTest
      isVisible={!!whiteNoiseResult}
      causalityTestResult={causalityTestResult}
      isCausalityTestLoading={isCausalityTestLoading}
      handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
    /> */}
      <Prediction
        isVisible
        varTestResult={arimaResult}
        isVARTestLoading={isARIMALoading}
        handleFetchVARTest={handleFetchARIMA}
      />
    </AnalysisContainer>
  );
};

export default Analysis;
