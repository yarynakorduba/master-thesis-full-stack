import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import {
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  Skeleton,
  Typography,
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { red } from '@mui/material/colors';
import { map } from 'lodash';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import {
  useConfigData,
  useFetchVARPrediction,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import {
  EAnalysisFormFields,
  type THistoryEntry,
  type TVARResult,
} from './types';
import AnalysisSection from './AnalysisSection';
import EvaluationIndicators from '../EvaluationIndicators';
import VARPredictionParams from './VARPredictionParams';
import { CheckboxLabel } from './styles';
import { ANALYSIS_FORM_NUMERIC_FIELDS } from './consts';
import { formatFormFields } from '../../../utils/formatters';
import { getLinearValueScale } from '../../../utils/lineChart';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import { FIELD_LABEL_PROPS } from '../../../consts';
import VARModelText from '../InfoOverlayTexts/VARModelText';
import HorizonText from '../InfoOverlayTexts/HorizonText';

type TProps = {
  readonly isVisible: boolean;
  readonly varResult: TVARResult | THistoryEntry;
  readonly isLoading: boolean;
  readonly index?: number;
};
const VARPrediction = ({ isVisible, varResult, isLoading }: TProps) => {
  const handlePredict = useFetchVARPrediction();

  const formMethods = useFormContext();
  const { register, getValues } = formMethods;

  const handleClick = () => {
    const values = getValues();
    handlePredict(
      {
        ...(formatFormFields(values, ANALYSIS_FORM_NUMERIC_FIELDS) as any),
        periodsInSeason: values.isSeasonal
          ? +values.periodsInSeason
          : undefined,
      },
      values.varSelectedFields,
    );
  };

  const predictionHistory = useGetPredictionHistory();
  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);
  const { timeProperty, valueProperties, data } = useConfigData();

  if (!isVisible) return null;
  return (
    <AnalysisSection>
      <AnalysisSection.Header>
        <InfoOverlay id="var-prediction-model" label="VAR prediction">
          <InfoOverlay.Popover>{<VARModelText />}</InfoOverlay.Popover>
        </InfoOverlay>
      </AnalysisSection.Header>
      <Grid item md={6}>
        <Grid container columnSpacing={2} sx={{ mb: 1, maxWidth: 400 }}>
          <Grid item md={12}>
            <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
              Variables to predict (select at least two)
            </Typography>
            <FormGroup sx={{ marginBottom: 1, padding: 0 }}>
              {map(valueProperties, (prop) => (
                <CheckboxLabel
                  control={<Checkbox defaultChecked />}
                  label={prop.label}
                  value={prop.value}
                  sx={{ margin: 0 }}
                  {...register(`${EAnalysisFormFields.varSelectedFields}`)}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid item md={6}>
            <Typography {...FIELD_LABEL_PROPS}>Max lag order</Typography>
            <TextField
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.lagOrder)}
              // required
            />
          </Grid>
          <Grid item md={6}>
            <InfoOverlay id="horizon" label="Horizon" {...FIELD_LABEL_PROPS}>
              <InfoOverlay.Popover>{<HorizonText />}</InfoOverlay.Popover>
            </InfoOverlay>
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
          {isLoading ? (
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
              {isLoading ? (
                <>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    color="text.secondary"
                  >
                    Prediction
                  </Typography>
                  <Skeleton height={valueProperties.length * 107 + 28} />
                </>
              ) : (
                <>
                  <VARPredictionParams varResult={varResult} />
                  <EvaluationIndicators
                    historyEntry={varResult}
                    errorColorScale={errorColorScale}
                    timeProperty={timeProperty}
                    timeseriesData={data}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ) : null}
      </Grid>
    </AnalysisSection>
  );
};

export default VARPrediction;
