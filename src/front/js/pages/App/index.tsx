import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DatasetForm from './DatasetForm';
import { map } from 'lodash';
import Drawer from '@mui/material/Drawer';

import { AppPage, Content, Sidebar } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
import json from '../../../../../test_data/ArimaV2Dataset.json';
import { TDataLabel, TDataProperty } from 'front/js/types';
import Analysis from '../../components/Analysis';
import {
  useDataStationarityTest,
  useWhiteNoise,
  useDataCausalityTest,
  useVAR,
  useARIMA
} from '../../components/Analysis/hooks';

const App = () => {
  const methods = useForm();
  const [timeseriesData, setTimeseriesData] = useState<any>(json);
  const [sortedTSData, setSortedTSData] = useState<any>([]);
  const [predictedData, setPredictedData] = useState<any>([]);

  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();
  const [selectedData, setSelectedData] = useState(timeseriesData);

  const valueProperties = useMemo(
    (): TDataProperty[] => [{ value: 'value', label: 'passengers' }],
    []
  );
  const timeProperty = useMemo(() => ({ value: 'date', label: 'date' }), []); //useWatch({ control: methods.control, name: "timeProperty" });

  const { isStationarityTestLoading, stationarityTestResult, handleFetchDataStationarityTest } =
    useDataStationarityTest(selectedData, valueProperties);
  const { isWhiteNoiseLoading, whiteNoiseResult, handleFetchIsWhiteNoise } = useWhiteNoise(
    selectedData,
    valueProperties
  );
  const { isCausalityTestLoading, causalityTestResult, handleFetchGrangerDataCausalityTest } =
    useDataCausalityTest(selectedData, valueProperties);

  const { isVARLoading, varResult, handleFetchVAR } = useVAR(selectedData);
  const { isARIMALoading, arimaResult, handleFetchARIMA } = useARIMA(selectedData);

  const mappedARIMAResult = useMemo(
    () =>
      (selectedProp?.value &&
        map((arimaResult as any)?.prediction, (value, index) => {
          return {
            [timeProperty.value]: +index,
            [selectedProp?.value]: value
          };
        })) ||
      [],
    [selectedProp?.value, arimaResult, timeProperty.value]
  );

  const dataLabels =
    (selectedProp?.value &&
      arimaResult && [
        {
          valueX: new Date((arimaResult as any)?.lastTrainPoint?.dateTime).getTime(),
          label: 'Train data threshold'
        }
      ]) ||
    [];

  console.log('AAA --- > ', dataLabels);

  useEffect(() => {
    if (timeProperty?.value && timeseriesData.length) {
      const sorted = timeseriesData
        .sort((a, b) => {
          // sort ascending: June, July, August
          return a[timeProperty.value] - b[timeProperty.value] ? -1 : 1;
        })
        .map((d) => ({ ...d, date: new Date(d.date).getTime() }));

      setSortedTSData(sorted);
    }
  }, [timeProperty, timeseriesData]);

  const [open, setOpen] = useState(true);

  return (
    <AppPage>
      <Drawer open={open} onClose={(e, v) => setOpen(false)}>
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
            predictionData={mappedARIMAResult}
            selectedData={selectedData}
            setSelectedData={setSelectedData}
            selectedProp={selectedProp}
            setSelectedProp={setSelectedProp}
            dataLabels={dataLabels as TDataLabel[]}
          />
        ) : null}
        <Analysis
          stationarityTestResult={stationarityTestResult}
          valueProperties={valueProperties}
          timeseriesData={timeseriesData}
          handleFetchDataStationarityTest={handleFetchDataStationarityTest}
          isStationarityTestLoading={isStationarityTestLoading}
          whiteNoiseResult={whiteNoiseResult}
          isWhiteNoiseLoading={isWhiteNoiseLoading}
          handleFetchIsWhiteNoise={handleFetchIsWhiteNoise}
          arimaResult={arimaResult}
          isARIMALoading={isARIMALoading}
          handleFetchARIMA={handleFetchARIMA}
          isVARLoading={isVARLoading}
          varResult={varResult}
          handleFetchVAR={handleFetchVAR}
        />
      </Content>
    </AppPage>
  );
};

export default App;
