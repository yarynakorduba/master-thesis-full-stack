import React from 'react';
import { useTheme } from '@mui/material';
import { Typography } from '@mui/material';
import { identity } from 'lodash';

import { SparkLineChart } from '../../../sharedComponents/charts/LineChart';
import whiteNoiseData from '../../../../../api/data/gaussianDataset.json';

const WhiteNoiseText = () => {
  const { palette } = useTheme();
  const whiteNoiseDemoDatapoints = {
    id: 'white-noise',
    color: palette.charts.chartRealData,
    label: '',
    datapoints: whiteNoiseData.map((valueY, valueX) => ({ valueX, valueY })),
  };

  return (
    <>
      {' '}
      <Typography>
        White noise is the most fundamental example of stationary process. It
        consists of independent and identically distributed random variables,
        which have zero mean and constant variance.
        {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
        In other words, white noise immediately forgets its past.
        {/* https://web.vu.lt/mif/a.buteikis/wp-content/uploads/2018/02/Lecture_02.pdf */}
      </Typography>
      <Typography>
        If a time series is white noise, it cannot be predicted.
      </Typography>
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
    </>
  );
};

export default WhiteNoiseText;
