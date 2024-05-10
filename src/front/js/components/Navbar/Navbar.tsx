import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { Button } from '@mui/material';
import { useMatch, useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const navigate = useNavigate();
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
          <Button
            onClick={() => {
              navigate('/configurations');
            }}
          >
            Configurations
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};
