import React, { Fragment } from 'react';
import { Typography, Stack, Chip, Box } from '@mui/material';
import { map, upperCase, noop, isEmpty } from 'lodash';
import * as d3Scale from 'd3-scale';
import { useTheme } from '@mui/material';

import { TPredictionResult } from './Analysis/types';
import { SparkLineChart } from '../../sharedComponents/charts/LineChart';
import { getHistoryLineChartData } from './PredictionHistory/utils';
import { formatNumber } from '../../utils/formatters';
import { TTimeseriesData, TDataProperty } from '../../types';

type TProps = {
  readonly historyEntry: TPredictionResult;
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
  readonly timeseriesData: TTimeseriesData;
  readonly timeProperty: TDataProperty;
};

const EvaluationIndicators = ({
  historyEntry,
  timeseriesData,
  errorColorScale,
  timeProperty,
}: TProps) => {
  const { palette } = useTheme();
  if (!historyEntry || isEmpty(timeseriesData) || !timeProperty) return null;
  return (
    <>
      <Typography variant="subtitle1" component="div" color="text.secondary">
        Prediction
      </Typography>
      {map(historyEntry.evaluation, (values, analyzedPropKey) => {
        const { lineData, thresholdData } = getHistoryLineChartData(
          historyEntry.id,
          palette,
          timeseriesData,
          historyEntry,
          timeProperty.value,
          analyzedPropKey,
        );
        return (
          <Fragment key={analyzedPropKey}>
            <Stack
              direction="row"
              columnGap={0.5}
              flexWrap="wrap"
              justifyContent="space-between"
            >
              <Typography variant="subtitle2" sx={{ marginBottom: 0.5 }}>
                {analyzedPropKey}
              </Typography>
              <Stack
                flexBasis="100%"
                flexGrow={1}
                direction="row"
                gap={0.5}
                sx={{ marginBottom: 0.5 }}
                flexWrap="nowrap"
              >
                {map(values, (indicatorValue, indicatorKey) => {
                  const keyPath = `evaluation.${analyzedPropKey}.${indicatorKey}`;
                  const background = errorColorScale(keyPath)(indicatorValue);
                  return (
                    <Chip
                      key={keyPath}
                      size="small"
                      sx={{ background }}
                      label={
                        <Typography noWrap>
                          {upperCase(indicatorKey)}:{' '}
                          {formatNumber(indicatorValue)}
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
                thresholdData={thresholdData}
                height={45}
                onClick={noop}
                padding={{ top: 4, bottom: 8, left: 0, right: 0 }}
                numTicks={0}
              />
            </Box>
          </Fragment>
        );
      })}
    </>
  );
};

export default EvaluationIndicators;
