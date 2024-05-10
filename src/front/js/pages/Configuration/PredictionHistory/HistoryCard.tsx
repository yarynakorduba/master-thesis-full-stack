import React from 'react';
import {
  Box,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import { noop, round } from 'lodash';

import { THistoryEntry } from '../Analysis/types';
import { PRECISION } from '../../../consts';
import { CardDate, CardHeader, Card } from './styles';
import { formatDateToDateTime, formatOrder } from '../../../utils/formatters';
import LineChart from '../../../shared/charts/LineChart';
import SparkLineChart from '../../../shared/charts/LineChart/SparkLineChart';
import {
  PREDICTION_TIMESTAMP_PROP,
  PREDICTION_VALUE_PROP,
  mapARIMAPrediction,
} from '../../../utils/prediction';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';

type TProps = {
  readonly historyEntry: THistoryEntry;
  readonly onClick: (historyEntry: THistoryEntry) => void;
  readonly isLatest?: boolean;
  readonly isSelected: boolean;
  readonly mapeColor: string;
};

const HistoryCard = ({
  historyEntry,
  onClick,
  isSelected,
  isLatest,
  mapeColor,
}: TProps) => {
  const theme = useTheme();
  const mappedARIMAPrediction = mapARIMAPrediction(historyEntry);

  const testPredictedData = constructLineChartDataFromTs(
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedARIMAPrediction?.[0],
    theme.palette.charts.chartPink,
    `test data prediction`,
  );

  const realPredictedData = constructLineChartDataFromTs(
    PREDICTION_VALUE_PROP,
    PREDICTION_TIMESTAMP_PROP,
    mappedARIMAPrediction?.[1],
    theme.palette.charts.chartFuchsia,
    `real data prediction`,
  );

  return (
    <Card
      isSelected={isSelected}
      variant={isSelected ? 'outlined' : 'elevation'}
    >
      <CardActionArea onClick={() => onClick(historyEntry)}>
        <CardContent>
          <CardHeader>
            <Grid container gap={0.5}>
              <Chip size="small" label={historyEntry.predictionMode} />
              <Chip
                size="small"
                sx={{ background: mapeColor }}
                label={
                  <> MAPE: {round(historyEntry.evaluation.mape, PRECISION)}</>
                }
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
            Order: {formatOrder(historyEntry.testPredictionParameters.order)},
            Seasonal order:{' '}
            {formatOrder(historyEntry.testPredictionParameters.seasonal_order)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Real data prediction params
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Order: {formatOrder(historyEntry.realPredictionParameters.order)},
            Seasonal order:{' '}
            {formatOrder(historyEntry.realPredictionParameters.seasonal_order)}
          </Typography>
          <Box width="100%">
            <SparkLineChart
              heading={''}
              data={
                testPredictedData && realPredictedData
                  ? [testPredictedData, realPredictedData]
                  : []
              }
              height={50}
              width={300}
              onClick={noop}
              padding={{ top: 8, bottom: 8, left: 24, right: 0 }}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
