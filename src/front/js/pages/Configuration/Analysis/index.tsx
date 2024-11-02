import React, { useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import { identity, map, noop } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { Card, Divider, Grid, Skeleton, Typography } from '@mui/material';

import StationarityTest from './StationarityTest';
import CausalityTest from './CausalityTest';
import WhiteNoiseTest from './WhiteNoiseTest';
import VARPrediction from './VARPrediction';
import ARIMAPrediction from './ARIMAPrediction';
import {
  EAnalysisFormFields,
  EPredictionMode,
  TARIMAResult,
  THistoryEntry,
  TPredictionResult,
  TVARResult,
} from './types';
import PredictionModelSelection from './PredictionModelSelection';
import {
  useCausalityTest,
  useConfigData,
  useFetchConfigPredictionHistory,
  usePredictionMode,
  useStationarityTest,
  useWhiteNoiseTest,
} from '../../../store/currentConfiguration/selectors';
import Seasonality from './Seasonality';

type TProps = {
  readonly predictionResult?: TPredictionResult | THistoryEntry;
  readonly isPredictionLoading: boolean;
};

const Analysis = ({ predictionResult, isPredictionLoading }: TProps) => {
  const [displayedPredictionMode, setDisplayedPredictionMode] =
    usePredictionMode();

  const {
    data: timeseriesData,
    isConfigurationLoading,
    valueProperties,
    ...rest
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

  const defaultInputData = useMemo(
    () =>
      (predictionResult as THistoryEntry)?.inputData || {
        [EAnalysisFormFields.causalityMaxLagOrder]: 1,
        [EAnalysisFormFields.horizon]: 20,
        [EAnalysisFormFields.minP]: 0,
        [EAnalysisFormFields.maxP]: 1,
        [EAnalysisFormFields.minQ]: 0,
        [EAnalysisFormFields.maxQ]: 1,
      },
    [predictionResult],
  );
  const formMethods = useForm({ defaultValues: { ...defaultInputData } });
  useEffect(() => {
    formMethods.reset(predictionResult ? { ...defaultInputData } : {});
  }, [defaultInputData, formMethods, predictionResult]);

  const periodsInSeason = formMethods.watch(
    EAnalysisFormFields.periodsInSeason,
  );

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
          handleFetchDataStationarityTest(valueProperties, periodsInSeason)
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
    (key) =>
      valueProperties.length > 1 && (
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
          <form onSubmit={noop}>
            <Card sx={{ p: 4 }} variant="outlined">
              <Grid container rowGap={2}>
                <Grid item md={12}>
                  <Typography variant="h5">Get to know your data</Typography>
                </Grid>
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
                  setPredictionMode={setDisplayedPredictionMode}
                />
                {displayedPredictionMode === EPredictionMode.VAR ? (
                  <VARPrediction
                    isVisible
                    varResult={predictionResult as TVARResult}
                    isLoading={isPredictionLoading}
                  />
                ) : (
                  <ARIMAPrediction
                    isVisible
                    arimaResult={predictionResult as TARIMAResult}
                    isLoading={isPredictionLoading}
                  />
                )}
              </Grid>
            </Card>
          </form>
        </FormProvider>
      )}
    </Box>
  );
};

export default Analysis;
