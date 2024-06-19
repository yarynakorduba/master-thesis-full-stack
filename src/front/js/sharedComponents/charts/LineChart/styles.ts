import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ChartWrapper = styled('div')`
  position: relative;
  width: 100%;
`;

export const SparkLineChartHeading = styled(Typography)`
  font-size: 0.75rem;
  padding: 0;
  margin: 0 0 -1rem 0;
  height: 16px;
`;

export const HeadingMark = styled(Typography)`
  color: ${({ theme }) => theme.palette.charts.chartRealPrediction};
  font-size: 12px;
  margin-left: 8px;
  line-height: 1.334;
`;
