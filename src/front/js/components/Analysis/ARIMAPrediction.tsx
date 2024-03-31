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
  readonly handlePredict;
  readonly index: number;
  readonly handleSelectStep;
};
const ARIMAPrediction = ({
  isVisible,
  varResult,
  isVARLoading,
  handlePredict,
  handleSelectStep,
  index
}: TProps) => {
  const [lagOrder, setLagOrder] = useInputState<number>(2);
  const [horizon, setHorizon] = useInputState<number>(2);
  const [isSeasonal, setIsSeasonal] = useInputState<boolean>(false);

  const [minP, setMinP] = useInputState<number>(0);
  const [maxP, setMaxP] = useInputState<number>(1);

  const [minQ, setMinQ] = useInputState<number>(0);
  const [maxQ, setMaxQ] = useInputState<number>(1);

  const handleClick = () => {
    handlePredict({ lagOrder, horizon, isSeasonal, minP, maxP, minQ, maxQ });
  };

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        What is the prediction for the future? (ARIMA)
      </StepButton>
      <StepContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 1 }}>
          <Grid item md={6} sx={{ marginBottom: 1 }}>
            <TextField
              label="Max lag order"
              id="outlined-size-small"
              value={lagOrder}
              onChange={setLagOrder}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6} sx={{ marginBottom: 1 }}>
            <TextField
              label="Horizon"
              id="outlined-size-small"
              value={horizon}
              onChange={setHorizon}
              size="small"
              type="number"
            />
          </Grid>

          <Grid item md={6}>
            <TextField
              label="Min P"
              id="outlined-size-small"
              value={minP}
              onChange={setMinP}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Max P"
              id="outlined-size-small"
              value={maxP}
              onChange={setMaxP}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Min Q"
              id="outlined-size-small"
              value={minQ}
              onChange={setMinQ}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label="Max Q"
              id="outlined-size-small"
              value={maxQ}
              onChange={setMaxQ}
              size="small"
              type="number"
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
            <Button size="small" onClick={handleClick}>
              Run the prediction model
            </Button>
          ) : null}
        </ButtonContainer>
      </StepContent>
    </>
  );
};

export default ARIMAPrediction;
