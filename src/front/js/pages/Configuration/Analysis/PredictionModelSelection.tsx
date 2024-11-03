import React from 'react';
import { isEmpty } from 'lodash';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import { Divider, Grid, Tooltip } from '@mui/material';
import { EPredictionMode } from './types';

import {
  useConfigData,
  useGetPredictionHistory,
  useIsHistoryDrawerOpen,
  useIsHistoryPredictionSelected,
} from '../../../store/currentConfiguration/selectors';
import PredictionInfoText from './PredictionInfoText';
import AboutTheModelsPopup from '../InfoOverlayTexts/AboutTheModelsPopup';

type TProps = {
  readonly predictionMode: EPredictionMode;
  readonly setPredictionMode: (predictionMode: EPredictionMode) => void;
};
const PredictionModelSelection = ({
  predictionMode,
  setPredictionMode,
}: TProps) => {
  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const [isHistoryOpen, setIsHistoryDrawerOpen] = useIsHistoryDrawerOpen();
  const predictionHistory = useGetPredictionHistory();

  const { valueProperties } = useConfigData();

  return (
    <>
      <Typography variant="h5" display="flex">
        Prediction{' '}
        {!isEmpty(predictionHistory) && (
          <ToggleButton
            sx={{ ml: 2, paddingTop: 0.5, paddingBottom: 0.5 }}
            size="small"
            color="primary"
            selected={isHistoryOpen}
            value={true}
            onChange={() => setIsHistoryDrawerOpen(!isHistoryOpen)}
          >
            History
          </ToggleButton>
        )}
        <Divider
          sx={{ margin: 1 }}
          orientation="vertical"
          variant="middle"
          component="div"
          flexItem
        />
        <PredictionInfoText />
      </Typography>
      <Grid item md={12}>
        <Tooltip
          title={
            isHistoryPredictionSelected
              ? 'Go back to draft to change the model selection'
              : 'Select a model for prediction'
          }
        >
          <ToggleButtonGroup
            value={predictionMode}
            exclusive
            onChange={(e, value) => setPredictionMode(value)}
            aria-label="text alignment"
            size="small"
            color="primary"
            disabled={isHistoryPredictionSelected}
          >
            <ToggleButton
              value={EPredictionMode.ARIMA}
              aria-label="left aligned"
              sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
            >
              ARIMA model
            </ToggleButton>
            {valueProperties?.length > 1 && (
              <ToggleButton
                value={EPredictionMode.VAR}
                aria-label="right aligned"
                sx={{ ml: 2, paddingTop: 0.5, paddingBottom: 0.5 }}
              >
                VAR model
              </ToggleButton>
            )}
          </ToggleButtonGroup>
        </Tooltip>
        <AboutTheModelsPopup />
      </Grid>
    </>
  );
};

export default PredictionModelSelection;
