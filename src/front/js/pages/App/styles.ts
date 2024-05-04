import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

export const Sidebar = styled('div')`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid ${({ theme }) => theme.palette.grey[800]};
  padding: 0.75rem;
  height: 100vh;
`;

export const Content = styled('div')<{ readonly isOpen: boolean }>`
  grid-column: 2;
  grid-row: 1;
  ${({ isOpen }) =>
    isOpen &&
    `
   width: calc(100% - 20vw);
  `}
  @media (width >= 1700px) {
    ${({ isOpen }) => isOpen && `width: calc(100% - 20vw + 80px);`}
  }
  @media (width >= 2000px) {
    ${({ isOpen }) => isOpen && `width: calc(100% - 20vw + 148px);`}
  }
  @media (width >= 2304px) {
    ${({ isOpen }) => isOpen && `width: 100%;`}
  }
`;

export const HistoryDrawer = styled(MuiDrawer)`
  width: 20vw;
  height: 100vh;

  & .MuiDrawer-paper {
    width: 20vw;
  }
`;
