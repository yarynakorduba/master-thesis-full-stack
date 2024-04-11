import React from 'react';
import { ThreeDot } from 'react-loading-indicators';
import { useTheme } from '@mui/material/styles';

const Loader = () => {
  const theme = useTheme();

  return (
    <ThreeDot
      color={theme.palette.primary.light}
      style={{ display: 'flex', alignItems: 'center' }}
    />
  );
};

export default Loader;
