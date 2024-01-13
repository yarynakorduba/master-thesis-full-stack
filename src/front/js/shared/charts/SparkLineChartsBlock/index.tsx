import React, { useEffect, useState } from "react";
import { map, maxBy, minBy } from "lodash";

import { Content } from "../../../pages/App/styles";
import { formatUnixToDate, formatNumber } from "../../../utils/formatters";
import LineChart from "../LineChart";
import SparkLineChart from "../LineChart/SparkLineChart";
import { TTimeseriesData } from "../../../types";

type TDataProperty = {
  readonly value: number;
  readonly label: string;
};

const constructLineChartDataFromTs = (
  valueProperty: TDataProperty | undefined,
  timeProperty: TDataProperty | undefined,
  data: TTimeseriesData,
) => {
  return valueProperty?.value && timeProperty?.value
    ? {
        id: "timeseries",
        label: valueProperty.label || "",
        color: "red",
        datapoints: map(data, (datum) => ({
          valueX: datum[timeProperty?.value],
          valueY: +datum[valueProperty.value],
        })),
      }
    : undefined;
};

const constructLineChartDataFromARIMAResult = (xValues, interval: number, start: number) => {
  return xValues
    ? {
        id: "ARIMA",
        label: "ARIMA",
        color: "blue",
        datapoints: map(xValues, (datum, index: number) => ({
          valueX: start + (index + 1) * interval,
          valueY: datum,
        })).sort((a, b) => (b.valueX - a.valueX ? 1 : -1)),
      }
    : undefined;
};

const getMaxValue = (data) => maxBy(data, "valueY");
const getMinValue = (data) => minBy(data, "valueY");

type TProps = {
  readonly valueProperties: TDataProperty[];
  readonly timeProperty: TDataProperty;
  readonly timeseriesData: TTimeseriesData;
} & any;
const SparkLineChartsBlock = ({ valueProperties, timeProperty, timeseriesData, predictedData }: TProps) => {
  const [selectedProp, setSelectedProp] = useState<TDataProperty | undefined>();

  const lastTs = timeseriesData && timeProperty?.value && timeseriesData[timeseriesData.length - 1][timeProperty.value];

  const time = lastTs ? lastTs - timeseriesData[timeseriesData.length - 2][timeProperty.value] : undefined;
  if (timeseriesData && timeProperty) {
    console.log("LAST--- > ", timeseriesData[1], lastTs, time, timeseriesData[0][timeProperty.value]);
  }
  const predictedChartData =
    time && lastTs && predictedData[0]
      ? constructLineChartDataFromARIMAResult(predictedData[0], time, lastTs)
      : undefined;

  const firstProp = valueProperties?.[0];
  useEffect(() => {
    if (firstProp) setSelectedProp(firstProp);
  }, [firstProp]);

  const mainChartData = constructLineChartDataFromTs(selectedProp, timeProperty, timeseriesData);
  // const maxValue = getMaxValue(mainChartData?.[0]?.datapoints || []);
  // const minValue = getMinValue(mainChartData?.[0]?.datapoints || []);
  console.log("AAA!!!@@## -- > ", [mainChartData, predictedChartData]);
  const handleSparklineClick = (chartProp) => () => {
    setSelectedProp(chartProp);
  };
  if ( !mainChartData) {
    return null;
  }
  return (
    <Content>
      <LineChart
        heading={selectedProp?.label || ""}
        data={[mainChartData]}
        numXAxisTicks={5}
        numYAxisTicks={5}
        formatXScale={formatUnixToDate}
        formatYScale={formatNumber}
        height={250}
        padding={{ top: 30, bottom: 20, left: 40, right: 40 }}
      />
      <div>
        {map(valueProperties, (prop) => {
          const chartData = [constructLineChartDataFromTs(prop, timeProperty, timeseriesData)];
          return (
            <SparkLineChart
              heading={prop?.label || ""}
              data={chartData}
              formatYScale={formatNumber}
              height={90}
              width={300}
              onClick={handleSparklineClick(prop)}
            />
          );
        })}
      </div>
    </Content>
  );
};

export default SparkLineChartsBlock;
