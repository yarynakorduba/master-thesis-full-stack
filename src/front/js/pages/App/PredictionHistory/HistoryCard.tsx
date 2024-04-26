import React from 'react';
import { Box, CardActionArea, CardContent, Chip, Grid, Typography } from '@mui/material';
import { round } from 'lodash';

import { THistoryEntry } from '../Analysis/types';
import { PRECISION } from '../../../consts';
import { CardDate, CardHeader, Card } from './styles';
import { formatDateToDateTime, formatOrder } from '../../../utils/formatters';

type TProps = {
  readonly historyEntry: THistoryEntry;
  readonly onClick: (historyEntry: THistoryEntry) => void;
  readonly isSelected: boolean;
  readonly mapeColor: string;
};

const HistoryCard = ({ historyEntry, onClick, isSelected, mapeColor }: TProps) => {
  return (
    <Card isSelected={isSelected} variant={isSelected ? 'outlined' : 'elevation'}>
      <CardActionArea onClick={() => onClick(historyEntry)}>
        <CardContent>
          <CardHeader>
            <Grid container gap={0.5}>
              <Chip size="small" label={historyEntry.predictionMode} />
              <Chip
                size="small"
                sx={{ background: mapeColor }}
                label={<> MAPE: {round(historyEntry.evaluation.mape, PRECISION)}</>}
              />
            </Grid>
            <CardDate color="text.secondary">
              {formatDateToDateTime(new Date(historyEntry.timestamp))}
            </CardDate>
          </CardHeader>
          <Typography variant="subtitle2" color="text.secondary">
            Test data prediction params
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Order: {formatOrder(historyEntry.testPredictionParameters.order)}, Seasonal order:{' '}
            {formatOrder(historyEntry.testPredictionParameters.seasonalOrder)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Real data prediction params
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Order: {formatOrder(historyEntry.realPredictionParameters.order)}, Seasonal order:{' '}
            {formatOrder(historyEntry.realPredictionParameters.seasonalOrder)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
