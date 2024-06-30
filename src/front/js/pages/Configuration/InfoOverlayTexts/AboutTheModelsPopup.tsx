import { Stack, Divider, Typography } from '@mui/material';
import React from 'react';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import ARIMAModelText from './ArimaModelText';
import VARModelText from './VARModelText';

const AboutTheModelsPopup = () => {
  return (
    <InfoOverlay
      id="more-about-the-models"
      label="More about the models"
      sx={{ ml: 2 }}
      overlayStyles={{ width: '80vw', maxWidth: '800px' }}
    >
      <InfoOverlay.Popover>
        <Typography>
          <strong>What model to choose?</strong> You can choose any model, but
          if you have multivariate time series data and know about possible
          causal relationships between its variables, the VAR model might be
          more beneficial since it considers these relationships for prediction.
        </Typography>
        <Stack direction="row" width="auto" columnGap={1}>
          <ARIMAModelText />
          <Divider
            sx={{ margin: 1 }}
            orientation="vertical"
            variant="middle"
            component="div"
            flexItem
          />
          <VARModelText />
        </Stack>
      </InfoOverlay.Popover>
    </InfoOverlay>
  );
};

export default AboutTheModelsPopup;
