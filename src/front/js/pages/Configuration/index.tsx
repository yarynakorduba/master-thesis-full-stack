import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { isNil } from 'lodash';

import { Content, Sidebar, HistoryDrawer } from './styles';
import SparkLineChartsBlock from '../../sharedComponents/charts/SparkLineChartsBlock';
// import json from '../../../../api/data/test_data/ArimaV2Dataset.json';
import { TDataProperty } from 'front/js/types';
import Analysis from './Analysis';
import {
  useConfigData,
  useDisplayedPredictionId,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
  usePrediction,
  useSelectedDataBoundaries,
} from '../../store/currentConfiguration/selectors';
import PredictionHistory from './PredictionHistory';
import PredictionInfoText from './Analysis/PredictionInfoText';
import { isConfigurationDataIncomplete } from './utils';
import { ERoutePaths } from '../../types/router';

const Configuration = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    name: configName,
    data: timeseriesData,
    fetchConfiguration,
    isConfigurationLoading,
    timeProperty,
    valueProperties,
    configurationError,
  } = useConfigData();

  useEffect(() => {
    if (!isNil(id)) fetchConfiguration(id);
  }, [fetchConfiguration, id]);

  useEffect(() => {
    if (configurationError) {
      navigate(ERoutePaths.CONFIGURATIONS, { replace: true });
    }
  }, [configurationError, navigate]);

  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  const [selectedDataBoundaries, setSelectedDataBoundaries] =
    useSelectedDataBoundaries();

  const [predictionResult, handleFetchPrediction, isPredictionLoading] =
    usePrediction();
  const [, setDisplayedPredictionId] = useDisplayedPredictionId();

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

  const isDataIncomplete = isConfigurationDataIncomplete(
    timeseriesData,
    timeProperty,
    valueProperties,
  );

  return (
    <>
      <Content isOpen={isHistoryDrawerOpen}>
        <PredictionInfoText
          prediction={
            isDataIncomplete || isConfigurationLoading
              ? undefined
              : predictionResult
          }
          isHistoryPredictionSelected={isHistoryPredictionSelected}
          handleClearPredictionData={() => {
            setDisplayedPredictionId(undefined);
            setSelectedDataBoundaries(undefined);
          }}
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

        {!isDataIncomplete && !isConfigurationLoading && (
          <Grid container justifyContent="start" gap={3} wrap="nowrap">
            <Grid item md={6}>
              <Analysis
                predictionResult={predictionResult}
                isPredictionLoading={isPredictionLoading}
                handleFetchPrediction={(params) =>
                  handleFetchPrediction(params, timeProperty)
                }
              />
            </Grid>
            <Grid item md={6}></Grid>
          </Grid>
        )}
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
