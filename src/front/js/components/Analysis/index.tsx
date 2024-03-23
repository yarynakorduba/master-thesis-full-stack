import React, { useState } from 'react';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import { AnalysisContainer, Subtitle } from './styles';
import { Button } from '../../pages/App/DatasetForm/styles';
import { EPredictionMode } from './types';

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
  handleFetchARIMA,

  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest,

  varResult,
  isVARLoading,
  handleFetchVAR
}: any) => {
  const [predictionMode, setPredictionMode] = useState(EPredictionMode.ARIMA);
  return (
    <AnalysisContainer>
      <h5>Prediction</h5>
      <Button onClick={() => setPredictionMode(EPredictionMode.ARIMA)}>ARIMA</Button>
      <Button onClick={() => setPredictionMode(EPredictionMode.VAR)}>VAR</Button>
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
        isVisible
        whiteNoiseResult={whiteNoiseResult}
        isWhiteNoiseLoading={isWhiteNoiseLoading}
        handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
      />
      {predictionMode === EPredictionMode.VAR && (
        <CausalityTest
          isVisible
          causalityTestResult={causalityTestResult}
          isCausalityTestLoading={isCausalityTestLoading}
          handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
        />
      )}
      {predictionMode === EPredictionMode.VAR ? (
        <Prediction
          isVisible
          varResult={varResult}
          isVARLoading={isVARLoading}
          handleFetchVAR={handleFetchVAR}
        />
      ) : (
        <Prediction
          isVisible
          varResult={arimaResult}
          isVARLoading={isARIMALoading}
          handleFetchVAR={handleFetchARIMA}
        />
      )}
    </AnalysisContainer>
  );
};

export default Analysis;
