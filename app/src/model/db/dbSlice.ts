import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DBState } from './types';
import { RootState } from '../';

export const initialState: DBState = {
  startingLocal: false,
  localReady: false,
  remoteReady: false,
  error: '',
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
      state.remoteReady = action.payload;
    },
    setDBError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setState,
  setDBError,
  setStartingLocal,
  setLocalReady,
  setRemoteReady,
} = DBSlice.actions;

export const selectStartingLocal = (state: RootState) => state.db.startingLocal;
export const selectLocalReady = (state: RootState) => state.db.localReady;
export const selectRemoteReady = (state: RootState) => state.db.remoteReady;
export const selectDBError = (state: RootState) => state.db.error;
export const selectDBState = (state: RootState) => state.db;

export const dbReducer = DBSlice.reducer;
