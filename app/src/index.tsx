import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@material-ui/core';

import './index.css';
import App from './App';

import theme from './theme';
import { startWorker } from '@eduvault/sdk-js/dist/main';
import { store } from './model';
// use eduvault-js's mock service worker
if (
  process.env.NODE_ENV === 'development' &&
  process.env.SUPPRESS_MSW !== 'true'
)
  startWorker();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
