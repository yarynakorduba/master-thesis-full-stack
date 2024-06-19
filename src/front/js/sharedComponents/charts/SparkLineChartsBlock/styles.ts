import { Box, Stack, Typography } from '@mui/material';
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
export const SparkLineChartsContainer = styled(Stack)`
  flex-basis: 200px;
  row-gap: 8px;
`;

export const SparkLineChartWrapper = styled('div')<{
  readonly isSelected: boolean;
}>`
  &:hover {
    background: ${({ theme, isSelected }) =>
      isSelected ? theme.palette.action.selected : theme.palette.action.hover};
  }
  cursor: pointer;
  background: ${({ theme, isSelected }) =>
    isSelected
      ? theme.palette.action.selected
      : theme.palette.background.default};
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  position: relative;
  height: calc(100% - 0.25rem);
  width: 300px;
`;

export const ButtonContainer = styled('div')`
  display: flex;
  align-items: center;
`;
