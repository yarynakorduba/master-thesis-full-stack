import { Grid, Typography } from '@mui/material';
import { isNil } from 'lodash';
import React, { ReactNode } from 'react';

type TAnalysisSectionHeaderProps = {
  readonly index?: number;
  readonly children: ReactNode | ReactNode[] | string;
  readonly sx?: any;
};
const AnalysisSectionHeader = ({
  index,
  children,
  sx,
}: TAnalysisSectionHeaderProps) => {
  return (
    <Typography variant="h6" sx={{ width: '100%', ...sx }}>
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

const AnalysisSection = ({ md = 12, children }: TProps) => {
  return (
    <Grid item md={md} sx={{ paddingLeft: 3 }}>
      <Grid
        container
        alignItems="flex-start"
        justifyContent="flex-start"
        rowSpacing={1}
        columnSpacing={3}
        sx={{ mb: 1 }}
      >
        {children}
      </Grid>
    </Grid>
  );
};

AnalysisSection.Header = AnalysisSectionHeader;

export default AnalysisSection;
