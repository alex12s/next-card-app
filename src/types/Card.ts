export type Card = {
  number: string;
  holder: string;
  cvv: number;
  expDate: string;
  name?: string;
  type: CardType
};

export enum CardType {
  visa = 'visa',
  mastercard = 'mastercard',
}