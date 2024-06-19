import { Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type TProps = {
  readonly index?: number;
  readonly children: ReactNode | ReactNode[] | string;
};
const AnalysisSectionHeader = ({ index, children }: TProps) => {
  return (
    <Typography variant="h6">
      {index ? `${index}. ` : ''}
      {children}
    </Typography>
  );
};

export default AnalysisSectionHeader;
