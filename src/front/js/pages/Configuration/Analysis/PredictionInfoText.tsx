import React from 'react';
import { Button, Typography } from '@mui/material';
import grey from '@mui/material/colors/grey';
import { formatDateToDateTime } from '../../../utils/formatters';
import { THistoryEntry } from './types';

type TProps = {
  readonly prediction?: THistoryEntry;
  readonly isHistoryPredictionSelected: boolean;
  readonly handleClearPredictionData: () => void;
};

const PredictionInfoText = ({
  prediction,
  isHistoryPredictionSelected,
  handleClearPredictionData,
}: TProps) => {
  if (!isHistoryPredictionSelected || !prediction) return null;
  return (
    <Typography
      sx={{
        textAlign: 'left',
        height: 36.5,
        marginTop: -3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
      fontSize={14}
      variant="subtitle2"
      color={grey[500]}
      component={'em'}
    >
      {isHistoryPredictionSelected && !!prediction && (
        <>
          You are viewing the prediction calculated on{' '}
          {formatDateToDateTime(prediction?.createdAt)}
          <Button onClick={handleClearPredictionData} sx={{ ml: 1 }}>
            Back to draft state
          </Button>
        </>
      )}
    </Typography>
  );
};

export default PredictionInfoText;
