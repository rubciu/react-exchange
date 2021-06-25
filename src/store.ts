import { configureStore } from '@reduxjs/toolkit';
import exchangeSlice from './features/exchange/exchangeSlice';

export const store = configureStore({
  reducer: {
    exchange: exchangeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
