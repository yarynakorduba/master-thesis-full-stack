import React from 'react';
import { Divider, Typography } from '@mui/material';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import Cite from './Cite';
import OpenAIDisclaimer from './OpenAIDisclaimer';

const CausalityMaxLagOrderText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          The causality lag order m is the smallest number of past values from
          time series Y that help predict time series X. For example, if m is 3,
          it means looking back at the last 3 values of Y gives useful
          information to predict X. Before this point, using past values of Y
          doesn&apos;t improve the prediction of X.
        </Typography>
        <Typography>
          In the &quot;Max lag order&quot; field, enter the highest number of
          past values (lags) you want to test to find the best causality lag.
          This number should be a positive whole number.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }

  return (
    <>
      <Typography>
        The causality lag order m is defined as the smallest integer k at which
        past k values of time series Y start to provide significant information
        in predicting time series X. Before this lag, the inclusion of past
        values of Y does not contribute to improving the prediction of X{' '}
        <Cite index={1} />.
        {/* http://www.econ.uiuc.edu/~econ536/Papers/granger69.pdf */}
      </Typography>
      <Typography>
        In Max lag order field, please provide the maximum number of lags which
        should be tested to find the optimal causality lag. The number should be
        a positive integer.
      </Typography>
      <Divider />
      <Cite.Source index={1}>
        Granger, C. W. (1969). Investigating causal relations by econometric
        models and cross-spectral methods. Econometrica: journal of the
        Econometric Society, 424-438.
      </Cite.Source>
    </>
  );
};

export default CausalityMaxLagOrderText;
