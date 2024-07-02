import { Typography } from '@mui/material';
import React, { ReactNode } from 'react';

type TCiteProps = {
  readonly index: number;
};
const Cite = ({ index }: TCiteProps) => (
  <Typography component="span" fontSize="inherit">
    [{index}]
  </Typography>
);

type TCiteSource = {
  readonly index: number;
  readonly children: string | ReactNode | ReactNode[];
};
const CiteSource = ({ index, children }: TCiteSource) => (
  <Typography variant="body2" fontSize={12}>
    <Cite index={index} /> {children}
  </Typography>
);

Cite.Source = CiteSource;

export default Cite;
