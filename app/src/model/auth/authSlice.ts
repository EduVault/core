import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types';
import { URL_API } from '../../config';
import Eduvault from '@eduvault/sdk-js/dist/main';
import { RootState, AppThunk } from '..';

export const initialState: AuthState = {
  loggedIn: false,
  loggingIn: false,
  error: '',
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
    setLoggingIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setLoginError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setState, setLoggedIn, setLoggingIn, setLoginError } =
  AuthSlice.actions;

export const selectLoggedIn = (state: RootState) => state.auth.loggedIn;
export const selectLoggingIn = (state: RootState) => state.auth.loggingIn;
export const selectLoginError = (state: RootState) => state.auth.error;

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
      dispatch(setLoggingIn(true));
      const eduvault = new Eduvault({ appID: '1', URL_API, log: true });
      const loginRes = await eduvault.pwLogin(payload);
      // console.log({ loginRes });
      if (loginRes && 'error' in loginRes) throw loginRes.error;
      if (!loginRes || !loginRes.jwt) throw loginRes;
      // login successful, will be redirected by SDK.
    } catch (error) {
      dispatch(setLoginError(error));
      dispatch(setLoggedIn(false));
    } finally {
      dispatch(setLoggingIn(false));
    }
  };
