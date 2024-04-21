import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DatasetForm from './DatasetForm';
import { map } from 'lodash';
import Drawer from '@mui/material/Drawer';

import { AppPage, Content, Sidebar } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
import json from '../../../../../test_data/ArimaV2Dataset.json';
import { TDataProperty, TTimeseriesData, TTimeseriesDatum } from 'front/js/types';
import Analysis from './Analysis';
import {
  useCausalityTest,
  useConfigData,
  usePrediction,
  useSelectedConfigData,
  useStationarityTest,
  useWhiteNoiseTest
} from '../../store/configuration/selectors';
import PredictionHistory from './PredictionHistory';
import { Grid } from '@mui/material';

const App = () => {
  const methods = useForm();
  const [timeseriesData, setTimeseriesData] = useConfigData();
  const [selectedData, setSelectedData] = useSelectedConfigData();

  const [sortedTSData, setSortedTSData] = useState<TTimeseriesData>([]);
  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();

  useEffect(() => {
    console.log('HAppening');
    setTimeseriesData(json as TTimeseriesData);
  }, [setTimeseriesData]);

  const valueProperties = useMemo(
    (): TDataProperty[] => [{ value: 'value', label: 'passengers' }],
    []
  );
  const timeProperty = useMemo(() => ({ value: 'date', label: 'date' }), []); //useWatch({ control: methods.control, name: "timeProperty" });

  const [stationarityTestResult, handleFetchDataStationarityTest, isStationarityTestLoading] =
    useStationarityTest();

  const [whiteNoiseResult, handleFetchIsWhiteNoise, isWhiteNoiseLoading] = useWhiteNoiseTest();

  const [causalityTestResult, handleFetchGrangerDataCausalityTest, isCausalityTestLoading] =
    useCausalityTest();

  const [predictionResult, handleFetchPrediction, isPredictionLoading] = usePrediction();
  console.log('PREDICTION RESULT -- > ', predictionResult);

  const mappedARIMAPrediction = useMemo(() => {
    if (!(selectedProp?.value && predictionResult)) return [[], []];

    const convertARIMADatapoint = (value, index): TTimeseriesDatum => {
      return {
        [timeProperty.value]: +index,
        [selectedProp?.value]: value
      };
    };
    return [
      map(predictionResult?.prediction, convertARIMADatapoint),
      map(predictionResult?.realPrediction, convertARIMADatapoint)
    ];
  }, [selectedProp?.value, predictionResult, timeProperty.value]);

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

  const [open, setOpen] = useState(true);

  return (
    <AppPage>
      <Drawer open={open} onClose={(_e, _v) => setOpen(false)}>
        <Sidebar>
          <FormProvider {...methods}>
            <DatasetForm timeseriesData={timeseriesData} setTimeseriesData={setTimeseriesData} />
          </FormProvider>
        </Sidebar>
      </Drawer>

      <Content>
        {sortedTSData?.length ? (
          <SparkLineChartsBlock
            valueProperties={valueProperties}
            timeProperty={timeProperty}
            timeseriesData={sortedTSData}
            predictionData={mappedARIMAPrediction}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            selectedProp={selectedProp}
            setSelectedProp={setSelectedProp}
            dataLabels={dataLabels}
          />
        ) : null}
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
              handleFetchPrediction={handleFetchPrediction}
            />
          </Grid>
          <Grid item md={6}>
            <PredictionHistory />
          </Grid>
        </Grid>
      </Content>
    </AppPage>
  );
};

export default App;
