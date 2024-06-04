import React from 'react';
import { CardActionArea, CardContent, Chip, Grid, Stack } from '@mui/material';
import * as d3Scale from 'd3-scale';

import { THistoryEntry } from '../Analysis/types';
import { CardDate, CardHeader, Card } from './styles';
import { formatDateToDateTime } from '../../../utils/formatters';

import ARIMAPredictionParams from '../Analysis/ARIMAPredictionParams';
import EvaluationIndicators from './EvaluationIndicators';
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
  const { valueProperties, timeProperty, data } = useConfigData();

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
            historyEntry={historyEntry}
            evaluation={historyEntry.evaluation}
            errorColorScale={errorColorScale}
            predictions={historyEntry}
            timeseriesData={data}
            timeProperty={timeProperty}
          />
          <ARIMAPredictionParams arimaResult={historyEntry} />
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default HistoryCard;
