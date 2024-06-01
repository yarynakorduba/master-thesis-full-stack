import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import Container from '@mui/material/Container';
import ScrollToTop from './sharedComponents/scrollToTop';
import { Navbar } from './sharedComponents/Navbar/Navbar';
import Configuration from './pages/Configuration';
import { theme } from '../styles/theme';
import ConfigurationList from './pages/ConfigurationList';
import CreateConfiguration from './pages/CreateConfiguration';
import { ERoutePaths } from './types/router';
import Notifications from './sharedComponents/Notifications';
import { Box } from '@mui/material';

export const HORIZONTAL_LAYOUT_GUTTER = 2;

const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env fil`e located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || '';

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Container maxWidth={'xl'}>
            <Box
              sx={{
                paddingTop: 4,
                paddingBottom: 2,
                paddingX: HORIZONTAL_LAYOUT_GUTTER,
              }}
            >
              <Routes>
                <Route
                  element={<ConfigurationList />}
                  path={ERoutePaths.CONFIGURATIONS}
                />
                <Route
                  element={<CreateConfiguration />}
                  path={ERoutePaths.CREATE_CONFIGURATION}
                />
                <Route
                  element={<Configuration />}
                  path={`${ERoutePaths.CONFIGURATIONS}/:id`}
                />
                <Route
                  path="/"
                  element={<Navigate to={ERoutePaths.CONFIGURATIONS} />}
                />
                <Route element={<h1>Not found!</h1>} />
              </Routes>
              <Notifications />
            </Box>
          </Container>
        </ScrollToTop>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Layout;
