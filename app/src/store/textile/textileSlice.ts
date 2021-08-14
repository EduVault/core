import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TextileState } from './types';

import { RootState, AppThunk } from '..';

export const initialState: TextileState = {
  syncing: false,
};

const AuthSlice = createSlice({
  name: 'textile',
  initialState,
  reducers: {
    setState: (state: TextileState, action: PayloadAction<TextileState>) =>
      (state = action.payload),
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
  },
});

export const { setState, setSyncing } = AuthSlice.actions;

export const selectSyncing = (state: RootState) => state.textile.syncing;

export const textileReducer = AuthSlice.reducer;
