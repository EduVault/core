import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import theme from './theme';
import { ThemeProvider, CssBaseline } from '@material-ui/core';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />{' '}
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
