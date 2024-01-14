import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import DatasetForm from './DatasetForm';
import { AppPage, Sidebar } from './styles';
import SparkLineChartsBlock from '../../shared/charts/SparkLineChartsBlock';
import json from './test.json';
import { TDataProperty } from 'front/js/types';

const App = () => {
  const methods = useForm();
  const [timeseriesData, setTimeseriesData] = useState<any>(json);
  const [sortedTSData, setSortedTSData] = useState<any>([]);
  const [predictedData, setPredictedData] = useState<any>([]);

  const valueProperties = useMemo(
    (): TDataProperty[] => [{ value: 'oxygen', label: 'oxygen' }],
    []
  ); //useWatch({ control: methods.control, name: "prop" });
  const timeProperty = useMemo(
    (): TDataProperty => ({ value: 'timestamp', label: 'timestamp' }),
    []
  ); //useWatch({ control: methods.control, name: "timeProperty" });

  useEffect(() => {
    if (timeProperty?.value && timeseriesData.length) {
      const sorted = timeseriesData.sort((a, b) => {
        return a[timeProperty.value] - b[timeProperty.value] ? 1 : -1;
      });
      setSortedTSData(sorted);
    }
  }, [timeProperty, timeseriesData]);

  // const handleGetArimaResults = async (ts) => {
  //   const results = await getARIMAResults(ts);
  //   setPredictedData(results);
  // };

  // useEffect(() => {
  //   if (valueProperties?.[0]?.value && sortedTSData.length) {
  //     const ts = sortedTSData.map((d) => Number(d[valueProperties[0]?.value]));
  //     handleGetArimaResults(ts);
  //   }
  // }, [sortedTSData, valueProperties]);

  return (
    <AppPage>
      <Sidebar>
        <FormProvider {...methods}>
          <DatasetForm timeseriesData={timeseriesData} setTimeseriesData={setTimeseriesData} />
        </FormProvider>
      </Sidebar>
      {sortedTSData?.length ? (
        <SparkLineChartsBlock
          valueProperties={valueProperties}
          timeProperty={timeProperty}
          timeseriesData={sortedTSData}
          predictedData={predictedData}
        />
      ) : null}
    </AppPage>
  );
};

export default App;
