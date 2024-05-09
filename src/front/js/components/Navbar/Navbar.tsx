import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {
  useIsHistoryPredictionSelected,
  usePrediction,
} from '../../store/configuration/selectors';
import { formatDateToDateTime } from '../../../js/utils/formatters';

export const Navbar = () => {
  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const [prediction] = usePrediction();
  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense">
        <Typography variant="h5" sx={{ marginRight: 2 }}>
          Time Insights
        </Typography>
        {isHistoryPredictionSelected && !!prediction && (
          <Typography
            sx={{ textAlign: 'left' }}
            variant="subtitle2"
            color="text.secondary"
          >
            You are viewing the prediction calculated on{' '}
            {formatDateToDateTime(prediction.timestamp)}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
