import React, { useState } from 'react';

import { Button } from '../../../pages/App/DatasetForm/styles';
import {
  Step,
  StepName,
  Question,
  Test,
  ButtonContainer,
  Input,
  InputLabel,
  Field
} from './styles';
import Loader from '../../Loader';

type TProps = {
  readonly isVisible: boolean;
  readonly varTestResult;
  readonly isVARTestLoading: boolean;
  readonly handleFetchVARTest;
};
const Prediction = ({ isVisible, varTestResult, isVARTestLoading, handleFetchVARTest }: TProps) => {
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
      <Question>What is the prediction for the future?</Question>
      <Test>
        <Field>
          <InputLabel>Lag Order</InputLabel>
          <Input value={lagOrder} onChange={handleLagOrderChange} />
        </Field>
        <Field>
          <InputLabel>Horizon</InputLabel>
          <Input value={horizon} onChange={handleHorizonChange} />
        </Field>
        <ButtonContainer>
          {isVARTestLoading ? <Loader /> : null}
          {!isVARTestLoading ? (
            <Button onClick={() => handleFetchVARTest(lagOrder, horizon)}>
              Run the prediction model
            </Button>
          ) : null}
        </ButtonContainer>
      </Test>
    </Step>
  );
};

export default Prediction;
