// @flow

import type { CreditCard } from './CreditCard';

export type PaymentInfo = {
  card: CreditCard,
  saveCard: boolean,
};
