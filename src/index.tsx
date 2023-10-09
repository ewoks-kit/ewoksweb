import 'normalize.css';
import './styles/index.css';

import { createMuiTheme, ThemeProvider } from '@mui/material';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const theme = createMuiTheme();

ReactDOM.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.querySelector('#root'),
);
