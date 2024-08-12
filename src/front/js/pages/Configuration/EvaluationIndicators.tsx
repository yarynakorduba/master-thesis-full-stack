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
import InfoOverlay from '../../sharedComponents/InfoOverlay';

type TProps = {
  readonly historyEntry: TPredictionResult;
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
  readonly timeseriesData: TTimeseriesData;
  readonly timeProperty: TDataProperty;
};

const INDICATOR_TEXTS_MAP = {
  // https://www.int-res.com/articles/cr2005/30/c030p079.pdf
  mae: 'MAE stands for Mean Absolute Error. It helps in assessing prediction models perfomance. The higher the values of MAE, the worse the performance is. To calculate MAE, we sum the absolute values of the errors to obtain the total error, and then divide the total error by n the number of values.',
  // https://www.int-res.com/articles/cr2005/30/c030p079.pdf
  rmse: 'RMSE stands for Root Mean Squared Error. It helps in assessing prediction models perfomance. The higher the values of MAE, the worse the performance is. To calculate RMSE, we first sum the individual squared errors. Further, we divide the total square error by n and take the square root out of it.',
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
                  if (!INDICATOR_TEXTS_MAP[indicatorKey]) {
                    return (
                      <Typography noWrap>
                        {upperCase(indicatorKey)}:{' '}
                        {formatNumber(indicatorValue)}
                      </Typography>
                    );
                  }
                  return (
                    <InfoOverlay
                      label={
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
                      }
                      id={upperCase(indicatorKey)}
                    >
                      <InfoOverlay.Popover>
                        {INDICATOR_TEXTS_MAP[indicatorKey]}
                      </InfoOverlay.Popover>
                    </InfoOverlay>
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
