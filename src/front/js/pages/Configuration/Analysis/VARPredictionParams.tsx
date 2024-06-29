import { Typography } from '@mui/material';
import React from 'react';
import { isEmpty, isEqual } from 'lodash';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import { THistoryEntry, TVARResult } from './types';

type TProps = {
  readonly varResult: TVARResult | THistoryEntry;
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
          <InfoOverlay id="Order" label="Lag order:">
            <InfoOverlay.Popover>
              Optimal lag order selected by the model based on the input data.
            </InfoOverlay.Popover>
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
          <InfoOverlay.Popover>
            {arePredictionParamsSimilar
              ? 'The optimal parameters selected by the model to predict the given data.'
              : 'The optimal parameters selected by  the model to predict the test data.'}
          </InfoOverlay.Popover>
        </InfoOverlay>
      </Typography>
      {renderOrders(testPredictionParams)}
      {!arePredictionParamsSimilar && !isEmpty(realPredictionParams) && (
        <>
          <Typography variant="subtitle1" color="text.secondary">
            <InfoOverlay
              id="prediction-params"
              label="Real data prediction params"
            >
              <InfoOverlay.Popover>
                The optimal parameters selected by the model to predict the
                data.
              </InfoOverlay.Popover>
            </InfoOverlay>
          </Typography>
          {renderOrders(realPredictionParams)}
        </>
      )}
    </>
  );
};

export default VARPredictionParams;
