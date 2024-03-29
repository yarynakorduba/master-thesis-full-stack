import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';

import Box from '@mui/material/Box';
import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import { AnalysisContainer } from './styles';
import { EPredictionMode } from './types';
import { useStepper } from './hooks';

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
  const { activeStep, handleSelectStep } = useStepper();
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
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
          <Step key={0}>
            <StationarityTest
              key={0}
              isVisible
              handleSelectStep={handleSelectStep}
              index={0}
              stationarityTestResult={stationarityTestResult}
              propertiesToTest={valueProperties}
              timeseriesData={timeseriesData}
              handleFetchDataStationarityTest={handleFetchDataStationarityTest}
              isStationarityTestLoading={isStationarityTestLoading}
            />
          </Step>
          <Step key={1}>
            <WhiteNoiseTest
              key={1}
              isVisible
              handleSelectStep={handleSelectStep}
              index={1}
              whiteNoiseResult={whiteNoiseResult}
              isWhiteNoiseLoading={isWhiteNoiseLoading}
              handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
            />
          </Step>

          <Step key={2}>
            <CausalityTest
              isVisible
              handleSelectStep={handleSelectStep}
              index={2}
              causalityTestResult={causalityTestResult}
              isCausalityTestLoading={isCausalityTestLoading}
              handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
            />
          </Step>
          <Step key={3}>
            {predictionMode === EPredictionMode.VAR ? (
              <Prediction
                index={3}
                isVisible
                handleSelectStep={handleSelectStep}
                varResult={varResult}
                isVARLoading={isVARLoading}
                handleFetchVAR={handleFetchVAR}
              />
            ) : (
              <Prediction
                index={3}
                isVisible
                handleSelectStep={handleSelectStep}
                varResult={arimaResult}
                isVARLoading={isARIMALoading}
                handleFetchVAR={handleFetchARIMA}
              />
            )}
          </Step>
        </Stepper>
      </Box>
    </AnalysisContainer>
  );
};

export default Analysis;
