/* 
    General Styles used on every website (Don't Repeat Yourself)
*/
import { createGlobalStyle } from 'styled-components';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => props.theme.text};
  }
`;

export default GlobalStyle;
