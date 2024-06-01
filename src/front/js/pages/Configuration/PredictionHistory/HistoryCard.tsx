import React from 'react';
import { CardActionArea, CardContent, Chip, Grid, Stack } from '@mui/material';
import { reduce } from 'lodash';
import * as d3Scale from 'd3-scale';

import { THistoryEntry } from '../Analysis/types';
import { CardDate, CardHeader, Card } from './styles';
import { formatDateToDateTime } from '../../../utils/formatters';
import SparkLineChart from '../../../sharedComponents/charts/LineChart/SparkLineChart';
import {
  PREDICTION_TIMESTAMP_PROP,
  PREDICTION_VALUE_PROP,
  convertPredictionData,
} from '../../../utils/prediction';
import { constructLineChartDataFromTs } from '../../../utils/lineChartData';
import ARIMAPredictionParams from '../Analysis/ARIMAPredictionParams';
import EvaluationIndicators from '../Analysis/EvaluationIndicators';
import { useConfigData } from '../../../store/currentConfiguration/selectors';

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
  const { valueProperties } = useConfigData();

  const mappedARIMAPredictions = reduce(
    valueProperties,
    (accum, prop) => ({
      ...accum,
      [prop.value]: convertPredictionData(historyEntry, prop.value),
    }),
    {},
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
            </Grid>
          </CardHeader>
          <EvaluationIndicators
            evaluation={historyEntry.evaluation}
            errorColorScale={errorColorScale}
            predictions={mappedARIMAPredictions}
          />
          <ARIMAPredictionParams arimaResult={historyEntry} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
