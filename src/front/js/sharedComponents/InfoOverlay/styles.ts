import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const OverlayTrigger = styled(Typography)`
  cursor: pointer;
  font-size: inherit;
  font-weight: inherit;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-decoration-thickness: 0.35px;
  text-underline-offset: 0.25em;

  display: inline-block;
  ${({ theme }) => `&:hover { background: ${theme.palette.grey[100]}; }`}
`;
