import React from 'react';
import { ThreeDot } from 'react-loading-indicators';
import { useTheme } from 'styled-components';

const Loader = () => {
  const theme = useTheme();

  return <ThreeDot color={theme.accent} style={{ display: 'flex', alignItems: 'center' }} />;
};

export default Loader;
