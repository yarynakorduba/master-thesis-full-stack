import React from 'react';
import { identity, map, noop } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import StepButton from '@mui/material/StepButton';
import StepContent from '@mui/material/StepContent';
import Box from '@mui/material/Box';

import { ButtonContainer } from '../../../sharedComponents/charts/SparkLineChartsBlock/styles';
import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import LineChart from '../../../sharedComponents/charts/LineChart';

import whiteNoiseData from '../../../../../api/data/gaussianDataset.json';
import { formatNumber } from '../../../utils/formatters';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import { useTheme } from '@mui/material/styles';

type TProps = {
  readonly isVisible: boolean;
  readonly whiteNoiseResult;
  readonly isWhiteNoiseLoading: boolean;
  readonly handleFetchIsWhiteNoise;
  readonly handleSelectStep: (stepIndex: number) => () => void;
  readonly index: number;
};

const WhiteNoiseTest = ({
  isVisible,
  whiteNoiseResult,
  isWhiteNoiseLoading,
  handleFetchIsWhiteNoise,
  handleSelectStep,
  index,
}: TProps) => {
  const { palette } = useTheme();
  const whiteNoiseDemoDatapoints = {
    id: 'white-noise',
    color: palette.charts.chartBlue,
    label: '',
    datapoints: whiteNoiseData.map((element, index) => ({
      valueX: index,
      valueY: element,
    })),
  };

  // readonly id: string | number;
  // readonly color: string;
  // readonly label: string;
  // readonly datapoints: Array<TLineChartDatapoint>;

  if (!isVisible) return null;
  return (
    <>
      <StepButton onClick={handleSelectStep(index)}>
        <Box sx={{ fontSize: 16 }}>
          Is the data{' '}
          <InfoOverlay id="whiteNoise" label="white noise">
            <InfoOverlay.Popover>
              <Typography>
                A time series is white noise if the variables are independent
                and identically distributed with a mean of zero. This means that
                all variables have the same variance (sigma^2) and each value
                has a zero correlation with all other values in the series.
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
                To test whether the data is white noise, we run Ljung-Box test
                of autocorrelation in residuals. If a time series is white
                noise, it is a sequence of random numbers and cannot be
                predicted.
              </Typography>
            </InfoOverlay.Popover>
          </InfoOverlay>
          ?
        </Box>
      </StepButton>{' '}
      <StepContent sx={{ paddingTop: 1 }}>
        <ButtonContainer>
          {isWhiteNoiseLoading && <Loader />}
          {!whiteNoiseResult && !isWhiteNoiseLoading && (
            <Button size="small" onClick={handleFetchIsWhiteNoise}>
              Run white-noise test
            </Button>
          )}
        </ButtonContainer>
        <Typography variant="body1">
          {whiteNoiseResult &&
            map(whiteNoiseResult, (val, propName) => {
              return `${propName} data ${val?.isWhiteNoise ? 'are white noise' : 'are not white noise'}`;
            }).join('; ')}
        </Typography>
      </StepContent>
    </>
  );
};

export default WhiteNoiseTest;
