import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authReducer as auth } from './auth';
import Eduvault from '@eduvault/eduvault-js';
export const eduvault = new Eduvault({ suppressInit: true });

export const store = configureStore({
  reducer: {
    auth,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
