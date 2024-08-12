import { Grid, Switch, TextField, Typography } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { EAnalysisFormFields } from './types';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import AnalysisSection from './AnalysisSection';
import { FIELD_LABEL_PROPS } from '../../../consts';

const Seasonality = ({ index }) => {
  const formMethods = useFormContext();
  const {
    control,
    register,
    formState: { isSubmitting },
    watch,
  } = formMethods;

  const isDataSeasonal = watch(EAnalysisFormFields.isSeasonal);

  return (
    <AnalysisSection>
      <AnalysisSection.Header index={index}>
        Provide seasonality information
      </AnalysisSection.Header>
      <Grid
        item
        md={12}
        justifyContent="center"
        display="flex"
        flexDirection="column"
      >
        <Typography variant="subtitle2">
          Note that seasonality information influences the results of some tests
          and prediction.
        </Typography>
      </Grid>
      <Grid
        item
        md={2}
        justifyContent="center"
        display="flex"
        flexDirection="column"
      >
        <Controller
          {...register(EAnalysisFormFields.isSeasonal)}
          control={control}
          render={({ field }) => (
            <>
              <InfoOverlay
                id="is-seasonal"
                label="Data is seasonal"
                {...FIELD_LABEL_PROPS}
              >
                <InfoOverlay.Popover>
                  Seasonality in time series refers to regular and predictable
                  patterns that repeat over a specific period, for example
                  daily, weekly, monthly, quarterly, yearly. Seasonal pattern
                  always repeats with the fixed and known frequency.
                </InfoOverlay.Popover>
              </InfoOverlay>
              <Switch {...field} checked={!!field.value} sx={{ height: 40 }} />
            </>
          )}
        />
      </Grid>
      {isDataSeasonal && (
        <Grid item md={2}>
          <InfoOverlay
            id="seasonality-periods"
            label="Periods"
            {...FIELD_LABEL_PROPS}
          >
            <InfoOverlay.Popover>
              Periods stand for the length of a season. For instance, if a
              dataset consists of daily data logs that repeat weekly, the number
              of periods in a season is 7 days. If a dataset contains hourly
              data with a daily repeating pattern, the number of periods is 24
              hours.
            </InfoOverlay.Popover>
          </InfoOverlay>
          <TextField
            {...register(EAnalysisFormFields.periodsInSeason)}
            size="small"
            type="number"
            id="periodsInSeason"
            sx={{ width: '100%' }}
            required={isDataSeasonal}
          />
        </Grid>
      )}
    </AnalysisSection>
  );
};

export default Seasonality;
