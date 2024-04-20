import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardDate = styled(Typography)`
  font-size: 12px;
  flex-shrink: 0;
  text-align: right;
  line-height: 1.2;
  flex-basis: 40%;
`;

export const CardHeader = styled(Stack)`
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
`;
