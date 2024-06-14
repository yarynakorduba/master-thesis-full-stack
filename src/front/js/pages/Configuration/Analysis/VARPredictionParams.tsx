import { Typography } from '@mui/material';
import React from 'react';
import { isEmpty, isEqual } from 'lodash';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';

type TProps = {
  readonly varResult: any;
};
const VARPredictionParams = ({ varResult }: TProps) => {
  const testPredictionParams = varResult?.testPredictionParameters;
  const realPredictionParams = varResult?.realPredictionParameters;
  const arePredictionParamsSimilar = isEqual(
    testPredictionParams?.order,
    realPredictionParams?.order,
  );
  const renderOrders = (params) => {
    if (isEmpty(params)) return null;
    return (
      <>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          <InfoOverlay id="Order" label="Order:">
            <InfoOverlay.Popover>A</InfoOverlay.Popover>
          </InfoOverlay>{' '}
          {params.order}
        </Typography>
      </>
    );
  };

  if (isEmpty(testPredictionParams)) return null;

  return (
    <>
      <Typography variant="subtitle1" color="text.secondary">
        <InfoOverlay
          id="prediction-params"
          label={
            arePredictionParamsSimilar
              ? 'Prediction params'
              : 'Test data prediction params'
          }
        >
          <InfoOverlay.Popover>A</InfoOverlay.Popover>
        </InfoOverlay>
      </Typography>
      {renderOrders(testPredictionParams)}
      {!arePredictionParamsSimilar && (
        <>
          <Typography variant="subtitle2" color="text.secondary">
            <InfoOverlay
              id="prediction-params"
              label="Real data prediction params"
            >
              <InfoOverlay.Popover>A</InfoOverlay.Popover>
            </InfoOverlay>
          </Typography>
          {renderOrders(realPredictionParams)}
        </>
      )}
    </>
  );
};

export default VARPredictionParams;
