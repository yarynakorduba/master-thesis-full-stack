import { blue } from '@mui/material/colors';

export const selectedAreaStyle = {
  fill: '#ffc0cb36',
  background: 'pink',
  stroke: 'pink',
};

export const selectedBrushStyle = () => ({
  fill: blue[300],
  opacity: 0.12,
  stroke: blue[600], // palette.charts.chartBlue,
});
