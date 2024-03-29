import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import { AnalysisContainer } from './styles';
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
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        Prediction
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        To make a prediction, we need to know a few characteristics of the data
      </Typography>
      <ToggleButtonGroup
        value={predictionMode}
        exclusive
        onChange={(e, value) => setPredictionMode(value)}
        aria-label="text alignment"
        size="small"
        sx={{ marginBottom: 1 }}
      >
        <ToggleButton value={EPredictionMode.ARIMA} aria-label="left aligned">
          ARIMA
        </ToggleButton>
        <ToggleButton value={EPredictionMode.VAR} aria-label="right aligned">
          VAR
        </ToggleButton>
      </ToggleButtonGroup>

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
