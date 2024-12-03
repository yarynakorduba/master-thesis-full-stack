import React from 'react';
import { map, some } from 'lodash';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { Box, Grid, alpha } from '@mui/material';
import { useFormContext } from 'react-hook-form';

import Loader from '../../../sharedComponents/Loader';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import { EAnalysisFormFields } from './types';
import AnalysisSection from './AnalysisSection';
import WhiteNoiseText from '../InfoOverlayTexts/WhiteNoiseText';

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
  const { getValues } = formMethods;

  const handleClick = () => {
    const values = getValues();
    handleFetchIsWhiteNoise({
      maxLagOrder: +values.whiteNoiseMaxLagOrder,
      periods: values[EAnalysisFormFields.isSeasonal]
        ? +values[EAnalysisFormFields.periodsInSeason]
        : undefined,
    });
  };

  const isAnyFieldWhiteNoise = some(whiteNoiseResult, 'isWhiteNoise');

  if (!isVisible) return null;
  return (
    <AnalysisSection md={6}>
      <AnalysisSection.Header index={index}>
        Check data for randomness{' '}
        <InfoOverlay id="whiteNoise" label="(white noise)">
          <InfoOverlay.Popover>{<WhiteNoiseText />}</InfoOverlay.Popover>
        </InfoOverlay>
      </AnalysisSection.Header>
      <Grid item md={12}>
        {isWhiteNoiseLoading && <Loader />}
        <Button size="small" onClick={handleClick}>
          Run white noise test
        </Button>
      </Grid>
      <Grid item md={12}>
        <Typography variant="body1">
          {map(whiteNoiseResult, (resultForKey) => {
            const { key, isWhiteNoise } = resultForKey;
            return (
              <Box>
                {key}:{' '}
                <Typography
                  component="span"
                  sx={{
                    background: !isWhiteNoise
                      ? alpha(palette.success.light, 0.2)
                      : alpha(palette.warning.light, 0.2),
                  }}
                >
                  {isWhiteNoise ? '' : 'not '}white noise
                </Typography>
              </Box>
            );
          })}
        </Typography>
        <Typography variant="body2">
          {' '}
          {isAnyFieldWhiteNoise &&
            'Note: If a time series is white noise, it is a sequence of random numbers and cannot be predicted.'}
        </Typography>
      </Grid>
    </AnalysisSection>
  );
};

export default WhiteNoiseTest;
