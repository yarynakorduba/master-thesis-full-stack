import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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

  const handleLagOrderChange = (value) => {
    setLagOrder(+value);
  };
  const handleHorizonChange = (value) => {
    setHorizon(+value);
  };

  if (!isVisible) return null;
  return (
    <Step>
      <StepName>4</StepName>
      <Typography variant="subtitle1">What is the prediction for the future?</Typography>
      <Test>
        <Input label="Max lag order" value={lagOrder} onChange={handleLagOrderChange} />
        <Input label="Horizon" value={horizon} onChange={handleHorizonChange} />

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
