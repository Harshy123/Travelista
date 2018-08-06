//@flow

import { ERR_STRIPE } from './apiError';
import type { StatusError } from '../types';

type Card = {
  cardNumber: string,
  cardName: string,
  expiryMonth: number,
  expiryYear: number,
  cvv: string,
};

const stripeClient = window.Stripe;
stripeClient.setPublishableKey(process.env.HT_STRIPE_PUBLISHABLE_KEY);

export function stripeTokeniseCard(card: Card): Promise<string> {
  return new Promise((resolve: string => void, reject: StatusError => void) => {
    stripeClient.card.createToken(
      {
        number: card.cardNumber,
        name: card.cardName,
        exp_month: card.expiryMonth,
        exp_year: card.expiryYear,
        cvc: card.cvv,
      },
      (status: string, response: { error: string, id: string }) => {
        if (response.error) {
          return reject({
            error: { code: ERR_STRIPE, message: response.error },
            status: status,
          });
        }
        return resolve(response.id);
      }
    );
  });
}

export function stripValidateExpiry(month: number, year: number): boolean {
  return stripeClient.card.validateExpiry(month, year);
}

export function stripeValidateCVV(cvv: string): boolean {
  return stripeClient.card.validateCVC(cvv);
}

export function stripeValidateCardNumber(cardNumber: string): boolean {
  return stripeClient.card.validateCardNumber(cardNumber);
}

export function stripeCheckCardType(cardNumber: string): string {
  return stripeClient.card.cardType(cardNumber);
}
