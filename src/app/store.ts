import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import cardReducer from '../features/card/cardSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      card: cardReducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>;

export default store;
