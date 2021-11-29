import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppState, AppThunk } from '../../app/store';
import { Card } from '../../types/Card';
import { v4 as uuidv4 } from 'uuid';
import { CardListFilter, CardSort, Comparing } from '../../types/Filter';
import { expDateStringToDate } from '../../app/utils';

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
      state.list.push({ ...action.payload, id: uuidv4() });
    },
    deleteCard: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((c) => c.id !== action.payload);
    }
  },
});

const { pushCard, deleteCard } = cardSlice.actions;

export const getCards = (filter: CardListFilter, sort: CardSort) => (state: AppState) => {
  const { expDateFilter, type, name } = filter;
  const conditions: Array<(card: Card) => boolean> = [];

  if (!!expDateFilter) {
    conditions.push((card: Card) => {
      const expDate = expDateStringToDate(expDateFilter.date);
      const cardExpDate = expDateStringToDate(card.expDate);
      if (expDateFilter.comp === Comparing.equal) {
        return card.expDate === expDateFilter.date;
      }

      if (expDateFilter.comp === Comparing.less) {
        return cardExpDate < expDate;
      }

      if (expDateFilter.comp === Comparing.more) {
        return cardExpDate > expDate;
      }
    });
  }
  if (!!type) {
    conditions.push((card: Card) => card.type === type);
  }
  if (!!name) {
    conditions.push((card: Card) => card.name && card.name.includes(name));
  }

  const filtered = conditions.length
    ? state.card.list.filter((c) => conditions.every((f) => f(c)))
    : [...state.card.list];
  if (!sort) {
    return filtered;
  }

  const sortByDate = (card1: Card, card2: Card) => {
    if (expDateStringToDate(card1.expDate) > expDateStringToDate(card2.expDate)) {
      return 1;
    } else if (expDateStringToDate(card1.expDate) < expDateStringToDate(card2.expDate)) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortByType = (card1, card2) => (card1.type || '').localeCompare(card2.type);

  return filtered.sort(sort === 'expDate' ? sortByDate : sort === 'type' ? sortByType : undefined);
};

export const getCardByNumber = (state: AppState, number: string) => state.card.list.find((c) => c.number === number);
export const getCardById = (id: string) => (state: AppState) => state.card.list.find((c) => c.id === id);

export const addCard =
  (card: Card): AppThunk =>
  (dispatch, getState) => {
    const isUniq = !getCardByNumber(getState(), card.number);
    if (isUniq) {
      dispatch(pushCard(card));
    } else {
      throw new Error('Card number must be unique');
    }
  };

export default cardSlice.reducer;

export {deleteCard}
