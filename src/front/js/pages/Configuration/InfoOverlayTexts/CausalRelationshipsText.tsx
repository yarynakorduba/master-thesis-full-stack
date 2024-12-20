import React from 'react';
import { Divider, Typography } from '@mui/material';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import OpenAIDisclaimer from './OpenAIDisclaimer';
import Cite from './Cite';

const CausalRelationshipsText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          To find out how different data fields in your dataset influence each
          other, we use pairwise Granger causality tests.
        </Typography>
        <Typography>
          Time series Y is said to Granger cause time series X if knowing the
          past values of Y improves the prediction of X more than just knowing
          the past values of X alone.
        </Typography>
        <Typography>
          <em>Example:</em> Imagine predicting tomorrow&apos;s temperature (X).
          If knowing past humidity levels (Y) helps make a better prediction,
          then humidity (Y) Granger causes temperature (X).
        </Typography>
        <Typography>
          Using Granger causality tests, our app helps identify which variables
          in your data influence each other, so that you can make more accurate
          and insightful predictions.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }
  return (
    <>
      <Typography>
        To find the causal relationships between the data fields of the dataset,
        we perform pairwise Granger causality tests.
      </Typography>
      <Typography>
        Granger causality. Time series Y is said to Granger cause time series X
        if the prediction error variance of X at a present time can be reduced
        by additionally including the past values of Y, compared to only
        including the past values of X <Cite index={1} />.
        {/* http://www.econ.uiuc.edu/~econ536/Papers/granger69.pdf */}
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

export default CausalRelationshipsText;
