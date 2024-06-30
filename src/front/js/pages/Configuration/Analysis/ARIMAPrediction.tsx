import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Card, CardContent } from '@mui/material';
import { red } from '@mui/material/colors';
import { useFormContext } from 'react-hook-form';
import { isEmpty } from 'lodash';

import Loader from '../../../sharedComponents/Loader';
import {
  useConfigData,
  useFetchARIMAPrediction,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import ARIMAPredictionParams from './ARIMAPredictionParams';
import { EAnalysisFormFields, TARIMAResult } from './types';
import AnalysisSection from './AnalysisSection';
import EvaluationIndicators from '../EvaluationIndicators';
import { FIELD_LABEL_PROPS } from '../../../consts';
import { ANALYSIS_FORM_NUMERIC_FIELDS } from './consts';
import { formatFormFields } from '../../../utils/formatters';
import { getLinearValueScale } from '../../../utils/lineChart';
import ARIMAModelText from '../InfoOverlayTexts/ArimaModelText';
import HorizonText from '../InfoOverlayTexts/HorizonText';
import MaxLagOrderPText from '../InfoOverlayTexts/MaxLagOrderPText';
import MinLagOrderPText from '../InfoOverlayTexts/MinLagOrderPText';
import MaxMovingAverageQText from '../InfoOverlayTexts/MaxMovingAverageQText';
import MinMovingAverageQText from '../InfoOverlayTexts/MinMovingAverageQText';

type TProps = {
  readonly isVisible: boolean;
  readonly arimaResult: TARIMAResult;
  readonly isLoading: boolean;
  readonly index?: number;
};

const ARIMAPrediction = ({ isVisible, arimaResult, isLoading }: TProps) => {
  const handlePredict = useFetchARIMAPrediction();

  const formMethods = useFormContext();
  const {
    register,
    formState: { isSubmitting },
    getValues,
  } = formMethods;

  const handleClick = () => {
    const values = getValues();
    handlePredict({
      ...(formatFormFields(values, ANALYSIS_FORM_NUMERIC_FIELDS) as any),
      periodsInSeason: values.isSeasonal ? +values.periodsInSeason : undefined,
    });
  };

  const predictionHistory = useGetPredictionHistory();
  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);

  const { timeProperty, data } = useConfigData();

  if (!isVisible) return null;
  return (
    <AnalysisSection>
      <AnalysisSection.Header>
        <InfoOverlay id="arima-prediction-model" label="ARIMA prediction">
          <InfoOverlay.Popover>{<ARIMAModelText />}</InfoOverlay.Popover>
        </InfoOverlay>
      </AnalysisSection.Header>
      <Grid item md={6}>
        <Grid
          container
          columnSpacing={2}
          rowGap={1}
          sx={{ mb: 1, maxWidth: 400 }}
        >
          <Grid item md={6}>
            <InfoOverlay id="horizon" label="Horizon" {...FIELD_LABEL_PROPS}>
              <InfoOverlay.Popover>{<HorizonText />}</InfoOverlay.Popover>
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
          <Grid item md={6}>
            <InfoOverlay
              id="min-lag-order"
              label="Min lag order (min p)"
              {...FIELD_LABEL_PROPS}
            >
              <InfoOverlay.Popover>{<MinLagOrderPText />}</InfoOverlay.Popover>
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
              label={'Max lag order (max p)'}
              {...FIELD_LABEL_PROPS}
            >
              <InfoOverlay.Popover>{<MaxLagOrderPText />}</InfoOverlay.Popover>
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
              label="Min moving avg. order (min q)"
              {...FIELD_LABEL_PROPS}
            >
              <InfoOverlay.Popover>
                <MinMovingAverageQText />
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
              label="Max moving avg. order (max q)"
              {...FIELD_LABEL_PROPS}
            >
              <InfoOverlay.Popover>
                <MaxMovingAverageQText />
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
          <Grid item sx={{ marginTop: 1, marginBottom: 1 }}>
            {isLoading ? (
              <Loader />
            ) : (
              <Button size="small" onClick={handleClick}>
                Run the prediction model
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item md={6}>
        {!isEmpty(arimaResult?.testPredictionParameters) ? (
          <Card variant="outlined">
            <CardContent>
              <ARIMAPredictionParams arimaResult={arimaResult} />
              <EvaluationIndicators
                historyEntry={arimaResult}
                errorColorScale={errorColorScale}
                timeProperty={timeProperty}
                timeseriesData={data}
              />
            </CardContent>
          </Card>
        ) : null}
      </Grid>
    </AnalysisSection>
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
