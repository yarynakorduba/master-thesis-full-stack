import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useIsHistoryPredictionSelected } from '../../store/configuration/selectors';

export const Navbar = () => {
  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense">
        <Typography variant="h5" sx={{ marginRight: 2 }}>
          Time Insights
        </Typography>
        {isHistoryPredictionSelected && (
          <Typography sx={{ textAlign: 'left' }} variant="subtitle2">
            You are viewing the prediction performed on{' '}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
