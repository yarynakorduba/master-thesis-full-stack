import { Grid, Switch, TextField } from '@mui/material';
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
                <InfoOverlay.Popover>aaa</InfoOverlay.Popover>
              </InfoOverlay>
              <Switch {...field} checked={!!field.value} />
            </>
          )}
        />
      </Grid>
      {isDataSeasonal && (
        <Grid item md={3}>
          <InfoOverlay
            id="seasonality-periods"
            label="Periods"
            {...FIELD_LABEL_PROPS}
          >
            <InfoOverlay.Popover>AA</InfoOverlay.Popover>
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
