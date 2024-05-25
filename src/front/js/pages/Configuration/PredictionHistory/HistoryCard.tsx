import React from 'react';
import {
  Box,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  useTheme,
} from '@mui/material';
import { noop } from 'lodash';
import * as d3Scale from 'd3-scale';

import { THistoryEntry } from '../Analysis/types';
import { CardDate, CardHeader, Card } from './styles';
import { formatDateToDateTime } from '../../../utils/formatters';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import {
  PREDICTION_TIMESTAMP_PROP,
  PREDICTION_VALUE_PROP,
} from '../../../utils/prediction';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';
import ARIMAPredictionParams from '../Analysis/ARIMAPredictionParams';
import EvaluationIndicators from '../Analysis/EvaluationIndicators';

type TProps = {
  readonly historyEntry: THistoryEntry;
  readonly onClick: (historyEntry: THistoryEntry) => void;
  readonly isLatest?: boolean;
  readonly isSelected: boolean;
  readonly errorColorScale: (
    key: string,
  ) => d3Scale.ScaleLinear<number | string, number | string>;
};

const HistoryCard = ({
  historyEntry,
  onClick,
  isSelected,
  errorColorScale,
}: TProps) => {
  const theme = useTheme();
  const mappedARIMAPrediction = []; //mapARIMAPrediction(historyEntry);

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
            <Grid container gap={0.5} direction="column">
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Chip size="small" label={historyEntry.predictionMode} />
                <CardDate color="text.secondary">
                  {formatDateToDateTime(new Date(historyEntry.createdAt))}
                </CardDate>
              </Stack>
              <EvaluationIndicators
                evaluation={historyEntry.evaluation}
                errorColorScale={errorColorScale}
              />
            </Grid>
          </CardHeader>
          <ARIMAPredictionParams arimaResult={historyEntry} />
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
              padding={{ top: 8, bottom: 8, left: 0, right: 0 }}
              numTicks={0}
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
