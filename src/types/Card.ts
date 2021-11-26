export type Card = {
  number: string;
  holder: string;
  cvv: number;
  expDate: Date;
  name?: string;
  type: CardType
};

export enum CardType {
  visa = 'visa',
  mastercard = 'mastercard',
}