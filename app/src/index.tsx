import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import theme from './theme';
import { ThemeProvider, CssBaseline } from '@material-ui/core';
import { startWorker } from '@eduvault/eduvault-js';

// use eduvault-js's mock service worker
if (process.env.NODE_ENV === 'development') startWorker();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
