import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    charts: {
      chartBlue: string;
      chartFuchsia: string;
      chartPink: string;
      chartOverlayPink: string;
      chartRealData: string;
      chartTestPrediction: string;
      chartRealPrediction: string;
    };
  }
  interface PaletteOptions {
    charts: {
      chartBlue: string;
      chartFuchsia: string;
      chartPink: string;
      chartOverlayPink: string;
      chartRealData: string;
      chartTestPrediction: string;
      chartRealPrediction: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    charts: {
      chartBlue: '#3948A4',
      chartFuchsia: '#FF00FF',
      chartPink: '#FF69B4',
      chartRealData: '#3448C2',
      chartTestPrediction: '#FFB000',
      chartRealPrediction: '#D700F5',

      chartOverlayPink: '#ffc0cb36',
    },
  },
});
