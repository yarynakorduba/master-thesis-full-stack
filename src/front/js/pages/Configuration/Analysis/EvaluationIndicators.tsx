import React from 'react';
import { Typography, Stack, Chip, Box } from '@mui/material';
import { map, upperCase, round, noop } from 'lodash';
import * as d3Scale from 'd3-scale';
import { PRECISION } from '../../../consts';
import { TPredictionEvaluation } from './types';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';
import {
  PREDICTION_VALUE_PROP,
  PREDICTION_TIMESTAMP_PROP,
} from '../../../utils/prediction';
import { theme } from '../../../../styles/theme';

type TProps = {
  readonly evaluation: { readonly [property: string]: TPredictionEvaluation };
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
} & any;

const EvaluationIndicators = ({
  evaluation,
  errorColorScale,
  predictions,
}: TProps) => {
  const getChartData = (key, type: 'testPrediction' | 'realPrediction') => {
    const prediction = predictions?.[key];
    if (!prediction) return undefined;
    return constructLineChartDataFromTs(
      PREDICTION_VALUE_PROP,
      PREDICTION_TIMESTAMP_PROP,
      type === 'testPrediction'
        ? prediction?.testPrediction
        : prediction?.realPrediction,
      type === 'testPrediction'
        ? theme.palette.charts.chartPink
        : theme.palette.charts.chartFuchsia,
      '',
    );
  };

  return (
    <>
      <Typography variant="subtitle1" component="div" color="text.secondary">
        Prediction
      </Typography>
      {map(evaluation, (values, key) => {
        const chartTestData = getChartData(key, 'testPrediction');
        const chartRealData = getChartData(key, 'realPrediction');
        return (
          <>
            <Stack
              direction="row"
              columnGap={0.5}
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">{key}</Typography>
              <Stack
                flexBasis="100%"
                flexGrow={1}
                direction="row"
                gap={0.25}
                flexWrap="nowrap"
              >
                {map(values, (indicatorValue, indicatorKey) => {
                  const background = errorColorScale(
                    `evaluation.${key}.${indicatorKey}`,
                  )(indicatorValue);
                  return (
                    <Chip
                      size="small"
                      sx={{ background }}
                      label={
                        <Typography noWrap>
                          {upperCase(indicatorKey)}:{' '}
                          {round(indicatorValue, PRECISION)}
                        </Typography>
                      }
                    />
                  );
                })}
              </Stack>
            </Stack>
            <Box width="100%" sx={{ mb: 1 }}>
              <SparkLineChart
                data={
                  chartTestData && chartRealData
                    ? [chartTestData, chartRealData]
                    : []
                }
                height={45}
                width={300}
                onClick={noop}
                padding={{ top: 4, bottom: 8, left: 0, right: 0 }}
                numTicks={0}
              />
            </Box>
          </>
        );
      })}
    </>
  );
};

export default EvaluationIndicators;
