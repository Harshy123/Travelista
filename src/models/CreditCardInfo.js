// @flow

export type CreditCardInfo = {
  cardName: string,
  cardBrand: string,
  lastFour: string,
  expiryMonth: number,
  expiryYear: number,
  stripeToken: string,
};
