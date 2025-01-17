import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { isNil } from 'lodash';

import { Content, Sidebar, HistoryDrawer } from './styles';
import SparkLineChartsBlock from '../../sharedComponents/charts/SparkLineChartsBlock';
import Analysis from './Analysis';
import {
  useConfigData,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
  useIsPredictionHistoryLoading,
  usePrediction,
  useSelectedDataBoundaries,
  useSelectedProps,
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
    if (!isNil(id)) {
      fetchConfiguration(id);
    }
  }, [fetchConfiguration, id]);

  useEffect(() => {
    if (configurationError) {
      navigate(ERoutePaths.CONFIGURATIONS, { replace: true });
    }
  }, [configurationError, navigate]);

  const [selectedProp, setSelectedProp] = useSelectedProps();
  const [selectedDataBoundaries, setSelectedDataBoundaries] =
    useSelectedDataBoundaries();

  const [predictionResult, isPredictionLoading] = usePrediction();

  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const isHistoryLoading = useIsPredictionHistoryLoading();

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
        <Typography
          variant="h1"
          fontWeight={400}
          sx={{
            fontSize: '2.5rem',
            mb: 2.5,
            display: 'flex',
            gap: 1,
            alignItems: 'end',
          }}
        >
          {configName}
        </Typography>

        <PredictionInfoText
          sx={{ textAlign: 'left', height: 36.5, marginTop: -3 }}
        />

        <SparkLineChartsBlock
          isConfigurationLoading={isConfigurationLoading || isHistoryLoading}
          configName={configName}
          valueProperties={valueProperties || []}
          timeProperty={timeProperty}
          timeseriesData={timeseriesData || []}
          predictionData={predictionResult}
          setSelectedDataBoundaries={setSelectedDataBoundaries}
          selectedAreaBounds={selectedDataBoundaries}
          selectedProp={selectedProp}
          setSelectedProp={setSelectedProp}
          defaultIsTrainingDataSelectionOn={
            isHistoryPredictionSelected &&
            !!predictionResult?.selectedDataBoundaries
          }
        />

        {!isDataIncomplete && !isConfigurationLoading && (
          <Analysis
            predictionResult={predictionResult}
            isPredictionLoading={isPredictionLoading}
          />
        )}
      </Content>
      <HistoryDrawer
        open={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        hideBackdrop
        anchor="right"
        variant="persistent"
      >
        <Sidebar isOpen={isHistoryDrawerOpen}>
          <PredictionHistory />
        </Sidebar>
      </HistoryDrawer>
    </>
  );
};

export default Configuration;
