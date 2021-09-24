import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';

import { RootState, AppThunk, eduvault } from '..';

export const initialState: AuthState = {
  loggedIn: false,
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
  },
});
export const { setState, setLoggedIn } = AuthSlice.actions;

export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;

export const authReducer = AuthSlice.reducer;

// Thunks
export const pwLogin =
  (payload: {
    username: string;
    password: string;
    redirectURL: string;
  }): AppThunk =>
  async (dispatch) => {
    try {
      const loginRes = await eduvault.pwLogin(payload);
      console.log({ loginRes });
      if (loginRes && loginRes.jwt) dispatch(setLoggedIn(true));
      else dispatch(setLoggedIn(false));
    } catch (error) {
      dispatch(setLoggedIn(false));
    }
  };
