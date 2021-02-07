import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  
  body {
    --primary: #D34444;
    --secondary: #FFFFFF;
    --primary-dark: #181818;

    font-family: 'Ubuntu', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--primary-dark);


    margin: 0;
    padding: 0;
  }
`;

export default GlobalStyle;
