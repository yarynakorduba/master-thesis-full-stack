import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { Link, useMatch } from 'react-router-dom';

import { ERoutePaths } from '../../types/router';

export const Navbar = () => {
  const configPageMatch = useMatch('configurations/:id');
  const isConfigPage = !!configPageMatch;
  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense">
        <Typography
          variant="h6"
          sx={{ marginRight: 2, height: 34, alignSelf: 'center' }}
        >
          Time Insights
        </Typography>
        {isConfigPage && (
          <>
            <Button component={Link} to={ERoutePaths.CONFIGURATIONS}>
              Datasets
            </Button>
            <Button
              component={Link}
              to={ERoutePaths.CREATE_CONFIGURATION}
              startIcon={<AddIcon />}
              sx={{ ml: 2 }}
            >
              Add new dataset
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
