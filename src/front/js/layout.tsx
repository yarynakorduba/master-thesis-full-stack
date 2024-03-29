import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Container from '@mui/material/Container';
import ScrollToTop from './components/scrollToTop';
import injectContext from './store/appContext';
import { Navbar } from './components/Navbar/Navbar';
import App from './pages/App';
import { theme } from '../styles/theme';
import '../styles/index';
import GlobalStyle from '../styles/index';

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env fil`e located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || '';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Container maxWidth={false} sx={{ paddingTop: 2, paddingBottom: 2 }}>
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

export default injectContext(Layout);
