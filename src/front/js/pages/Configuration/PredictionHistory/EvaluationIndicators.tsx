import React from 'react';
import { Typography, Stack, Chip, Box } from '@mui/material';
import { map, upperCase, round, noop } from 'lodash';
import * as d3Scale from 'd3-scale';
import { useTheme } from '@mui/material';

import { PRECISION } from '../../../consts';
import { TPredictionEvaluation } from '../Analysis/types';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import { getHistoryLineChartData } from './utils';

type TProps = {
  readonly evaluation: { readonly [property: string]: TPredictionEvaluation };
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
} & any;

const EvaluationIndicators = ({
  timeseriesData,
  evaluation,
  errorColorScale,
  predictions,
  timeProperty,
}: TProps) => {
  const { palette } = useTheme();

  return (
    <>
      <Typography variant="subtitle1" component="div" color="text.secondary">
        Prediction
      </Typography>
      {map(evaluation, (values, analyzedPropKey) => {
        // const mappedARIMAPredictions = reduce(
        //   valueProperties,
        //   (accum, prop) => ({
        //     ...accum,
        //     [prop.value]: convertPredictionData(historyEntry, prop.value),
        //   }),
        //   {},
        // );
        const { lineData, thresholdData } = getHistoryLineChartData(
          palette,
          timeseriesData,
          predictions,
          timeProperty.value,
          analyzedPropKey,
        );
        return (
          <>
            <Stack
              direction="row"
              columnGap={0.5}
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2">{analyzedPropKey}</Typography>
              <Stack
                flexBasis="100%"
                flexGrow={1}
                direction="row"
                gap={0.25}
                flexWrap="nowrap"
              >
                {map(values, (indicatorValue, indicatorKey) => {
                  const background = errorColorScale(
                    `evaluation.${analyzedPropKey}.${indicatorKey}`,
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
                data={lineData}
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
