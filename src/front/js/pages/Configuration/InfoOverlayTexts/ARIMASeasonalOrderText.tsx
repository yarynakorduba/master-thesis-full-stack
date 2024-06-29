import React from 'react';

const ARIMASeasonalOrderText = () => {
  return (
    <>
      Seasonal order is the optimal ARIMA(P, D, Q)s seasonal parameters which
      the model selected considering the provided min / max form values. Here,
      P, D, and Q are seasonal components and s is the number of periods per
      season.
      {/* http://repository.cinec.edu/bitstream/cinec20/1228/1/2008_Book_TimeSeriesAnalysis.pdf, p.234 */}
      The seasonal components of the model are similar to the non-seasonal
      components, but involve backshifts of the seasonal period s.
      {/* https://otexts.com/fpp2/seasonal-arima.html */}
    </>
  );
};

export default ARIMASeasonalOrderText;
