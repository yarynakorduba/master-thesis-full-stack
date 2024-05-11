import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { flow, isNil, map, reverse, sortBy } from 'lodash';

import { Content, Sidebar, HistoryDrawer } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
import json from '../../../../api/data/test_data/ArimaV2Dataset.json';
import {
  TDataProperty,
  TTimeseriesData,
  TTimeseriesDatum,
} from 'front/js/types';
import Analysis from './Analysis';
import {
  useCausalityTest,
  useConfigData,
  useDisplayedPredictionId,
  useFetchConfiguration,
  useGetPredictionHistory,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
  usePrediction,
  useSelectedDataBoundaries,
  useSelectedProps,
  useStationarityTest,
  useTimeseriesProp,
  useWhiteNoiseTest,
} from '../../store/configuration/selectors';
import PredictionHistory from './PredictionHistory';
import PredictionInfoText from './Analysis/PredictionInfoText';

const Configuration = () => {
  const { id } = useParams();
  const fetchConfiguration = useFetchConfiguration();

  useEffect(() => {
    if (!isNil(id)) fetchConfiguration(id);
  }, [fetchConfiguration, id]);

  const [timeProperty] = useTimeseriesProp();
  const [valueProperties] = useSelectedProps();

  const [configName, timeseriesData, setTimeseriesData] = useConfigData();

  const [sortedTSData, setSortedTSData] = useState<TTimeseriesData>([]);
  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  const [selectedDataBoundaries, setSelectedDataBoundaries] =
    useSelectedDataBoundaries();

  useEffect(() => {
    const mappedJSON = flow(
      (data) =>
        map(data, (value) => ({
          ...value,
          date: new Date(value.date).getTime(),
        })),
      (data) => sortBy(data, (d) => d.date),
      (data) => reverse(data),
    )(json);
    setTimeseriesData(mappedJSON as TTimeseriesData);
    // to test white noise
    // const mappedJSON = json.map((value, index) => ({
    //   value,
    //   date: new Date().getTime() + index * 1000,
    // }));
    // setTimeseriesData(mappedJSON as TTimeseriesData);
  }, [setTimeseriesData]);

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
    setDisplayedPredictionId(predictionHistory?.[0]?.id);
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

  useEffect(() => {
    if (timeProperty?.value && timeseriesData.length) {
      const sorted = timeseriesData
        .sort((a: TTimeseriesDatum, b: TTimeseriesDatum) => {
          // sort ascending: June, July, August
          return (a[timeProperty.value] as number) -
            (b[timeProperty.value] as number)
            ? -1
            : 1;
        })
        .map((d) => ({ ...d, date: new Date(d.date).getTime() }));

      setSortedTSData(sorted);
    }
  }, [timeProperty, timeseriesData]);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] =
    useIsHistoryDrawerOpen();

  return (
    <>
      {/* <Drawer open={open} onClose={(_e, _v) => setOpen(false)} hideBackdrop>
        <Sidebar>
          <FormProvider {...methods}>
            <DatasetForm
              timeseriesData={timeseriesData}
              setTimeseriesData={setTimeseriesData}
            />
          </FormProvider>
        </Sidebar>
      </Drawer> */}

      <Content isOpen={isHistoryDrawerOpen}>
        <PredictionInfoText
          prediction={predictionResult}
          isHistoryPredictionSelected={isHistoryPredictionSelected}
        />

        <SparkLineChartsBlock
          configName={configName}
          valueProperties={valueProperties || []}
          timeProperty={timeProperty}
          timeseriesData={sortedTSData}
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
