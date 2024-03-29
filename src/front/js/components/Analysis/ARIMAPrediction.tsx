import React from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import { ButtonContainer } from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';
import { useInputState } from '../../hooks';

type TProps = {
  readonly isVisible: boolean;
  readonly varResult;
  readonly isVARLoading: boolean;
  readonly handleFetchVAR;
  readonly index: number;
  readonly handleSelectStep;
};
const Prediction = ({
  isVisible,
  varResult,
  isVARLoading,
  handleFetchVAR,
  handleSelectStep,
  index
}: TProps) => {
  const [lagOrder, setLagOrder] = useInputState<number>(2);
  const [horizon, setHorizon] = useInputState<number>(2);
  const [isSeasonal, setIsSeasonal] = useInputState<boolean>(false);

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        What is the prediction for the future? (ARIMA)
      </StepButton>
      <StepContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
          <Grid item md={6}>
            <TextField
              label="Max lag order"
              id="outlined-size-small"
              value={lagOrder}
              onChange={setLagOrder}
              size="small"
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Horizon"
              id="outlined-size-small"
              value={horizon}
              onChange={setHorizon}
              size="small"
            />
          </Grid>
        </Grid>
        <FormControlLabel
          control={<Switch checked={isSeasonal} onChange={setIsSeasonal} />}
          label="Seasonal"
        />
        <ButtonContainer>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button size="small" onClick={() => handleFetchVAR({ lagOrder, horizon, isSeasonal })}>
              Run the prediction model
            </Button>
          ) : null}
        </ButtonContainer>
      </StepContent>
    </>
  );
};

export default Prediction;
