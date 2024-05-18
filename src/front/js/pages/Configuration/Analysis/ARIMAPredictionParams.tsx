import { Typography } from '@mui/material';
import { formatOrder } from '../../../utils/formatters';
import React from 'react';
import { isEqual } from 'lodash';

type TProps = {
  readonly arimaResult: any;
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
  const renderOrders = (params) => (
    <>
      <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
        Order: {formatOrder(params.order)}, Seasonal order:{' '}
        {formatOrder(params.seasonal_order)}
      </Typography>
    </>
  );
  return (
    <>
      <Typography variant="subtitle2" color="text.secondary">
        {areARIMAPredictionParamsSimilar
          ? 'Data prediction params'
          : 'Test data prediction params'}
      </Typography>
      {renderOrders(testPredictionParams)}
      {!areARIMAPredictionParamsSimilar && (
        <>
          <Typography variant="subtitle2" color="text.secondary">
            Real data prediction params
          </Typography>
          {renderOrders(realPredictionParams)}
        </>
      )}
    </>
  );
};

export default ARIMAPredictionParams;
