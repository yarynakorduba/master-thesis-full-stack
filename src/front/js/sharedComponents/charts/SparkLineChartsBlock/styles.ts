import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

export const LineChartContainer = styled(Stack)`
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  padding-bottom: 32px;
  min-height: 300px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;
export const SparkLineChartsContainer = styled(Box)`
  flex-basis: 200px;
`;

export const ButtonContainer = styled('div')`
  display: flex;
  align-items: center;
`;
