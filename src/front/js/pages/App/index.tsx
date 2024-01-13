import React, { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { slice } from "lodash";
import DatasetForm from "./DatasetForm";
import { AppPage, Sidebar } from "./styles";
import SparkLineChartsBlock from "../../shared/charts/SparkLineChartsBlock";

const App = () => {
  const methods = useForm();
  const [timeseriesData, setTimeseriesData] = useState<any>([]);
  const [sortedTSData, setSortedTSData] = useState<any>([]);
  const [predictedData, setPredictedData] = useState<any>([]);

  if (sortedTSData) {
    console.log("TIMESERIES DATA --- > ", sortedTSData[0], sortedTSData[sortedTSData.length - 1]);
  }

  const valueProperties = useWatch({ control: methods.control, name: "prop" });
  const timeProperty = useWatch({ control: methods.control, name: "timeProperty" });

  useEffect(() => {
    if (timeProperty?.value && timeseriesData.length) {
      const sorted = timeseriesData.sort((a, b) => {
        return a[timeProperty.value] - b[timeProperty.value] ? 1 : -1;
      });
      // const sliced: any = slice(sorted, 0, 300);
      console.log("SORTED >>> ", sorted);
      setSortedTSData(sorted);
    }
  }, [timeProperty, timeseriesData]);

  const handleGetArimaResults = async (ts) => {
    // const results = await getARIMAResults(ts);
    // setPredictedData(results);
  };

  useEffect(() => {
    if (valueProperties?.[0]?.value && sortedTSData.length) {
      const ts = sortedTSData.map((d) => Number(d[valueProperties[0]?.value]));
      console.log("TIMESERIES --- > ", sortedTSData, ts, valueProperties);
      handleGetArimaResults(ts);
    }
  }, [sortedTSData, valueProperties]);

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
