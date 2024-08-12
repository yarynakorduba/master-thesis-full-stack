import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Link, useMatch } from 'react-router-dom';

import { ERoutePaths } from '../../types/router';
import { HORIZONTAL_LAYOUT_GUTTER } from '../../layout';
import { useAreSimplifiedUIDescriptionsShown } from '../../store/settings/selectors';
import InfoOverlay from '../InfoOverlay';

export const Navbar = () => {
  const configPageMatch = useMatch('configurations/:id');
  const isConfigPage = !!configPageMatch;

  const [
    areSimplifiedUIDescriptionsShown,
    setAreSimplifiedUIDescriptionsShown,
  ] = useAreSimplifiedUIDescriptionsShown();

  const handleSelectDescriptionType = (e, newIsSimplified) => {
    if (newIsSimplified !== null) {
      setAreSimplifiedUIDescriptionsShown(newIsSimplified);
    }
  };
  return (
    <AppBar position="static" color="default">
      <Toolbar variant="dense" sx={{ marginX: HORIZONTAL_LAYOUT_GUTTER }}>
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
            <Divider
              sx={{ margin: 1 }}
              orientation="vertical"
              variant="middle"
              component="div"
              flexItem
            />
            <InfoOverlay label="Explanatory texts:" id="explanatory-texts">
              <InfoOverlay.Popover>
                Click on the underlined texts to see the explanations.
              </InfoOverlay.Popover>
            </InfoOverlay>

            <ToggleButtonGroup
              value={areSimplifiedUIDescriptionsShown}
              exclusive
              onChange={handleSelectDescriptionType}
              aria-label="text alignment"
              size="small"
              sx={{ marginLeft: 1 }}
            >
              <ToggleButton
                value={false}
                aria-label="left aligned"
                sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
              >
                Advanced
              </ToggleButton>
              <ToggleButton
                value={true}
                aria-label="left aligned"
                sx={{ paddingTop: 0.5, paddingBottom: 0.5 }}
              >
                Beginner-friendly
              </ToggleButton>
            </ToggleButtonGroup>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};
