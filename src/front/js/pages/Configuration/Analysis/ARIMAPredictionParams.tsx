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
            <InfoOverlay.Popover>
              Order is the optimal ARIMA(p, d, q) parameters which the model
              selected considering the provided min / max form values. To
              identify the optimal parameters, the model uses Akaike Information
              Criterion (AIC).
            </InfoOverlay.Popover>
          </InfoOverlay>{' '}
          {formatOrder(params?.order)},{' '}
          <InfoOverlay id="Seasonal Order" label="Seasonal order:">
            <InfoOverlay.Popover>
              Seasonal order is the optimal ARIMA(P, D, Q)s seasonal parameters
              which the model selected considering the provided min / max form
              values. Here, P, D, and Q are seasonal components and s is the
              number of periods per season.
              {/* http://repository.cinec.edu/bitstream/cinec20/1228/1/2008_Book_TimeSeriesAnalysis.pdf, p.234 */}
              The seasonal components of the model are similar to the
              non-seasonal components, but involve backshifts of the seasonal
              period s.
              {/* https://otexts.com/fpp2/seasonal-arima.html */}
            </InfoOverlay.Popover>
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
          <InfoOverlay.Popover>
            {areARIMAPredictionParamsSimilar
              ? 'Prediction parameters are the optimal parameters selected by the model to predict the given data.'
              : 'Test prediction parameters are the optimal parameters selected by  the model to predict the test data.'}
          </InfoOverlay.Popover>
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
              <InfoOverlay.Popover>
                Real data prediction params are the optimal parameters selected
                by the model to predict the data.
              </InfoOverlay.Popover>
            </InfoOverlay>
          </Typography>
          {!isEmpty(realPredictionParams)
            ? renderOrders(realPredictionParams)
            : null}
        </>
      )}
    </>
  );
};

export default ARIMAPredictionParams;
