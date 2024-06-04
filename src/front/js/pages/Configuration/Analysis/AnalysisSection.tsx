import { Grid, Typography } from '@mui/material';
import { isNil } from 'lodash';
import React, { ReactNode } from 'react';

type TAnalysisSectionHeaderProps = {
  readonly index?: number;
  readonly children: ReactNode | ReactNode[] | string;
};
const AnalysisSectionHeader = ({
  index,
  children,
}: TAnalysisSectionHeaderProps) => {
  return (
    <Typography variant="h6" sx={{ ml: !isNil(index) ? -3 : 0 }}>
      {index ? `${index}. ` : ''}
      {children}
    </Typography>
  );
};

type TProps = {
  readonly md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  readonly children: ReactNode | ReactNode[];
  readonly container?: boolean;
  readonly flexDirection?: 'row' | 'column';
};

const AnalysisSection = ({
  md = 12,
  children,
  container,
  flexDirection = 'column',
}: TProps) => {
  return (
    <Grid
      item
      md={md}
      container={container}
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDirection={flexDirection}
      display="flex"
      spacing={1}
      gap={1}
      sx={{ mb: 1, pl: 3 }}
    >
      {children}
    </Grid>
  );
};

AnalysisSection.Header = AnalysisSectionHeader;

export default AnalysisSection;
