import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    charts: {
      chartBlue: string;
      chartFuchsia: string;
      chartPink: string;
    };
  }
  interface PaletteOptions {
    charts: {
      chartBlue: string;
      chartFuchsia: string;
      chartPink: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    charts: {
      chartBlue: '#3948A4',
      chartFuchsia: '#FF00FF',
      chartPink: '#FF69B4'
    }
  }
});
