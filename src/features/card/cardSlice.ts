import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState, AppThunk } from '../../app/store';
import { counterSlice } from '../counter/counterSlice';
import { Card } from '../../types/Card';

export interface CardState {
  list: Card[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: CardState = {
  list: [],
  status: 'idle',
  error: null,
};

export const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    pushCard: (state, action: PayloadAction<Card>) => {
      console.log('my reducer add card', action.payload);
      state.list.push(action.payload);
    },
  },
});

const { pushCard } = cardSlice.actions;

export const getCards = (state: AppState) => state.card.list;
export const getCardByNumber = (state: AppState, number: string) => state.card.list.find((c) => c.number === number);

export const addCard =
  (card: Card): AppThunk =>
  (dispatch, getState) => {
    const isUniq = !getCardByNumber(getState(), card.number);
    if (isUniq) {
      dispatch(pushCard(card));
    } else {
      throw new Error("Card number must be unique");
    }
  };



export default cardSlice.reducer;
