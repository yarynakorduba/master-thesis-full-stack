import { Button } from '../../../pages/App/DatasetForm/styles';
import styled from 'styled-components';

export const ChartWrapper = styled.div`
  position: relative;
`;

export const ClearSelectionButton = styled(Button)`
  height: 1.5rem;
  line-height: 1.5rem;
  z-index: 1;
  padding-top: 0;
  padding-bottom: 0;
  margin-left: 0.5rem;
`;

export const ChartHeading = styled.h4`
  font-size: 0.875rem;
  padding: 0;
  margin: 0 0 -1rem 0;
  height: 1rem;
  display: flex;
  align-items: center;
`;

export const SparkLineChartHeading = styled.h5`
  font-size: 0.75rem;
  padding: 0;
  margin: 0 0 -1rem 0;
  height: 16px;
`;
