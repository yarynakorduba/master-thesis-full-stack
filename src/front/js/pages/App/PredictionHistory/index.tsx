import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import { isEmpty } from 'lodash';

import {
  useDisplayedPredictionId,
  useGetPredictionHistory
} from '../../../store/configuration/selectors';
import HistoryCard from './HistoryCard';
import { scaleLinear } from '@visx/scale';
import { getExtent } from '../../../utils';

const PredictionHistory = () => {
  const predictionHistory = useGetPredictionHistory();
  const [displayedPredictionId, setDisplayedPredictionId] = useDisplayedPredictionId();

  const mapeExtent = getExtent(predictionHistory, 'evaluation.mape');
  const mapeLinearScale = scaleLinear({ domain: mapeExtent, range: [red[50], red[200]] });

  if (isEmpty(predictionHistory)) return null;
  return (
    <Box sx={{ height: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        History
      </Typography>
      <Grid spacing={1} container>
        {predictionHistory.map((historyEntry) => {
          return (
            <Grid item xs={12} key={historyEntry.id}>
              <HistoryCard
                historyEntry={historyEntry}
                isSelected={displayedPredictionId === historyEntry.id}
                onClick={(entry) => setDisplayedPredictionId(entry.id)}
                mapeColor={mapeLinearScale(historyEntry.evaluation.mape)}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PredictionHistory;
