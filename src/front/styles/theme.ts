import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    charts: {
      chartBlue: string;
      chartFuchsia: string;
      chartPink: string;
      chartOverlaySelectedArea: string;
      chartOverlayThreshold: string;
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
      chartOverlaySelectedArea: string;
      chartOverlayThreshold: string;
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
      chartTestPrediction: '#FF8C00',
      chartRealPrediction: '#D700F5',

      chartOverlayThreshold: '#dc354536',
      chartOverlaySelectedArea: 'rgba(0, 255, 0, 0.1)',
    },
  },
});
