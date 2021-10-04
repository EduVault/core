import EduVault from '@eduvault/sdk-js/dist/main';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { URL_API, URL_WS_API } from './config';
import { setLoggedIn } from './model/auth';
import {
  setDBError,
  setLocalReady,
  setRemoteReady,
  setStartingLocal,
} from './model/db';

export const eduvault = new EduVault({
  appID: '1',
  URL_API,
  URL_WS_API,
});

export const EduVaultContext = React.createContext(eduvault);
export const EduVaultProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const load = eduvault.load;

  useEffect(() => {
    // console.log('loading eduvault');
    load({
      log: true,
      onStart: () => dispatch(setStartingLocal),
      onError: (error) => dispatch(setDBError(error)),
      onLocalReady: () => dispatch(setLocalReady(true)),
      onReady: () => dispatch(setRemoteReady(true)),
      onLogin: () => dispatch(setLoggedIn(true)),
    });
  }, [dispatch, load]);
  return (
    <EduVaultContext.Provider value={eduvault}>
      {children}
    </EduVaultContext.Provider>
  );
};
