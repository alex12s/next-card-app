import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { AppState, AppThunk } from '../../app/store'
import {counterSlice} from "../counter/counterSlice";
import {Card} from "../../types/Card";

export interface CardState {
    cards: Card[];
    card: Card;
    status: 'idle' | 'loading' | 'failed'
}

const initialState: CardState = {
    card: null,
    cards: [],
    status: 'idle',
}

export const cardSlice = createSlice({
    name: 'card',
    initialState,
    reducers: {
        test: (state) =>  {
            console.log("my reducer", state);
        }
    },
});

export default cardSlice.reducer