import React from 'react';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import { AnalysisContainer, Subtitle } from './styles';

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
  return (
    <AnalysisContainer>
      <h5>Prediction</h5>
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
