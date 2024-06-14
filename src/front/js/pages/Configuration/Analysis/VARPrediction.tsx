import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Card, CardContent, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { red } from '@mui/material/colors';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import {
  useConfigData,
  useFetchPrediction,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import { EAnalysisFormFields } from './types';
import AnalysisSection from './AnalysisSection';
import EvaluationIndicators from '../EvaluationIndicators';
import { getLinearValueScale } from '../../../utils';

type TProps = {
  readonly isVisible: boolean;
  readonly varResult;
  readonly isVARLoading: boolean;
  readonly index?: number;
};
const VARPrediction = ({
  isVisible,
  varResult,
  isVARLoading,
  index,
}: TProps) => {
  const handlePredict = useFetchPrediction();

  const formMethods = useFormContext();
  const {
    register,
    formState: { isSubmitting },
    getValues,
  } = formMethods;

  const handleClick = () => {
    const values = getValues();
    handlePredict({
      lagOrder: +values.lagOrder,
      horizon: +values.horizon,
    });
  };

  const predictionHistory = useGetPredictionHistory();
  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);
  const { timeProperty, data } = useConfigData();

  if (!isVisible) return null;
  return (
    <AnalysisSection>
      <AnalysisSection.Header>
        What is the prediction for the future? (VAR)
      </AnalysisSection.Header>
      <Grid item md={6}>
        <Grid container columnSpacing={2} sx={{ mb: 1, maxWidth: 400 }}>
          <Grid item md={6}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 12 }}
              component="label"
              htmlFor="name"
            >
              Max lag order
            </Typography>
            <TextField
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.lagOrder)}
              // required
            />
          </Grid>
          <Grid item md={6}>
            <Typography
              variant="subtitle2"
              sx={{ fontSize: 12 }}
              component="label"
              htmlFor="name"
            >
              Horizon
            </Typography>
            <TextField
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.horizon)}
              // required
            />
          </Grid>
        </Grid>
        <ButtonContainer>
          {isVARLoading ? (
            <Loader />
          ) : (
            <Button size="small" onClick={handleClick}>
              Run the prediction model
            </Button>
          )}
        </ButtonContainer>
      </Grid>
      <Grid item md={6}>
        {varResult ? (
          <Card variant="outlined">
            <CardContent>
              {/* <ARIMAPredictionParams arimaResult={arimaResult} /> */}
              <EvaluationIndicators
                historyEntry={varResult}
                errorColorScale={errorColorScale}
                timeProperty={timeProperty}
                timeseriesData={data}
              />
            </CardContent>
          </Card>
        ) : null}
      </Grid>
    </AnalysisSection>
  );
};

export default VARPrediction;
