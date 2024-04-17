import React from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Loader from '../../../shared/Loader';
import { useInputState } from '../../../hooks';

type TProps = {
  readonly isVisible: boolean;
  readonly arimaResult;
  readonly isVARLoading: boolean;
  readonly handlePredict;
  readonly index: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
};

const ARIMAPrediction = ({
  isVisible,
  arimaResult,
  isVARLoading,
  handlePredict,
  handleSelectStep,
  index
}: TProps) => {
  const [horizon, setHorizon] = useInputState<number>(20, { min: 0 });
  const [isSeasonal, setIsSeasonal] = useInputState<boolean>(false);

  const [minP, setMinP] = useInputState<number>(0, { min: 0 });
  const [maxP, setMaxP] = useInputState<number>(1, { min: 0 });

  const [minQ, setMinQ] = useInputState<number>(0, { min: 0 });
  const [maxQ, setMaxQ] = useInputState<number>(1, { min: 0 });

  const [periodsInSeason, setPeriodsInSeason] = useInputState<number>(1, { min: 0 });

  const handleClick = () => {
    handlePredict({ horizon, isSeasonal, minP, maxP, minQ, maxQ, periodsInSeason });
  };

  const renderParameters = (parameters, title = 'Test data prediction parameters') => (
    <Box>
      <Typography variant="h6">{title}</Typography>
      <Typography>Selected order: {JSON.stringify(parameters?.order)}</Typography>
      <Typography>Selected seasonal order: {JSON.stringify(parameters?.seasonal_order)}</Typography>
    </Box>
  );

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}> What is the prediction for the future? (ARIMA)</Box>
      </StepButton>
      <StepContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 1, maxWidth: 400 }}>
          <Grid item md={6} sx={{ marginBottom: 1 }}>
            <TextField
              label="Horizon"
              value={horizon}
              onChange={setHorizon}
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item md={6} />
          <Grid item md={6}>
            <TextField label="Min P" value={minP} onChange={setMinP} size="small" type="number" />
          </Grid>
          <Grid item md={6}>
            <TextField label="Max P" value={maxP} onChange={setMaxP} size="small" type="number" />
          </Grid>
          <Grid item md={6}>
            <TextField label="Min Q" value={minQ} onChange={setMinQ} size="small" type="number" />
          </Grid>
          <Grid item md={6}>
            <TextField label="Max Q" value={maxQ} onChange={setMaxQ} size="small" type="number" />
          </Grid>
        </Grid>
        <FormControlLabel
          control={<Switch checked={isSeasonal} onChange={setIsSeasonal} />}
          label="Seasonal"
        />
        {isSeasonal ? (
          <Grid sx={{ paddingTop: 1 }}>
            <TextField
              label="Periods in season"
              value={periodsInSeason}
              onChange={setPeriodsInSeason}
              size="small"
              type="number"
            />
          </Grid>
        ) : null}
        <Box sx={{ marginTop: 1, marginBottom: 1 }}>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button size="small" onClick={handleClick}>
              Run the prediction model
            </Button>
          ) : null}
        </Box>
        {arimaResult ? (
          <>
            {renderParameters(arimaResult?.testPredictionParameters)}
            {renderParameters(
              arimaResult?.realPredictionParameters,
              'Future data prediction parameters'
            )}
            {JSON.stringify(arimaResult?.evaluation)}
          </>
        ) : null}
      </StepContent>
    </>
  );
};

export default ARIMAPrediction;
