import React from 'react';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import Box from '@mui/material/Box';
import { identity, noop } from 'lodash';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import Prediction from './VARPrediction';
import ARIMAPrediction from './ARIMAPrediction';
import { EPredictionMode, TARIMAResult, TVARResult } from './types';
import { useStepper } from './hooks';
import PredictionModelSelection from './PredictionModelSelection';
import {
  useCausalityTest,
  useConfigData,
  usePredictionMode,
  useStationarityTest,
  useWhiteNoiseTest,
} from '../../../store/currentConfiguration/selectors';

type TProps = {
  readonly predictionResult?: TARIMAResult | TVARResult; // tvarresult
  readonly isPredictionLoading: boolean;
};

const Analysis = ({ predictionResult, isPredictionLoading }: TProps) => {
  const [predictionMode, setPredictionMode] = usePredictionMode();
  const { activeStep, handleSelectStep } = useStepper();

  console.log('PREDICTION RESULT -- > ', predictionResult);

  const {
    data: timeseriesData,
    isConfigurationLoading,
    valueProperties,
  } = useConfigData();

  const [
    stationarityTestResult,
    handleFetchDataStationarityTest,
    isStationarityTestLoading,
  ] = useStationarityTest();

  const [whiteNoiseResult, handleFetchIsWhiteNoise, isWhiteNoiseLoading] =
    useWhiteNoiseTest();

  const [
    causalityTestResult,
    handleFetchGrangerDataCausalityTest,
    isCausalityTestLoading,
  ] = useCausalityTest();

  if (isConfigurationLoading) return null;

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
        handleFetchDataStationarityTest={() =>
          handleFetchDataStationarityTest(valueProperties)
        }
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
        handleFetchIsWhiteNoise={() => handleFetchIsWhiteNoise(valueProperties)}
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
            handleFetchGrangerDataCausalityTest={
              handleFetchGrangerDataCausalityTest
            }
          />
        )
      : undefined,

    (key: number) =>
      (!predictionResult && predictionMode === EPredictionMode.VAR) ||
      predictionResult?.predictionMode === EPredictionMode.VAR ? (
        <Prediction
          index={key}
          isVisible
          handleSelectStep={handleSelectStep}
          varResult={predictionResult}
          isVARLoading={isPredictionLoading}
        />
      ) : (
        <ARIMAPrediction
          index={key}
          isVisible
          handleSelectStep={handleSelectStep}
          arimaResult={predictionResult}
          isVARLoading={isPredictionLoading}
        />
      ),
  ].filter(identity);

  return (
    <Box>
      <PredictionModelSelection
        predictionMode={
          predictionResult ? predictionMode : predictionResult?.predictionMode
        }
        setPredictionMode={
          predictionResult?.predictionMode ? noop : setPredictionMode
        }
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
