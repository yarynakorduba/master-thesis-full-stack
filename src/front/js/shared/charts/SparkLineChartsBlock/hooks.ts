import { map, maxBy, minBy } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { TDataProperty, TLineChartDatapoint } from "front/js/types";


export const useTimeseriesMinMaxValues = (chartData: TLineChartDatapoint[]): [TLineChartDatapoint | undefined, TLineChartDatapoint | undefined] => {
    const getMaxValue = (data) => maxBy<TLineChartDatapoint>(data, "valueY");
    const getMinValue = (data) => minBy<TLineChartDatapoint>(data, "valueY");
    return [getMinValue(chartData), getMaxValue(chartData)];
}

export const useSmallestTimeUnit = (timeseriesData, timeProperty: TDataProperty) => {
    const lastTs = timeseriesData && timeProperty?.value && timeseriesData[timeseriesData.length - 1][timeProperty.value];
    const time = lastTs ? lastTs - timeseriesData[timeseriesData.length - 2][timeProperty.value] : undefined;  
    return [time, lastTs];
}

export const useWhiteNoise = (timeseriesData, selectedProp): any => {

    const [whiteNoiseTestResult, setWhiteNoiseTestResult] = useState(undefined);
    
    const fetchIsWhiteNoise = useCallback(async (data) => {
        const result = await fetch(`${process.env.BACKEND_URL}/api/white-noise`, {
            method: "POST",
            body: JSON.stringify({ data }),
            headers: {
                'Content-type':'application/json', 
            }
        });
        const resultJSON = await result.json();
        setWhiteNoiseTestResult(resultJSON);
      }, [])
      useEffect(() => {
        const dataForAnalysis = selectedProp?.value ? map(timeseriesData, datum => datum[selectedProp.value]): undefined;
        if (dataForAnalysis) {
            fetchIsWhiteNoise(dataForAnalysis);
        }
    }, [fetchIsWhiteNoise, selectedProp, timeseriesData]);

    return whiteNoiseTestResult;
}