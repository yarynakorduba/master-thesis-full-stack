import { map, maxBy, minBy, reduce } from 'lodash';
import { useCallback } from 'react';
import { TDataProperty, TLineChartDatapoint, TTimeseriesData } from 'front/js/types';
import {
  fetchDataStationarityTest,
  fetchGrangerDataCausalityTest,
  fetchIsWhiteNoise,
  fetchVARTest
} from '../../../apiCalls/analysis';
import { useFetch } from '../../../hooks/fetch';

export const useTimeseriesMinMaxValues = (
  chartData: TLineChartDatapoint[]
): [TLineChartDatapoint | undefined, TLineChartDatapoint | undefined] => {
  const getMaxValue = (data) => maxBy<TLineChartDatapoint>(data, 'valueY');
  const getMinValue = (data) => minBy<TLineChartDatapoint>(data, 'valueY');
  return [getMinValue(chartData), getMaxValue(chartData)];
};

export const useSmallestTimeUnit = (timeseriesData, timeProperty: TDataProperty) => {
  const lastTs =
    timeseriesData &&
    timeProperty?.value &&
    timeseriesData[timeseriesData.length - 1][timeProperty.value];
  const time = lastTs
    ? lastTs - timeseriesData[timeseriesData.length - 2][timeProperty.value]
    : undefined;
  return [time, lastTs];
};

type TWhiteNoiseResult = {
  readonly whiteNoiseResult: any;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise: any;
};
export const useWhiteNoise = (
  timeseriesData: TTimeseriesData,
  selectedProp: TDataProperty | undefined
): TWhiteNoiseResult => {
  const { data: result, isLoading, fetch: handleFetchIsWhiteNoise } = useFetch(fetchIsWhiteNoise);

  const handleFetch = useCallback(() => {
    const dataForAnalysis = selectedProp?.value
      ? map(timeseriesData, (datum) => datum[selectedProp.value])
      : undefined;
    if (dataForAnalysis) {
      handleFetchIsWhiteNoise(dataForAnalysis);
    }
  }, [selectedProp?.value, handleFetchIsWhiteNoise, timeseriesData]);

  return {
    whiteNoiseResult: result,
    isWhiteNoiseLoading: isLoading,
    handleFetchIsWhiteNoise: handleFetch
  };
};

export const useDataStationarityTest = (
  timeseriesData: TTimeseriesData,
  selectedProp: TDataProperty | undefined
) => {
  const {
    data: result,
    isLoading,
    fetch: handleFetchDataStationarityTest
  } = useFetch(fetchDataStationarityTest);

  // useEffect(() => {
  //   const dataForAnalysis = selectedProp?.value
  //     ? map(timeseriesData, (datum) => datum[selectedProp.value])
  //     : undefined;
  //   if (dataForAnalysis) {
  //     handleFetchDataStationarityTest(dataForAnalysis);
  //   }
  // }, [selectedProp?.value, handleFetchDataStationarityTest, timeseriesData]);

  return {
    stationarityTestResult: result,
    isStationarityTestLoading: isLoading,
    handleFetchDataStationarityTest
  };
};

export const useDataCausalityTest = (
  timeseriesData: TTimeseriesData,
  selectedProps: TDataProperty[]
) => {
  const {
    data: result,
    isLoading,
    fetch: handleFetchGrangerDataCausalityTest
  } = useFetch(fetchGrangerDataCausalityTest);

  const handleFetch = useCallback(() => {
    console.log(selectedProps?.[0]?.value, selectedProps?.[1]?.value);
    if (selectedProps?.[0]?.value && selectedProps?.[1]?.value) {
      const dataForAnalysis = map(timeseriesData, (datum) => [
        datum[selectedProps[0].value],
        datum[selectedProps[1].value]
      ]);

      if (dataForAnalysis) {
        handleFetchGrangerDataCausalityTest(dataForAnalysis);
      }
    }
  }, [selectedProps, handleFetchGrangerDataCausalityTest, timeseriesData]);

  return {
    causalityTestResult: result,
    isCausalityTestLoading: isLoading,
    handleFetchGrangerDataCausalityTest: handleFetch
  };
};

export const useVARTest = (timeseriesData: TTimeseriesData, selectedProps: TDataProperty[]) => {
  const { data: result, isLoading, fetch: fetchData } = useFetch(fetchVARTest);

  const handleFetchVARTest = useCallback(() => {
    console.log(selectedProps?.[0]?.value, selectedProps?.[1]?.value);
    const selectedProp1 = selectedProps?.[0]?.value;
    const selectedProp2 = selectedProps?.[1]?.value;

    const dataForAnalysis = reduce(
      timeseriesData,
      (accum, datum) => ({
        ...accum,
        [datum.timestamp]: {
          [selectedProp1]: datum[selectedProp1],
          [selectedProp2]: datum[selectedProp2]
        }
      }),
      {}
    );

    if (dataForAnalysis) {
      fetchData(dataForAnalysis);
    }
  }, [selectedProps, timeseriesData, fetchData]);

  return { varTestResult: result, isVARTestLoading: isLoading, handleFetchVARTest };
};
