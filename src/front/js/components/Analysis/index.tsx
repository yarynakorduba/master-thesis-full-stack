import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';
import { identity } from 'lodash';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './Prediction';
import ARIMAPrediction from './ARIMAPrediction';
import { EPredictionMode, TARIMAResult } from './types';
import { useStepper } from './hooks';
import PredictionModelSelection from './PredictionModelSelection';
import { TTimeseriesData } from 'front/js/types';

type TProps = {
  readonly stationarityTestResult;
  readonly valueProperties;
  readonly timeseriesData: TTimeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
  readonly arimaResult?: TARIMAResult;
  readonly isARIMALoading: boolean;
  readonly handleFetchARIMA;

  readonly causalityTestResult?;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest?;

  readonly varResult;
  readonly isVARLoading: boolean;
  readonly handleFetchVAR;
};

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
}: TProps) => {
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
          arimaResult={arimaResult}
          isVARLoading={isARIMALoading}
          handlePredict={handleFetchARIMA}
        />
      )
  ].filter(identity);

  return (
    <div>
      <PredictionModelSelection
        predictionMode={predictionMode}
        setPredictionMode={setPredictionMode}
      />
      <Box>
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
