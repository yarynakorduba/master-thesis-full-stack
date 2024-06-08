import React from 'react';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Card, CardContent, Stack } from '@mui/material';
import { red } from '@mui/material/colors';

import Loader from '../../../sharedComponents/Loader';
import { useInputState } from '../../../hooks';
import { getLinearValueScale } from '../../../utils';
import {
  useFetchPrediction,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import ARIMAPredictionParams from './ARIMAPredictionParams';
import EvaluationIndicators from '../PredictionHistory/EvaluationIndicators';
import { EAnalysisFormFields } from './types';
import { useFormContext } from 'react-hook-form';
import AnalysisSection from './AnalysisSection';

type TProps = {
  readonly isVisible: boolean;
  readonly arimaResult;
  readonly isVARLoading: boolean;
  readonly index?: number;
};

const ARIMAPrediction = ({
  isVisible,
  arimaResult,
  isVARLoading,
  index,
}: TProps) => {
  const handlePredict = useFetchPrediction();

  const formMethods = useFormContext();
  const {
    register,
    formState: { isSubmitting },
    getValues,
  } = formMethods;

  const handleClick = () => {
    const values = getValues();
    console.log('VALUES ---- >>> ', values);
    handlePredict({
      horizon: +values.horizon,
      isSeasonal: values.isSeasonal,
      periodsInSeason: values.isSeasonal ? +values.periodsInSeason : undefined,
      minP: +values.minP,
      maxP: +values.maxP,
      minQ: +values.minQ,
      maxQ: +values.maxQ,
    });
  };

  const predictionHistory = useGetPredictionHistory();
  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);

  if (!isVisible) return null;
  return (
    <>
      <AnalysisSection md={6}>
        <AnalysisSection.Header>
          What is the prediction for the future? (ARIMA)
        </AnalysisSection.Header>
        <Grid container columnSpacing={2} sx={{ mb: 1, maxWidth: 400 }}>
          <Grid item md={6}>
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
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.horizon)}
              // required
            />
          </Grid>
          <Grid item md={6} />
          <Grid item md={6} sx={{ mt: 0 }}>
            <InfoOverlay
              id="min-lag-order"
              label="Min lag order (P)"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                Lag order (or P variable), helps you control how much the model
                relies on past values to predict the current one. It&apos;s like
                adjusting how far back you want to look to make a good guess
                about today&apos;s weather.
                <br />
                <br />
                Setting min lag order helps to avoid considering overly simple
                models that might not predict future values well.
              </InfoOverlay.Popover>
            </InfoOverlay>
            <TextField
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.minP)}
              // required
            />
          </Grid>
          <Grid item md={6} sx={{ mt: 0 }}>
            <InfoOverlay
              id="max-lag-order"
              label="Max lag order (P)"
              variant="subtitle2"
              sx={{ fontSize: 12 }}
            >
              <InfoOverlay.Popover>
                Lag order (or P variable), helps you control how much the model
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
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.maxP)}
              // required
            />
          </Grid>
          <Grid item md={6}>
            <InfoOverlay
              id="min-q"
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
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.minQ)}
              // required
            />
          </Grid>
          <Grid item md={6}>
            <InfoOverlay
              id="max-q"
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
              size="small"
              type="number"
              sx={{ width: '100%' }}
              {...register(EAnalysisFormFields.maxQ)}
              // required
            />
          </Grid>
        </Grid>
        <Box sx={{ marginTop: 1, marginBottom: 1 }}>
          {isVARLoading ? <Loader /> : null}
          {!isVARLoading ? (
            <Button size="small" onClick={handleClick}>
              Run the prediction model
            </Button>
          ) : null}
        </Box>
      </AnalysisSection>
      <AnalysisSection md={6}>
        {arimaResult ? (
          <Card variant="outlined">
            <CardContent>
              <ARIMAPredictionParams arimaResult={arimaResult} />
              {/* <EvaluationIndicators
                evaluation={arimaResult.evaluation}
                errorColorScale={errorColorScale}
              /> */}
            </CardContent>
          </Card>
        ) : null}
      </AnalysisSection>
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
