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

  textarea {
    font-family: 'Ubuntu', sans-serif;
  }

  button {
    font-family: 'Ubuntu', sans-serif;

  }
`;

const size = {
  mobileS: '320px',
  mobileM: '375px',
  mobileL: '425px',
  tablet: '768px',
  laptop: '1024px',
  laptopL: '1440px',
  desktop: '2560px',
};

export const device = {
  mobileS: `(max-width: ${size.mobileS})`,
  mobileM: `(max-width: ${size.mobileM})`,
  mobileL: `(max-width: ${size.mobileL})`,
  tablet: `(max-width: ${size.tablet})`,
  laptop: `(max-width: ${size.laptop})`,
  laptopL: `(max-width: ${size.laptopL})`,
  desktop: `(max-width: ${size.desktop})`,
  desktopL: `(max-width: ${size.desktop})`,
};

export default GlobalStyle;
