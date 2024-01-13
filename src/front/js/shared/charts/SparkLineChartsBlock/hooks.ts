import { maxBy, minBy } from "lodash";
import { TLineChartDatapoint, TLineChartSerie } from "front/js/types";


export const useTimeseriesMinMaxValues = (chartData: TLineChartDatapoint[]): [TLineChartDatapoint | undefined, TLineChartDatapoint | undefined] => {
    const getMaxValue = (data) => maxBy<TLineChartDatapoint>(data, "valueY");
    const getMinValue = (data) => minBy<TLineChartDatapoint>(data, "valueY");
    return [getMinValue(chartData), getMaxValue(chartData)];
}