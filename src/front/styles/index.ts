/* 
    General Styles used on every website (Don't Repeat Yourself)
*/
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${(props) => props.theme.text};
  }
`;

export default GlobalStyle;
