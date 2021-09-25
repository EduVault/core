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
  process.env.REACT_APP_SUPPRESS_MSW !== 'true'
)
  startWorker();

export const WrapProviders: React.FC = (props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </Provider>
  );
};

if (process.env.NODE_ENV !== 'test')
  ReactDOM.render(
    <React.StrictMode>
      <WrapProviders>
        <App />
      </WrapProviders>
    </React.StrictMode>,
    document.getElementById('root')
  );
