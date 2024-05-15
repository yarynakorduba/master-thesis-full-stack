import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { isNil } from 'lodash';

import { Content, Sidebar, HistoryDrawer } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
// import json from '../../../../api/data/test_data/ArimaV2Dataset.json';
import { TDataProperty } from 'front/js/types';
import Analysis from './Analysis';
import {
  useCausalityTest,
  useConfigData,
  useDisplayedPredictionId,
  useGetPredictionHistory,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
  usePrediction,
  useSelectedDataBoundaries,
  useStationarityTest,
  useWhiteNoiseTest,
} from '../../store/configuration/selectors';
import PredictionHistory from './PredictionHistory';
import PredictionInfoText from './Analysis/PredictionInfoText';

const Configuration = () => {
  const { id } = useParams();

  const {
    name: configName,
    data: timeseriesData,
    fetchConfiguration,
    isConfigurationLoading,
    timeProperty,
    valueProperties,
  } = useConfigData();

  useEffect(() => {
    if (!isNil(id)) fetchConfiguration(id);
  }, [fetchConfiguration, id]);

  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  const [selectedDataBoundaries, setSelectedDataBoundaries] =
    useSelectedDataBoundaries();

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

  const [predictionResult, handleFetchPrediction, isPredictionLoading] =
    usePrediction();
  const predictionHistory = useGetPredictionHistory();
  const [, setDisplayedPredictionId] = useDisplayedPredictionId();
  useEffect(() => {
    if (predictionHistory.length) {
      setDisplayedPredictionId(predictionHistory?.[0]?.id);
    }
  }, []);

  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const dataLabels =
    (selectedProp?.value &&
      predictionResult && [
        {
          valueX: new Date(
            predictionResult?.lastTrainPoint?.dateTime,
          ).getTime(),
          label: 'Train data threshold',
        },
      ]) ||
    [];

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] =
    useIsHistoryDrawerOpen();

  return (
    <>
      <Content isOpen={isHistoryDrawerOpen}>
        <PredictionInfoText
          prediction={predictionResult}
          isHistoryPredictionSelected={isHistoryPredictionSelected}
        />

        <SparkLineChartsBlock
          isConfigurationLoading={isConfigurationLoading}
          configName={configName}
          valueProperties={valueProperties || []}
          timeProperty={timeProperty}
          timeseriesData={timeseriesData || []}
          predictionData={predictionResult}
          setSelectedDataBoundaries={setSelectedDataBoundaries}
          selectedAreaBounds={selectedDataBoundaries}
          selectedProp={selectedProp}
          setSelectedProp={setSelectedProp}
          dataLabels={dataLabels}
          defaultIsTrainingDataSelectionOn={
            isHistoryPredictionSelected &&
            !!predictionResult?.selectedDataBoundaries
          }
        />

        <Grid container justifyContent="start" gap={3} wrap="nowrap">
          <Grid item md={6}>
            <Analysis
              isConfigurationLoading={isConfigurationLoading}
              stationarityTestResult={stationarityTestResult}
              valueProperties={valueProperties}
              timeseriesData={timeseriesData}
              handleFetchDataStationarityTest={() =>
                handleFetchDataStationarityTest(valueProperties)
              }
              isStationarityTestLoading={isStationarityTestLoading}
              whiteNoiseResult={whiteNoiseResult}
              isWhiteNoiseLoading={isWhiteNoiseLoading}
              handleFetchIsWhiteNoise={() =>
                handleFetchIsWhiteNoise(valueProperties)
              }
              predictionResult={predictionResult}
              isPredictionLoading={isPredictionLoading}
              isCausalityTestLoading={isCausalityTestLoading}
              causalityTestResult={causalityTestResult}
              handleFetchGrangerDataCausalityTest={
                handleFetchGrangerDataCausalityTest
              }
              handleFetchPrediction={(params) =>
                handleFetchPrediction(params, timeProperty)
              }
            />
          </Grid>
          <Grid item md={6}></Grid>
        </Grid>
      </Content>
      <HistoryDrawer
        open={isHistoryDrawerOpen}
        onClose={(_e, _v) => setIsHistoryDrawerOpen(false)}
        hideBackdrop
        anchor="right"
        variant="persistent"
      >
        <Sidebar>
          <PredictionHistory />
        </Sidebar>
      </HistoryDrawer>
    </>
  );
};

export default Configuration;
