import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import {
  flow,
  get,
  isEmpty,
  isNil,
  map,
  partition,
  reverse,
  sortBy,
} from 'lodash';

import {
  useConfigData,
  useDisplayedPredictionId,
  useGetPredictionHistory,
} from '../../../store/currentConfiguration/selectors';
import HistoryCard from './HistoryCard';
import { getLinearValueScale } from '../../../utils';
import { THistoryEntry } from '../Analysis/types';
import SorterPopover from './SorterPopover';

const PredictionHistory = () => {
  const predictionHistory = useGetPredictionHistory();
  const [displayedPredictionId, setDisplayedPredictionId] =
    useDisplayedPredictionId();

  const { valueProperties } = useConfigData();
  const sortOptions = [
    { label: 'Date', value: 'createdAt' },
    ...map(valueProperties, (prop) => ({
      label: `MAE of ${prop.label}`,
      value: `evaluation.["${prop.value}"].mae`,
    })),
    ...map(valueProperties, (prop) => ({
      label: `MRSE of ${prop.label}`,
      value: `evaluation.["${prop.value}"].rmse`,
    })),
  ];
  const errorColorScale = getLinearValueScale(predictionHistory, [
    red[50],
    red[200],
  ]);

  const [sorter, setSorter] = useState<any>({
    label: 'Date',
    propPath: 'createdAt',
    direction: 'desc',
  });
  const [sortedPredictionHistory, setSortedPredictionHistory] =
    useState<THistoryEntry[]>();

  useEffect(() => {
    const { propPath, direction } = sorter;

    const [historyToSort, rest] = partition(
      predictionHistory,
      (historyItem) => !isNil(get(historyItem, propPath)),
    );
    if (!isEmpty(historyToSort)) {
      const sorted = flow(
        (h) => sortBy(h, (historyItem) => get(historyItem, propPath)),
        (h) => (direction === 'asc' ? h : reverse(h)),
      )(historyToSort);

      setSortedPredictionHistory([...sorted, ...rest]);
    }
  }, [sorter, predictionHistory]);

  if (isEmpty(predictionHistory)) return null;
  return (
    <Box sx={{ height: 'auto', paddingY: 2, paddingX: 1 }}>
      <Typography variant="h5" sx={{ mb: 1, display: 'flex', gap: 1 }}>
        History
        <SorterPopover
          sorter={sorter}
          setSorter={setSorter}
          sortOptions={sortOptions}
        />
      </Typography>
      <Grid spacing={1} container alignItems="stretch">
        {map(sortedPredictionHistory, (historyEntry, index) => {
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
