import React from 'react';
import { Typography, Stack, Chip } from '@mui/material';
import { map, upperCase, round } from 'lodash';
import * as d3Scale from 'd3-scale';
import { PRECISION } from '../../../consts';
import { TPredictionEvaluation } from './types';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';

type TProps = {
  readonly evaluation: { readonly [property: string]: TPredictionEvaluation };
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
};

const EvaluationIndicators = ({ evaluation, errorColorScale }: TProps) => {
  return (
    <>
      <Typography variant="subtitle1" component="div" color="text.secondary">
        <InfoOverlay label="Errors" id="Errors">
          <InfoOverlay.Popover>A</InfoOverlay.Popover>
        </InfoOverlay>
      </Typography>
      {map(evaluation, (values, key) => {
        return (
          <>
            <Typography variant="subtitle2">{key}</Typography>
            <Stack direction="row" gap={0.5} flexWrap="wrap" mb={1}>
              {map(values, (indicatorValue, indicatorKey) => {
                const background = errorColorScale(
                  `evaluation.${key}.${indicatorKey}`,
                )(indicatorValue);
                return (
                  <Chip
                    size="small"
                    sx={{ background }}
                    label={
                      <>
                        {upperCase(indicatorKey)}:{' '}
                        {round(indicatorValue, PRECISION)}
                      </>
                    }
                  />
                );
              })}
            </Stack>
          </>
        );
      })}
    </>
  );
};

export default EvaluationIndicators;
