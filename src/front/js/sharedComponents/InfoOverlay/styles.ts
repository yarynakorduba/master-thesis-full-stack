import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OverlayTrigger = styled(Typography)`
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 0.5px;
  text-underline-offset: 0.25em;

  color: ${({ theme }) => theme.palette.info.dark};
  display: inline-block;
  &:hover {
    background: ${({ theme }) => theme.palette.grey[100]};
  }
`;
