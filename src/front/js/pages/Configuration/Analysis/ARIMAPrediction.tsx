import React from 'react';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { round } from 'lodash';
import { Card, CardContent, Chip, Stack } from '@mui/material';

import Loader from '../../../shared/Loader';
import { useInputState } from '../../../hooks';
import { PRECISION } from '../../../consts';
import { formatOrder } from '../../../utils/formatters';
import { red } from '@mui/material/colors';
import { scaleLinear } from '@visx/scale';
import { getExtent } from '../../../utils';
import { useGetPredictionHistory } from '../../../store/currentConfiguration/selectors';
import InfoOverlay from '../../../shared/InfoOverlay';

type TProps = {
  readonly isVisible: boolean;
  readonly arimaResult;
  readonly isVARLoading: boolean;
  readonly handlePredict;
  readonly index: number;
  readonly handleSelectStep: (stepIndex: number) => () => void;
};

const ARIMAPrediction = ({
  isVisible,
  arimaResult,
  isVARLoading,
  handlePredict,
  handleSelectStep,
  index,
}: TProps) => {
  const [horizon, setHorizon] = useInputState<number>(20, { min: 1 });
  const [isSeasonal, setIsSeasonal] = useInputState<boolean>(false);

  const [minP, setMinP] = useInputState<number>(0, { min: 0 });
  const [maxP, setMaxP] = useInputState<number>(1, { min: 0 });

  const [minQ, setMinQ] = useInputState<number>(0, { min: 0 });
  const [maxQ, setMaxQ] = useInputState<number>(1, { min: 0 });

  const [periodsInSeason, setPeriodsInSeason] = useInputState<number>(1, {
    min: 0,
  });

  const handleClick = () => {
    handlePredict({
      horizon,
      isSeasonal,
      minP,
      maxP,
      minQ,
      maxQ,
      periodsInSeason,
    });
  };

  const predictionHistory = useGetPredictionHistory();
  const mapeExtent = getExtent(predictionHistory, 'evaluation.mape');
  const mapeLinearScale = scaleLinear({
    domain: mapeExtent,
    range: [red[50], red[200]],
  });

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>
          {' '}
          What is the prediction for the future? (ARIMA)
        </Box>
      </StepButton>
      <StepContent>
        <Grid container columnSpacing={2} sx={{ mt: 1, mb: 1, maxWidth: 400 }}>
          <Grid item md={6} sx={{ marginBottom: 1 }}>
            <InfoOverlay
              id="periods-in-season"
              label="Horizon"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                Horizon indicates the number of points you would like to predict
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={horizon}
              onChange={setHorizon}
              size="small"
              type="number"
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Grid>
          <Grid item md={6} />
          <Grid item md={6} sx={{ mt: 0 }}>
            <InfoOverlay
              id="periods-in-season"
              label="Min P"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                P variable, or lag order, helps you control how much the model
                relies on past values to predict the current one. It&apos;s like
                adjusting how far back you want to look to make a good guess
                about today&apos;s weather.
                <br />
                <br />
                Setting min P helps to avoid considering overly simple models
                that might not predict future values well.
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={minP}
              onChange={setMinP}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6} sx={{ mt: 0 }}>
            <InfoOverlay
              id="periods-in-season"
              label="Max P"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                P variable, or lag order, helps you control how much the model
                relies on past values to predict the current one. It&apos;s like
                adjusting how far back you want to look to make a good guess
                about today&apos;s weather.
                <br />
                <br />
                Setting max P helps to prevent the algorithm from considering
                excessively complex models
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={maxP}
              onChange={setMaxP}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <InfoOverlay
              id="periods-in-season"
              label="Min Q"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                Q variable indicates how much the current observation is
                influenced by prediction errors made by the model for previous
                values.
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={minQ}
              onChange={setMinQ}
              size="small"
              type="number"
            />
          </Grid>
          <Grid item md={6}>
            <InfoOverlay
              id="periods-in-season"
              label="Max Q"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                Q variable indicates how much the current observation is
                influenced by prediction errors made by the model for previous
                values.
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={maxQ}
              onChange={setMaxQ}
              size="small"
              type="number"
            />
          </Grid>
        </Grid>
        <Stack direction="row" alignItems="center" justifyContent="flex-start">
          <Switch checked={isSeasonal} onChange={setIsSeasonal} />
          <InfoOverlay
            id="periods-in-season"
            label="Data is seasonal"
            variant="subtitle2"
            sx={{ fontSize: 12, display: 'block' }}
          >
            <InfoOverlay.Popover>aaa</InfoOverlay.Popover>
          </InfoOverlay>
        </Stack>
        {isSeasonal ? (
          <Grid item md={6} sx={{ paddingTop: 1 }}>
            <InfoOverlay
              id="periods-in-season"
              label="Periods in season"
              variant="subtitle2"
              sx={{ fontSize: 12, display: 'block' }}
            >
              <InfoOverlay.Popover>
                This number indicates how many data points one seasonal pattern
                contains. <br />
                <br />
                Example: you have a dataset of daily temperatures for a city
                over several years. You notice that the temperature tends to be
                higher in the summer months and lower in the winter months,
                creating a seasonal pattern. For daily data, the seasonal period
                could be 365 (one year).
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              value={periodsInSeason}
              onChange={setPeriodsInSeason}
              size="small"
              type="number"
            />
          </Grid>
        ) : null}
        <Box sx={{ marginTop: 1, marginBottom: 1 }}>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button size="small" onClick={handleClick}>
              Run the prediction model
            </Button>
          ) : null}
        </Box>
        {arimaResult ? (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Test data prediction params
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.primary"
                gutterBottom
              >
                Order: {formatOrder(arimaResult.testPredictionParameters.order)}
                , Seasonal order:{' '}
                {formatOrder(
                  arimaResult.testPredictionParameters.seasonal_order,
                )}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Real data prediction params
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.primary"
                gutterBottom
              >
                Order: {formatOrder(arimaResult.realPredictionParameters.order)}
                , Seasonal order:{' '}
                {formatOrder(
                  arimaResult.realPredictionParameters.seasonal_order,
                )}
              </Typography>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ marginBottom: 0.75 }}
              >
                Evaluation
              </Typography>
              <Typography sx={{ lineBreak: 'auto', fontSize: 14 }}>
                <Chip
                  size="small"
                  label={
                    <> MAE: {round(arimaResult.evaluation.mae, PRECISION)}</>
                  }
                  sx={{ mr: 1 }}
                />
                <Chip
                  size="small"
                  sx={{
                    background: mapeLinearScale(arimaResult.evaluation.mape),
                  }}
                  label={
                    <> MAPE: {round(arimaResult.evaluation.mape, PRECISION)}</>
                  }
                />
              </Typography>
            </CardContent>
          </Card>
        ) : null}
      </StepContent>
    </>
  );
};

