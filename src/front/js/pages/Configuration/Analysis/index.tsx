import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { identity, map, noop } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { Card, Divider, Grid, Skeleton, Typography } from '@mui/material';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import VARPrediction from './VARPrediction';
import ARIMAPrediction from './ARIMAPrediction';
import { EPredictionMode, TARIMAResult, TVARResult } from './types';
import PredictionModelSelection from './PredictionModelSelection';
import {
  useCausalityTest,
  useConfigData,
  useFetchConfigPredictionHistory,
  usePredictionMode,
  useStationarityTest,
  useWhiteNoiseTest,
} from '../../../store/currentConfiguration/selectors';
import { FormContainer } from '../../CreateConfiguration/DatasetForm/styles';
import Seasonality from './Seasonality';

type TProps = {
  readonly predictionResult?: TARIMAResult | TVARResult; // tvarresult
  readonly isPredictionLoading: boolean;
};

const Analysis = ({ predictionResult, isPredictionLoading }: TProps) => {
  const [displayedPredictionMode, setDisplayedPredictionMode] =
    usePredictionMode();

  const {
    data: timeseriesData,
    isConfigurationLoading,
    valueProperties,
  } = useConfigData();
  const [, isHistoryLoading] = useFetchConfigPredictionHistory();

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

  const formMethods = useForm({
    defaultValues: predictionResult ? { ...predictionResult.inputData } : {},
  });
  useEffect(() => {
    formMethods.reset(
      predictionResult ? { ...predictionResult.inputData } : {},
    );
  }, [formMethods, predictionResult]);

  if (isConfigurationLoading) return null;

  const steps = [
    (key) => <Seasonality key={key} index={key} />,
    (key) => (
      <StationarityTest
        key={key}
        index={key}
        isVisible
        stationarityTestResult={stationarityTestResult}
        propertiesToTest={valueProperties}
        timeseriesData={timeseriesData}
        handleFetchDataStationarityTest={() =>
          handleFetchDataStationarityTest(valueProperties)
        }
        isStationarityTestLoading={isStationarityTestLoading}
      />
    ),
    (key) => (
      <WhiteNoiseTest
        isVisible
        key={key}
        index={key}
        whiteNoiseResult={whiteNoiseResult}
        isWhiteNoiseLoading={isWhiteNoiseLoading}
        handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
      />
    ),
    (key) => (
      <CausalityTest
        isVisible
        key={key}
        index={key}
        causalityTestResult={causalityTestResult}
        isCausalityTestLoading={isCausalityTestLoading}
        handleFetchGrangerDataCausalityTest={
          handleFetchGrangerDataCausalityTest
        }
      />
    ),
  ].filter(identity);

  return (
    <Box>
      {isHistoryLoading || !displayedPredictionMode ? (
        <Skeleton height={400} />
      ) : (
        <FormProvider {...formMethods}>
          <FormContainer onSubmit={noop}>
            <Card sx={{ p: 4 }} variant="outlined">
              <Grid container rowGap={2}>
                <Typography variant="h5">Get to know your data</Typography>
                {map(steps, (renderStep, index: number) => (
                  <>{renderStep!(index + 1)}</>
                ))}
                <Divider
                  flexItem
                  sx={{ width: '100%' }}
                  component="div"
                  orientation="horizontal"
                />
                <PredictionModelSelection
                  predictionMode={displayedPredictionMode}
                  setPredictionMode={
                    predictionResult?.predictionMode
                      ? noop
                      : setDisplayedPredictionMode
                  }
                  isDisabled={predictionResult?.predictionMode}
                />
                {displayedPredictionMode === EPredictionMode.VAR ? (
                  <VARPrediction
                    // index={key}
                    isVisible
                    varResult={predictionResult}
                    isLoading={isPredictionLoading}
                  />
                ) : (
                  <ARIMAPrediction
                    // index={key}
                    isVisible
                    arimaResult={predictionResult}
                    isLoading={isPredictionLoading}
                  />
                )}
              </Grid>
            </Card>
          </FormContainer>
        </FormProvider>
      )}
    </Box>
  );
};

export default Analysis;
