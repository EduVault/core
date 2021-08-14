import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { authReducer as auth } from './auth';
import { textileReducer as textile } from './textile';
export const store = configureStore({
  reducer: {
    auth,
    textile,
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
