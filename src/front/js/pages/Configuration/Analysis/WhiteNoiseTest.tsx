import React from 'react';
import { identity, map } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Box, TextField, alpha } from '@mui/material';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import whiteNoiseData from '../../../../../api/data/gaussianDataset.json';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import { EAnalysisFormFields } from './types';
import { useFormContext } from 'react-hook-form';
import AnalysisSection from './AnalysisSection';

type TProps = {
  readonly index: number;
  readonly isVisible: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
};

const WhiteNoiseTest = ({
  index,
  isVisible,
  whiteNoiseResult,
  isWhiteNoiseLoading,
  handleFetchIsWhiteNoise,
}: TProps) => {
  const { palette } = useTheme();

  const formMethods = useFormContext();
  const {
    control,
    register,
    formState: { isSubmitting },
    handleSubmit,
    getValues,
    watch,
  } = formMethods;

  const whiteNoiseDemoDatapoints = {
    id: 'white-noise',
    color: palette.charts.chartRealData,
    label: '',
    datapoints: whiteNoiseData.map((valueY, valueX) => ({ valueX, valueY })),
  };

  if (!isVisible) return null;
  return (
    <AnalysisSection md={6}>
      <AnalysisSection.Header index={index}>
        Is data{' '}
        <InfoOverlay id="whiteNoise" label="white noise">
          <InfoOverlay.Popover>
            <Typography>
              A time series is white noise if the variables are independent and
              identically distributed with a mean of zero. This means that all
              variables have the same variance and each value has a zero
              correlation with all other values in the series.
            </Typography>
            <br />
            <Typography>
              If a time series is white noise, it is a sequence of random
              numbers and cannot be predicted.
            </Typography>
            <br />
            <SparkLineChart
              heading={'Example white noise time series'}
              data={[whiteNoiseDemoDatapoints]}
              formatXScale={identity}
              height={200}
              padding={{ top: 8, bottom: 24, left: 20, right: 10 }}
            />
            <Typography>
              To test whether the data is white noise, we run Ljung-Box test of
              autocorrelation in residuals.
            </Typography>
          </InfoOverlay.Popover>
        </InfoOverlay>
        ?
      </AnalysisSection.Header>
      <Box>
        <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
          <label htmlFor="name">Max lag order</label>
        </Typography>
        <TextField
          size="small"
          type="number"
          sx={{ width: '100%' }}
          {...register(EAnalysisFormFields.periodsInSeason)}
          // required
        />
      </Box>
      <ButtonContainer>
        {isWhiteNoiseLoading && <Loader />}
        <Button size="small" onClick={handleFetchIsWhiteNoise}>
          Run white-noise test
        </Button>
      </ButtonContainer>
      <Typography variant="body1">
        {map(whiteNoiseResult, (val, propName) => {
          return (
            <Box>
              {propName}:{' '}
              <Typography
                component="span"
                sx={{
                  background: !val?.isWhiteNoise
                    ? alpha(palette.success.light, 0.2)
                    : alpha(palette.warning.light, 0.2),
                }}
              >
                {val?.isWhiteNoise ? '' : 'not '}white noise
              </Typography>
            </Box>
          );
        })}
      </Typography>
    </AnalysisSection>
  );
};

export default WhiteNoiseTest;

{
  /* <StepButton>
  <Box sx={{ fontSize: 16 }}>
    Is the data{' '}
    <InfoOverlay id="whiteNoise" label="white noise">
      <InfoOverlay.Popover>
        <Typography>
          A time series is white noise if the variables are independent and
          identically distributed with a mean of zero. This means that all
          variables have the same variance (sigma^2) and each value has a zero
          correlation with all other values in the series.
        </Typography>
        <br />
        <SparkLineChart
          heading={'Example white noise time series'}
          data={[whiteNoiseDemoDatapoints]}
          formatXScale={identity}
          height={200}
          padding={{ top: 8, bottom: 24, left: 20, right: 10 }}
        />
        <Typography>
          To test whether the data is white noise, we run Ljung-Box test of
          autocorrelation in residuals. If a time series is white noise, it is a
          sequence of random numbers and cannot be predicted.
        </Typography>
      </InfoOverlay.Popover>
    </InfoOverlay>
    ?
  </Box>
</StepButton>; */
}
