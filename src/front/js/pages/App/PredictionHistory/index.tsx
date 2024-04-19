import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useGetPredictionHistory } from '../../../store/configuration/selectors';
import { isEmpty } from 'lodash';
import HistoryCard from './HistoryCard';

const PredictionHistory = () => {
  const predictionHistory = useGetPredictionHistory();
  console.log('PREDICTION HISTORY --- > ', predictionHistory);
  if (isEmpty(predictionHistory)) return null;
  return (
    <Box sx={{ height: 'auto' }}>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        History
      </Typography>
      <Grid spacing={1} container>
        {predictionHistory.map((historyEntry) => {
          return (
            <Grid item xs={6} key={historyEntry.id}>
              <HistoryCard
                historyEntry={historyEntry}
                onClick={() => {
                  console.log('Clicked');
                }}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PredictionHistory;
