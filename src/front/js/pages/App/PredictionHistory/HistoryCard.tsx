import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import { round } from 'lodash';

import { THistoryEntry, TLastTrainPoint, TPredictedPoints } from '../Analysis/types';
import { PRECISION } from '../../../consts';

type TProps = {
  readonly historyEntry: THistoryEntry;
  readonly onClick: (historyEntry: THistoryEntry) => void;
};

const HistoryCard = ({ historyEntry, onClick }: TProps) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
          {new Date(historyEntry.timestamp).toLocaleDateString()},{' '}
          {new Date(historyEntry.timestamp).toLocaleTimeString()}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
          MAPE: {round(historyEntry.evaluation.mape, PRECISION)}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
          Test data prediction params
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Order, Seasonal order: {historyEntry.testPredictionParameters.order},{' '}
          {historyEntry.testPredictionParameters.seasonalOrder || 'N/A'}
        </Typography>
        <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
          Real data prediction params
        </Typography>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Order, Seasonal order: {historyEntry.realPredictionParameters.order},{' '}
          {historyEntry.realPredictionParameters.seasonalOrder || 'N/A'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onClick(historyEntry)}>
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default HistoryCard;
