import React from 'react';
import Button from '@mui/material/Button';
import StepButton from '@mui/material/StepButton';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

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
const VARPrediction = ({
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
        <Box sx={{ fontSize: 16 }}>What is the prediction for the future? (VAR)</Box>
      </StepButton>
      <StepContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 1, maxWidth: 400 }}>
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

export default VARPrediction;
