import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

import {
  Step,
  StepName,
  Test,
  ButtonContainer
} from '../../shared/charts/SparkLineChartsBlock/styles';
import Loader from '../../shared/Loader';
import Input from '../../shared/formFields/Input';

type TProps = {
  readonly isVisible: boolean;
  readonly varResult;
  readonly isVARLoading: boolean;
  readonly handleFetchVAR;
};
const Prediction = ({ isVisible, varResult, isVARLoading, handleFetchVAR }: TProps) => {
  const [lagOrder, setLagOrder] = useState<number>(2);
  const [horizon, setHorizon] = useState<number>(2);

  const handleLagOrderChange = (ev) => {
    setLagOrder(+ev.target.value);
  };
  const handleHorizonChange = (ev) => {
    setHorizon(+ev.target.value);
  };

  if (!isVisible) return null;
  return (
    <Step>
      <StepName>4</StepName>
      <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
        What is the prediction for the future?
      </Typography>
      <Test>
        <Grid container spacing={2} sx={{ marginBottom: 1 }}>
          <Grid item>
            <TextField
              label="Max lag order"
              id="outlined-size-small"
              value={lagOrder}
              onChange={handleLagOrderChange}
              size="small"
            />
          </Grid>
          <Grid item>
            <TextField
              label="Horizon"
              id="outlined-size-small"
              value={horizon}
              onChange={handleHorizonChange}
              size="small"
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
      </Test>
    </Step>
  );
};

export default Prediction;