export default ARIMAPrediction;

// Yes, it's possible that if an ARIMA model predicts poorly, the issue could be related to the size of the dataset. A small dataset might not capture the underlying patterns or trends in the data effectively, leading to poor predictive performance.

// Chat GPT
// While Auto ARIMA is a powerful tool for automatically selecting the optimal ARIMA model for many time series datasets, there are certain types of time series data for which Auto ARIMA may not perform well or may not be suitable for prediction. Here are some scenarios where Auto ARIMA might face challenges or may not be appropriate:

// Non-Stationary Data without Clear Trends or Seasonality: Auto ARIMA is designed for stationary or weakly stationary time series data with clear trends and/or seasonality. If the data is highly non-stationary or lacks clear patterns, Auto ARIMA may struggle to identify an appropriate model.
// Complex Seasonal Patterns: While Auto ARIMA can handle seasonal data, it may not perform well with complex seasonal patterns or multiple seasonalities. In such cases, specialized models or preprocessing techniques may be required.
// Highly Irregular or Noisy Data: Auto ARIMA assumes that the time series data contains meaningful patterns that can be captured by an ARIMA model. If the data is highly irregular, noisy, or contains outliers, Auto ARIMA may produce unreliable results.
// Large or High-Frequency Data: Auto ARIMA may not scale well to very large datasets or high-frequency data due to computational constraints. In such cases, alternative modeling approaches or data reduction techniques may be necessary.
// Structural Breaks: If the time series data exhibits structural breaks or sudden changes in behavior over time, Auto ARIMA may struggle to capture these changes effectively. Detecting and modeling structural breaks typically requires additional analysis and specialized techniques.
// Exogenous Variables: Auto ARIMA focuses solely on the time series data itself and does not incorporate external variables or predictors (exogenous variables). If the time series is influenced by external factors that are not included in the model, the predictive performance of Auto ARIMA may be limited.
// Long-Term Forecasting: Auto ARIMA may not be well-suited for long-term forecasting, especially for time series data with complex dynamics or uncertain future trends. In such cases, alternative forecasting methods, such as machine learning models or hybrid approaches, may be more appropriate.
