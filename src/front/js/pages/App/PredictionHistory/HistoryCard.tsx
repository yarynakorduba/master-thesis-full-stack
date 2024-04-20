import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography
} from '@mui/material';
import { round } from 'lodash';

import { THistoryEntry } from '../Analysis/types';
import { PRECISION } from '../../../consts';
import { CardDate, Header } from './styles';

type TProps = {
  readonly historyEntry: THistoryEntry;
  readonly onClick: (historyEntry: THistoryEntry) => void;
};

const HistoryCard = ({ historyEntry, onClick }: TProps) => {
  const renderOrder = (order) => (order ? `[${order.join(', ')}]` : 'N/A');
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => onClick(historyEntry)}>
        <CardContent>
          <Header>
            <Grid container gap={0.5}>
              <Chip size="small" label={historyEntry.predictionMode} />
              <Chip
                size="small"
                label={<> MAPE: {round(historyEntry.evaluation.mape, PRECISION)}</>}
              />
            </Grid>
            <CardDate color="text.secondary">
              {new Date(historyEntry.timestamp).toLocaleDateString()}{' '}
              <Box sx={{ display: 'inline', whiteSpace: 'nowrap' }}>
                {new Date(historyEntry.timestamp).getHours()}:{' '}
                {new Date(historyEntry.timestamp).getMinutes()}
              </Box>
            </CardDate>
          </Header>

          <Typography variant="subtitle2" color="text.secondary">
            Test data prediction params
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Order: {renderOrder(historyEntry.testPredictionParameters.order)}, Seasonal order:{' '}
            {renderOrder(historyEntry.testPredictionParameters.seasonalOrder)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Real data prediction params
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Order: {renderOrder(historyEntry.realPredictionParameters.order)}, Seasonal order:{' '}
            {renderOrder(historyEntry.realPredictionParameters.seasonalOrder)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
