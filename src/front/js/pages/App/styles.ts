import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

const SIDEBAR_WIDTH_SMALL_SCREEN = '400px';
const SIDEBAR_WIDTH_BIG_SCREEN = '20vw';

export const Sidebar = styled('div')`
  grid-column: 1;
  grid-row: 1;
  border-right: 1px solid ${({ theme }) => theme.palette.grey[800]};
  padding: 0.75rem;
  height: 100vh;
`;

export const Content = styled('div')<{ readonly isOpen: boolean }>`
  position: relative;
  grid-column: 2;
  grid-row: 1;

  @media (width >= 1124px) {
    ${({ isOpen }) =>
      isOpen && `width: calc(100% - ${SIDEBAR_WIDTH_SMALL_SCREEN});`}
  }
  @media (width >= 1700px) {
    ${({ isOpen }) =>
      isOpen && `width: calc(100% - ${SIDEBAR_WIDTH_SMALL_SCREEN} + 80px);`}
  }
  @media (width >= 2000px) {
    ${({ isOpen }) =>
      isOpen && `width: calc(100% - ${SIDEBAR_WIDTH_BIG_SCREEN} + 148px);`}
  }
  @media (width >= 2304px) {
    ${({ isOpen }) => isOpen && `width: 100%;`}
  }
`;

export const HistoryDrawer = styled(MuiDrawer)`
  ${({ open }) =>
    open &&
    `
    & .MuiDrawer-paper {
      height: 100vh;
      width: ${SIDEBAR_WIDTH_SMALL_SCREEN};
    }

    @media (width >= 2000px) {
      & .MuiDrawer-paper {
        width: ${SIDEBAR_WIDTH_BIG_SCREEN};
      }
    }
`}
`;
