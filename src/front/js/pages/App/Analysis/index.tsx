import React from 'react';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';
import { identity } from 'lodash';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './VARPrediction';
import ARIMAPrediction from './ARIMAPrediction';
import { EPredictionMode, TARIMAResult, TVARResult } from './types';
import { useStepper } from './hooks';
import PredictionModelSelection from './PredictionModelSelection';
import { TTimeseriesData } from '../../../types';
import { usePredictionMode } from '../../../store/configuration/selectors';

type TProps = {
  readonly stationarityTestResult;
  readonly valueProperties;
  readonly timeseriesData: TTimeseriesData;
  readonly handleFetchDataStationarityTest;
  readonly isStationarityTestLoading: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
  readonly predictionResult?: TARIMAResult | TVARResult; // tvarresult
  readonly isPredictionLoading: boolean;
  readonly handleFetchPrediction;

  readonly causalityTestResult?;
  readonly isCausalityTestLoading: boolean;
  readonly handleFetchGrangerDataCausalityTest?;
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
  predictionResult,
  isPredictionLoading,
  handleFetchPrediction,

  causalityTestResult,
  isCausalityTestLoading,
  handleFetchGrangerDataCausalityTest
}: TProps) => {
  const [predictionMode, setPredictionMode] = usePredictionMode();
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
          varResult={predictionResult}
          isVARLoading={isPredictionLoading}
          handleFetchVAR={handleFetchPrediction}
        />
      ) : (
        <ARIMAPrediction
          index={key}
          isVisible
          handleSelectStep={handleSelectStep}
          arimaResult={predictionResult}
          isVARLoading={isPredictionLoading}
          handlePredict={handleFetchPrediction}
        />
      )
  ].filter(identity);

  return (
    <Box>
      <PredictionModelSelection
        predictionMode={predictionMode}
        setPredictionMode={setPredictionMode}
      />

      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {steps.map((renderStep, index: number) => (
          <Step key={index}>{renderStep!(index)}</Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default Analysis;
