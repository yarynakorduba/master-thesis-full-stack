import { Typography } from '@mui/material';
import React from 'react';
import { isEmpty, isEqual } from 'lodash';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import { formatOrder } from '../../../utils/formatters';
import { TARIMAResult } from './types';

type TProps = {
  readonly arimaResult: TARIMAResult;
};
const ARIMAPredictionParams = ({ arimaResult }: TProps) => {
  const testPredictionParams = arimaResult?.testPredictionParameters;
  const realPredictionParams = arimaResult?.realPredictionParameters;
  const areARIMAPredictionParamsSimilar =
    isEqual(testPredictionParams?.order, realPredictionParams?.order) &&
    isEqual(
      testPredictionParams?.seasonal_order,
      realPredictionParams?.seasonal_order,
    );
  const renderOrders = (params) => {
    if (isEmpty(params)) return null;
    return (
      <>
        <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
          <InfoOverlay id="Order" label="Order:">
            <InfoOverlay.Popover>A</InfoOverlay.Popover>
          </InfoOverlay>{' '}
          {formatOrder(params?.order)},{' '}
          <InfoOverlay id="Seasonal Order" label="Seasonal order:">
            <InfoOverlay.Popover>A</InfoOverlay.Popover>
          </InfoOverlay>{' '}
          {formatOrder(params?.seasonal_order)}
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
            areARIMAPredictionParamsSimilar
              ? 'Prediction params'
              : 'Test data prediction params'
          }
        >
          <InfoOverlay.Popover>A</InfoOverlay.Popover>
        </InfoOverlay>
      </Typography>
      {renderOrders(testPredictionParams)}
      {!areARIMAPredictionParamsSimilar && (
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

export default ARIMAPredictionParams;
