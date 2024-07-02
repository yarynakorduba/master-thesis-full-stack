import { Stack, Divider, Typography } from '@mui/material';
import React from 'react';
import InfoOverlay from '../../../sharedComponents/InfoOverlay';
import ARIMAModelText from './ArimaModelText';
import VARModelText from './VARModelText';
import { useGetAreSimplifiedUIDescriptionsShown } from '../../../store/settings/selectors';
import OpenAIDisclaimer from './OpenAIDisclaimer';
import Cite from './Cite';

const AboutTheModelsPopup = () => {
  const isSimplifiedTextShown = useGetAreSimplifiedUIDescriptionsShown();

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
          <ARIMAModelText showDetails={false} />
          <Divider
            sx={{ margin: 1 }}
            orientation="vertical"
            variant="middle"
            component="div"
            flexItem
          />
          <VARModelText showDetails={false} startIndexNumber={2} />
        </Stack>
        {isSimplifiedTextShown ? (
          <OpenAIDisclaimer />
        ) : (
          <>
            <Divider />
            <Cite.Source index={1}>
              Box, G. E., Jenkins, G. M., Reinsel, G. C., & Ljung, G. M. (2015).
              Time series analysis: forecasting and control. John Wiley & Sons.
            </Cite.Source>
            <Cite.Source index={2}>
              Hyndman, R. J., & Athanasopoulos, G. (2018). Forecasting:
              principles and practice. OTexts.
            </Cite.Source>
          </>
        )}
      </InfoOverlay.Popover>
    </InfoOverlay>
  );
};

export default AboutTheModelsPopup;
