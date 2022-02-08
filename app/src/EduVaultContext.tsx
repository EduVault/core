import EduVault from '@eduvault/sdk-js';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { URL_API, URL_WS_API } from './config';
import { setLoggedIn } from './model/auth';
import {
  setClientReady,
  setDBError,
  setLocalReady,
  setRemoteReady,
  setStartingLocal,
} from './model/db';

export const eduvault = new EduVault({
  log: true,
  appID: '1',
  URL_API,
  URL_WS_API,
});

export const EduVaultContext = React.createContext(eduvault);
export const EduVaultProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    eduvault.load({
      log: true,
      onStart: () => dispatch(setStartingLocal),
      onError: (error) => dispatch(setDBError(error)),
      onLocalReady: () => dispatch(setLocalReady(true)),
      onRemoteReady: () => dispatch(setRemoteReady(true)),
      onClientReady: () => dispatch(setClientReady(true)),
      onLogin: () => dispatch(setLoggedIn(true)),
    });
  }, [dispatch]);

  return (
    <EduVaultContext.Provider value={eduvault}>
      {children}
    </EduVaultContext.Provider>
  );
};
