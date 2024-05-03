import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

export const AppPage = styled('div')`
  width: calc(100% - 0.5rem);
  min-height: calc(100vh - 0.5rem);
`;

export const Sidebar = styled('div')`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid ${({ theme }) => theme.palette.grey[800]};
  padding: 0.75rem;
`;

export const Content = styled('div')`
  grid-column: 2;
  grid-row: 1;
`;

export const HistoryDrawer = styled(MuiDrawer)`
  width: 20vw;

  & .MuiDrawer-paper {
    width: 20vw;
  }
`;
