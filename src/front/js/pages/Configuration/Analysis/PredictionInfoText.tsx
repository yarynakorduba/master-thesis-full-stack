import React from 'react';
import { Typography } from '@mui/material';
import { formatDateToDateTime } from '../../../utils/formatters';
import { THistoryEntry } from './types';

type TProps = {
  readonly prediction: THistoryEntry;
  readonly isHistoryPredictionSelected: boolean;
};

const PredictionInfoText = ({
  prediction,
  isHistoryPredictionSelected,
}: TProps) => {
  return (
    <Typography
      sx={{ textAlign: 'left', height: 16, marginTop: -2, marginBottom: 1 }}
      variant="subtitle2"
      color="text.secondary"
    >
      {isHistoryPredictionSelected && !!prediction && (
        <>
          You are viewing the prediction calculated on{' '}
          {formatDateToDateTime(prediction.timestamp)}
        </>
      )}
    </Typography>
  );
};

export default PredictionInfoText;
