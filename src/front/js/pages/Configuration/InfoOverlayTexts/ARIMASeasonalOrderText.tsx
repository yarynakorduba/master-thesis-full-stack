import { Divider, Typography } from '@mui/material';
import React from 'react';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import OpenAIDisclaimer from './OpenAIDisclaimer';
import Cite from './Cite';

const ARIMASeasonalOrderText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          Seasonal order refers to the best ARIMA(P, D, Q)s settings for
          seasonal data that the model chooses based on the values you provide.
          P, D, and Q are numbers that represent the seasonal patterns, and s is
          the number of periods per season (like 12 for monthly data in a year).
          P looks at past seasonal data, D adjusts for seasonal changes, and Q
          considers past prediction errors. The seasonal components work like
          the regular ones but focus on patterns that repeat over each season.
          For example, if you want to predict holiday sales, the model looks at
          past holiday seasons to make accurate predictions.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }

  return (
    <>
      <Typography>
        Seasonal order is the optimal ARIMA(P, D, Q)s seasonal parameters which
        the model selected considering the provided min / max form values. Here,
        P, D, and Q are components which represent the seasonal autoregressive
        order, the seasonal degree of differencing and the seasonal moving
        average order, and s is the number of periods per season{' '}
        <Cite index={1} />.
        {/* http://repository.cinec.edu/bitstream/cinec20/1228/1/2008_Book_TimeSeriesAnalysis.pdf, p.234 */}
      </Typography>{' '}
      <Typography>
        {' '}
        The seasonal components of the model are similar to the non-seasonal
        components, but involve backshifts of the seasonal period s{' '}
        <Cite index={2} />.{/* https://otexts.com/fpp2/seasonal-arima.html */}
      </Typography>
      <Divider />
      <Cite.Source index={1}>
        Cryer, J. D., & Chan, K. S. (2008). Seasonal models. Time series
        analysis: with applications in R, 227-246.
      </Cite.Source>
      <Cite.Source index={2}>
        Hyndman, R. J., & Athanasopoulos, G. (2018). Forecasting: principles and
        practice (2nd ed). OTexts.
      </Cite.Source>
    </>
  );
};

export default ARIMASeasonalOrderText;
