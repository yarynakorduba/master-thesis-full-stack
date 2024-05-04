import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@emotion/react';
import Container from '@mui/material/Container';
import ScrollToTop from './components/scrollToTop';
import { Navbar } from './components/Navbar/Navbar';
import App from './pages/App';
import { theme } from '../styles/theme';

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env fil`e located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || '';

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Container sx={{ paddingTop: 2, paddingBottom: 2 }} maxWidth={'xl'}>
            <Routes>
              <Route element={<App />} path="/" />
              <Route element={<h1>Not found!</h1>} />
            </Routes>
          </Container>
        </ScrollToTop>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default Layout;
