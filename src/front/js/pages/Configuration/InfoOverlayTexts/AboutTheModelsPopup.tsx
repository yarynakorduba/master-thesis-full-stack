import { Stack, Divider } from '@mui/material';
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
