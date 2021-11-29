export type Card = {
  id: string;
  number: string;
  holder: string;
  cvv: number;
  expDate: string;
  name?: string;
  type: CardType
};

export enum CardType {
  visa = 'Visa',
  mastercard = 'Mastercard',
}