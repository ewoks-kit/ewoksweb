import 'normalize.css';
import './styles/index.css';

import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import App from './App';

const theme = createTheme();

ReactDOM.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>,
  document.querySelector('#root'),
);
