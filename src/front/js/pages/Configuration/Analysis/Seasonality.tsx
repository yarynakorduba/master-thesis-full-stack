import { Grid, Switch, TextField, Typography } from '@mui/material';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { EAnalysisFormFields } from './types';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import AnalysisSection from './AnalysisSection';

const Seasonality = ({ index }) => {
  const formMethods = useFormContext();
  const {
    control,
    register,
    formState: { isSubmitting },
    watch,
  } = formMethods;

  const isDataSeasonal = watch(EAnalysisFormFields.isSeasonal);

  console.log('WATCHI  !!! > ', watch());
  return (
    <AnalysisSection>
      <AnalysisSection.Header index={index}>
        Provide seasonality information
      </AnalysisSection.Header>
      <Grid container columnSpacing={2} sx={{ mb: 1, maxWidth: 400 }}>
        <Grid item md={6} sx={{ height: 66 }}>
          <InfoOverlay
            id="is-seasonal"
            label="Data is seasonal"
            variant="subtitle2"
            sx={{ fontSize: 12, display: 'block' }}
          >
            <InfoOverlay.Popover>aaa</InfoOverlay.Popover>
          </InfoOverlay>
          <Controller
            {...register(EAnalysisFormFields.isSeasonal)}
            control={control}
            render={({ field }) => (
              <Switch {...field} checked={!!field.value} />
            )}
          />
        </Grid>
        {isDataSeasonal && (
          <Grid item md={6} sx={{ height: 66 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 12 }}
              component="label"
              htmlFor="periods"
            >
              Periods
            </Typography>
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
      </Grid>
    </AnalysisSection>
  );
};

export default Seasonality;
