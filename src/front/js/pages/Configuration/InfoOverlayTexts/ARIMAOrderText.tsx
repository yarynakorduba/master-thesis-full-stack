import React from 'react';

const ARIMAOrderText = () => {
  return (
    <>
      Order is the optimal ARIMA(p, d, q) parameters which the model selected
      considering the provided min / max form values. To identify the optimal
      parameters, the model uses Akaike Information Criterion (AIC).
    </>
  );
};

export default ARIMAOrderText;
