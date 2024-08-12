import React from 'react';
import { Divider, List, ListItem, ListItemText, useTheme } from '@mui/material';
import { Typography } from '@mui/material';
import { identity } from 'lodash';

import { SparkLineChart } from '../../../sharedComponents/charts/LineChart';
import whiteNoiseData from '../../../../../api/data/gaussianDataset.json';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import OpenAIDisclaimer from './OpenAIDisclaimer';
import Cite from './Cite';

const WhiteNoiseText = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

  const { palette } = useTheme();

  const whiteNoiseDemoDatapoints = {
    id: 'white-noise',
    color: palette.charts.chartRealData,
    label: '',
    datapoints: whiteNoiseData.map((valueY, valueX) => ({ valueX, valueY })),
  };

  if (isSimplifiedTextShown) {
    return (
      <>
        <Typography>
          White noise is a process which consists of random values that are all
          independent of each other and have the same statistical properties.
          Imagine flipping a coin repeatedly and recording the results. Each
          flip is independent of the previous ones, and the outcome is always
          equally likely to be heads or tails. Key points:
          <List sx={{ width: '100%', maxWidth: 'lg' }}>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Independent and Identical.</strong> Each value
                doesn&apos;t depend on the others.{'\n'}
                <em>Example:</em> Rolling a fair die. Each roll is independent
                and has an equal chance for any number (1-6).
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Zero Mean.</strong> The average value is zero.{'\n'}
                <em>Example:</em> If we assign +1 for heads and -1 for tails in
                our coin flips, over many flips, the average will be close to
                zero.
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Constant Variance.</strong> The variability around the
                average value stays the same.
                {'\n'}
                <em>Example:</em> In our coin flips, the variability is the same
                no matter how many times we flip the coin.
              </ListItemText>
            </ListItem>
            <ListItem disableGutters disablePadding>
              <ListItemText>
                <strong>Immediate Forgetting.</strong> White noise doesn&apos;t
                remember its past values.
                {'\n'}
                <em>Example:</em> Each coin flip is independent, so the outcome
                of one flip doesn’t influence the next.
              </ListItemText>
            </ListItem>
          </List>
        </Typography>
        <Typography fontWeight={600}>
          If a time series is white noise, it cannot be predicted. This is
          because there is no pattern or trend in the data to base predictions
          on.
        </Typography>
        <SparkLineChart
          heading={'Example white noise time series'}
          data={[whiteNoiseDemoDatapoints]}
          formatXScale={identity}
          height={200}
          padding={{ top: 8, bottom: 24, left: 20, right: 10 }}
        />
        <Typography>
          To check if your data is white noise, we use a statistical test called
          the Ljung-Box test.
        </Typography>
        <OpenAIDisclaimer />
      </>
    );
  }
  return (
    <>
      {' '}
      <Typography>
        White noise is the most fundamental example of stationary process. It
        consists of independent and identically distributed random variables,
        which have zero mean and constant variance <Cite index={1} />.
        {/* http://repo.darmajaya.ac.id/4781/1/Time%20Series%20Analysis_%20Forecasting%20and%20Control%20%28%20PDFDrive%20%29.pdf */}
        In other words, white noise immediately forgets its past{' '}
        <Cite index={2} />.
        {/* https://web.vu.lt/mif/a.buteikis/wp-content/uploads/2018/02/Lecture_02.pdf */}
      </Typography>
      <Typography fontWeight={600}>
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
      <Divider />
      <Cite.Source index={1}>
        Box, G. E., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015). Time
        series analysis: forecasting and control. John Wiley & Sons.
      </Cite.Source>
      <Cite.Source index={2}>
        Buteikis, A. (2018). 02 Stationary time series.
      </Cite.Source>
    </>
  );
};

export default WhiteNoiseText;
