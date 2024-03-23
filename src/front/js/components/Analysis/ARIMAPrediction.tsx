import React, { useState } from 'react';

import { Button } from '../../pages/App/DatasetForm/styles';
import {
  Step,
  StepName,
  Question,
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
      <Question>What is the prediction for the future?</Question>
      <Test>
        <Input label="Max lag Order" value={lagOrder} onChange={handleLagOrderChange} />
        <Input label="Horizon" value={horizon} onChange={handleHorizonChange} />

        <ButtonContainer>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button onClick={() => handleFetchVAR(lagOrder, horizon)}>
              Run the prediction model
            </Button>
          ) : null}
        </ButtonContainer>
      </Test>
    </Step>
  );
};

export default Prediction;
