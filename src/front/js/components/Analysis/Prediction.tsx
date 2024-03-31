import React from 'react';
import Button from '@mui/material/Button';
import StepButton from '@mui/material/StepButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import StepContent from '@mui/material/StepContent';
import { ButtonContainer } from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';
import { useInputState } from '../../hooks';

type TProps = {
  readonly isVisible: boolean;
  readonly varResult;
  readonly isVARLoading: boolean;
  readonly handleFetchVAR;
  readonly index;
  readonly handleSelectStep;
};
const Prediction = ({
  isVisible,
  varResult,
  isVARLoading,
  handleFetchVAR,
  index,
  handleSelectStep
}: TProps) => {
  const [lagOrder, setLagOrder] = useInputState<number>(2);
  const [horizon, setHorizon] = useInputState<number>(2);

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        What is the prediction for the future? (VAR)
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
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Horizon"
              id="outlined-size-small"
              value={horizon}
              onChange={setHorizon}
              size="small"
              type="number"
            />
          </Grid>
        </Grid>

        <ButtonContainer>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button size="small" onClick={() => handleFetchVAR(lagOrder, horizon)}>
              Run the prediction model
            </Button>
          ) : null}
        </ButtonContainer>
      </StepContent>
    </>
  );
};

export default Prediction;
