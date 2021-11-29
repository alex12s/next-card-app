import { CardType } from './Card';

export enum Comparing {
  less = "less",
  more = "more",
  equal = "equal",
}

export type CardListFilter = {
  expDateFilter?: { date: string; comp: Comparing };
  type?: CardType;
  name?: string;
};

export type CardSort = "expDate" | "type"