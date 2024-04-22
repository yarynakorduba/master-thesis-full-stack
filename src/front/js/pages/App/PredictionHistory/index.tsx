import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, Grid } from '@mui/material';
import { isEmpty } from 'lodash';

import {
  useDisplayedPredictionId,
  useGetPredictionHistory
} from '../../../store/configuration/selectors';
import HistoryCard from './HistoryCard';

const PredictionHistory = () => {
  const predictionHistory = useGetPredictionHistory();
  const [displayedPredictionId, setDisplayedPredictionId] = useDisplayedPredictionId();

  if (isEmpty(predictionHistory)) return null;
  return (
    <Box sx={{ height: 'auto' }}>
      <Typography variant="h5" sx={{ marginBottom: 1 }}>
        History
        {displayedPredictionId !== 'latestPrediction' ? (
          <Button
            sx={{ marginLeft: 1 }}
            onClick={() => setDisplayedPredictionId('latestPrediction')}
          >
            Back to the latest state
          </Button>
        ) : null}
      </Typography>
      <Grid spacing={1} container>
        {predictionHistory.map((historyEntry) => {
          return (
            <Grid item xs={6} key={historyEntry.id}>
              <HistoryCard
                historyEntry={historyEntry}
                isSelected={displayedPredictionId === historyEntry.id}
                onClick={(entry) => {
                  setDisplayedPredictionId(entry.id);
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
