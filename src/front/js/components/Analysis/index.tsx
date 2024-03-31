import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import ARIMAPrediction from './ARIMAPrediction';
import { EPredictionMode } from './types';
import { useStepper } from './hooks';
import PredictionModelSelection from './PredictionModelSelection';
import { identity } from 'lodash';

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

  const steps = [
    (key: number) => (
      <StationarityTest
        key={key}
        isVisible
        handleSelectStep={handleSelectStep}
        index={key}
        stationarityTestResult={stationarityTestResult}
        propertiesToTest={valueProperties}
        timeseriesData={timeseriesData}
        handleFetchDataStationarityTest={handleFetchDataStationarityTest}
        isStationarityTestLoading={isStationarityTestLoading}
      />
    ),
    (key: number) => (
      <WhiteNoiseTest
        key={key}
        isVisible
        handleSelectStep={handleSelectStep}
        index={key}
        whiteNoiseResult={whiteNoiseResult}
        isWhiteNoiseLoading={isWhiteNoiseLoading}
        handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
      />
    ),
    predictionMode === EPredictionMode.VAR
      ? (key: number) => (
          <CausalityTest
            isVisible
            handleSelectStep={handleSelectStep}
            index={key}
            causalityTestResult={causalityTestResult}
            isCausalityTestLoading={isCausalityTestLoading}
            handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
          />
        )
      : undefined,

    (key: number) =>
      predictionMode === EPredictionMode.VAR ? (
        <Prediction
          index={key}
          isVisible
          handleSelectStep={handleSelectStep}
          varResult={varResult}
          isVARLoading={isVARLoading}
          handleFetchVAR={handleFetchVAR}
        />
      ) : (
        <ARIMAPrediction
          index={key}
          isVisible
          handleSelectStep={handleSelectStep}
          varResult={arimaResult}
          isVARLoading={isARIMALoading}
          handlePredict={handleFetchARIMA}
        />
      )
  ].filter(identity);

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        Prediction
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 1 }}>
        To make a prediction, we need to know a few characteristics of the data
      </Typography>
      <PredictionModelSelection
        predictionMode={predictionMode}
        setPredictionMode={setPredictionMode}
      />
      <Box sx={{ maxWidth: 400 }}>
        <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
          {steps.map((renderStep, index: number) => (
            <Step key={index}>{renderStep!(index)}</Step>
          ))}
        </Stepper>
      </Box>
    </div>
  );
};

export default Analysis;
