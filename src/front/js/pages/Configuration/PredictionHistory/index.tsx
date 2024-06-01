import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import { isEmpty } from 'lodash';

import {
  useDisplayedPredictionId,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import HistoryCard from './HistoryCard';
import { getLinearValueScale } from '../../../utils';

const PredictionHistory = () => {
  const predictionHistory = useGetPredictionHistory();
  const [displayedPredictionId, setDisplayedPredictionId] =
    useDisplayedPredictionId();

  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);

  if (isEmpty(predictionHistory)) return null;
  return (
    <Box
      sx={{
        height: 'auto',
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        History
      </Typography>
      <Grid spacing={1} container alignItems="stretch">
        {predictionHistory.map((historyEntry, index) => {
          return (
            <Grid item xs={12} key={historyEntry.id}>
              <HistoryCard
                historyEntry={historyEntry}
                isLatest={index === 0}
                isSelected={displayedPredictionId === historyEntry.id}
                onClick={(entry) => setDisplayedPredictionId(entry.id)}
                errorColorScale={errorColorScale}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PredictionHistory;
