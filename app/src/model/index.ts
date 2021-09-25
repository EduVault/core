import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useDispatchRaw,
  useSelector as useSelectorRaw,
} from 'react-redux';
import { authReducer as auth } from './auth';

export const store = configureStore({
  reducer: {
    auth,
  },
});

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useDispatchRaw<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRaw;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
