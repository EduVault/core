import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DBState } from './types';
import { RootState } from '../';

export const initialState: DBState = {
  startingLocal: false,
  localReady: false,
  remoteReady: false,
  error: '',
  syncing: false,
  clientReady: false,
};

const DBSlice = createSlice({
  name: 'db',
  initialState,
  reducers: {
    setState: (state: DBState, action: PayloadAction<DBState>) =>
      (state = action.payload),

    setStartingLocal: (state, action: PayloadAction<boolean>) => {
      state.startingLocal = action.payload;
    },
    setLocalReady: (state, action: PayloadAction<boolean>) => {
      state.localReady = action.payload;
    },
    setRemoteReady: (state, action: PayloadAction<boolean>) => {
      console.log('setRemoteReady', action.payload);
      state.remoteReady = action.payload;
    },
    setClientReady: (state, action: PayloadAction<boolean>) => {
      state.clientReady = action.payload;
    },
    setDBError: (state, action) => {
      state.error = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
  },
});

export const {
  setState,
  setDBError,
  setStartingLocal,
  setLocalReady,
  setRemoteReady,
  setClientReady,
  setSyncing,
} = DBSlice.actions;

export const selectStartingLocal = (state: RootState) => state.db.startingLocal;
export const selectLocalReady = (state: RootState) => state.db.localReady;
export const selectRemoteReady = (state: RootState) => state.db.remoteReady;
export const selectClientReady = (state: RootState) => state.db.clientReady;
export const selectDBError = (state: RootState) => state.db.error;
export const selectDBState = (state: RootState) => state.db;
export const selectSyncing = (state: RootState) => state.db.syncing;

export const dbReducer = DBSlice.reducer;
