import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Grid, Drawer } from '@mui/material';

import { AppPage, Content, Sidebar, HistoryDrawer } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
import json from '../../../../api/data/test_data/ArimaV2Dataset.json';
import { TDataProperty, TTimeseriesData, TTimeseriesDatum } from 'front/js/types';
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
  useSelectedProps,
  useStationarityTest,
  useTimeseriesProp,
  useWhiteNoiseTest
} from '../../store/configuration/selectors';
import PredictionHistory from './PredictionHistory';

const App = () => {
  const [timeProperty] = useTimeseriesProp();
  const [valueProperties] = useSelectedProps();

  const [timeseriesData, setTimeseriesData] = useConfigData();

  const [sortedTSData, setSortedTSData] = useState<TTimeseriesData>([]);
  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  const [selectedDataBoundaries, setSelectedDataBoundaries] = useSelectedDataBoundaries();

  useEffect(() => {
    const mappedJSON = json.map((value) => ({ ...value, date: new Date(value.date).getTime() }));
    setTimeseriesData(mappedJSON as TTimeseriesData);
  }, [setTimeseriesData]);

  const [stationarityTestResult, handleFetchDataStationarityTest, isStationarityTestLoading] =
    useStationarityTest();

  const [whiteNoiseResult, handleFetchIsWhiteNoise, isWhiteNoiseLoading] = useWhiteNoiseTest();

  const [causalityTestResult, handleFetchGrangerDataCausalityTest, isCausalityTestLoading] =
    useCausalityTest();

  const [predictionResult, handleFetchPrediction, isPredictionLoading] = usePrediction();

  const predictionHistory = useGetPredictionHistory();
  const [displayedPredictionId, setDisplayedPredictionId] = useDisplayedPredictionId();
  // const isDisplayedItemInitialized = useRef();
  useEffect(() => {
    setDisplayedPredictionId(predictionHistory?.[0]?.id);
  }, []);

  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const dataLabels =
    (selectedProp?.value &&
      predictionResult && [
        {
          valueX: new Date(predictionResult?.lastTrainPoint?.dateTime).getTime(),
          label: 'Train data threshold'
        }
      ]) ||
    [];

  useEffect(() => {
    if (timeProperty?.value && timeseriesData.length) {
      const sorted = timeseriesData
        .sort((a: TTimeseriesDatum, b: TTimeseriesDatum) => {
          // sort ascending: June, July, August
          return (a[timeProperty.value] as number) - (b[timeProperty.value] as number) ? -1 : 1;
        })
        .map((d) => ({ ...d, date: new Date(d.date).getTime() }));

      setSortedTSData(sorted);
    }
  }, [timeProperty, timeseriesData]);

  const [open, setOpen] = useState(false);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useIsHistoryDrawerOpen();

  return (
    <AppPage>
      {/* <Drawer open={open} onClose={(_e, _v) => setOpen(false)} hideBackdrop>
        <Sidebar>
          <FormProvider {...methods}>
            <DatasetForm timeseriesData={timeseriesData} setTimeseriesData={setTimeseriesData} />
          </FormProvider>
        </Sidebar>
      </Drawer> */}

      <Content>
        <SparkLineChartsBlock
          valueProperties={valueProperties || []}
          timeProperty={timeProperty}
          timeseriesData={sortedTSData}
          predictionData={predictionResult}
          setSelectedDataBoundaries={setSelectedDataBoundaries}
          selectedAreaBounds={selectedDataBoundaries}
          selectedProp={selectedProp}
          setSelectedProp={setSelectedProp}
          dataLabels={dataLabels}
          defaultIsTrainingDataSelectionOn={isHistoryPredictionSelected}
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
              handleFetchIsWhiteNoise={() => handleFetchIsWhiteNoise(valueProperties)}
              predictionResult={predictionResult}
              isPredictionLoading={isPredictionLoading}
              isCausalityTestLoading={isCausalityTestLoading}
              causalityTestResult={causalityTestResult}
              handleFetchGrangerDataCausalityTest={handleFetchGrangerDataCausalityTest}
              handleFetchPrediction={(params) => handleFetchPrediction(params, timeProperty)}
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
    </AppPage>
  );
};

export default App;
