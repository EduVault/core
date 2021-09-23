import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authReducer as auth } from './auth';
import Eduvault from '@eduvault/sdk-js/dist/main';
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
