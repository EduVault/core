import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

import { RootState, AppThunk } from '..';

export const initialState: AuthState = {
  loggedIn: false,
  privateKey: undefined,
  authType: 'default',
  jwt: undefined,
  pubKey: undefined,
  threadID: undefined,
  threadIDStr: undefined,
  jwtEncryptedPrivateKey: undefined,
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setState: (state: AuthState, action: PayloadAction<AuthState>) =>
      (state = action.payload),
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setPrivateKey: (
      state: AuthState,
      action: PayloadAction<AuthState['privateKey']>
    ) => {
      state.privateKey = action.payload;
    },
    setAuthType: (
      state: AuthState,
      action: PayloadAction<AuthState['authType']>
    ) => {
      state.authType = action.payload;
    },
    setJwt: (state: AuthState, action: PayloadAction<AuthState['jwt']>) => {
      state.jwt = action.payload;
    },
    setPubKey: (
      state: AuthState,
      action: PayloadAction<AuthState['pubKey']>
    ) => {
      state.pubKey = action.payload;
    },
    setThreadID: (
      state: AuthState,
      action: PayloadAction<AuthState['threadID']>
    ) => {
      state.threadID = action.payload;
    },
    setThreadIDStr: (
      state: AuthState,
      action: PayloadAction<AuthState['threadIDStr']>
    ) => {
      state.threadIDStr = action.payload;
    },
    setJwtEncryptedPrivateKey: (
      state: AuthState,
      action: PayloadAction<AuthState['jwtEncryptedPrivateKey']>
    ) => {
      state.jwtEncryptedPrivateKey = action.payload;
    },
  },
});

export const {
  setState,
  setLoggedIn,
  setPrivateKey,
  setAuthType,
  setJwt,
  setPubKey,
  setThreadID,
  setThreadIDStr,
  setJwtEncryptedPrivateKey,
} = AuthSlice.actions;

export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectPrivateKey = (state: RootState) => state.auth.privateKey;
export const selectAuthType = (state: RootState) => state.auth.authType;
export const selectJwt = (state: RootState) => state.auth.jwt;
export const selectPubKey = (state: RootState) => state.auth.pubKey;
export const selectThreadID = (state: RootState) => state.auth.threadID;
export const selectThreadIDStr = (state: RootState) => state.auth.threadIDStr;
export const selectJwtEncryptedPrivateKey = (state: RootState) =>
  state.auth.jwtEncryptedPrivateKey;

export const authReducer = AuthSlice.reducer;
