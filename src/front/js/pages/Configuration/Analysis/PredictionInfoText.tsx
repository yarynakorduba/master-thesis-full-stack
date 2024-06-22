import React from 'react';
import { Button, Typography } from '@mui/material';
import grey from '@mui/material/colors/grey';
import { formatDateToDateTime } from '../../../utils/formatters';
import {
  useDisplayedPredictionId,
  useIsHistoryPredictionSelected,
  usePrediction,
  useSelectedDataBoundaries,
} from '../../../store/currentConfiguration/selectors';

const PredictionInfoText = ({ sx }: { sx?: any }) => {
  const isHistoryPredictionSelected = useIsHistoryPredictionSelected();
  const [, setDisplayedPredictionId] = useDisplayedPredictionId();
  const [prediction] = usePrediction();

  const [selectedDataBoundaries, setSelectedDataBoundaries] =
    useSelectedDataBoundaries();

  const handleClearPredictionData = () => {
    setDisplayedPredictionId(undefined);
    setSelectedDataBoundaries(undefined);
  };

  if (!isHistoryPredictionSelected || !prediction) return null;
  return (
    <Typography
      sx={sx}
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
            Back to draft
          </Button>
        </>
      )}
    </Typography>
  );
};

export default PredictionInfoText;
