// @flow

import type { Hotel } from './Hotel';
import type Moment from 'moment';
import type { Package } from './Package';
import type { Rates } from './Rates';

export type Offer = {
  id: string,
  hotel: Hotel,
  price: number,
  bookingStartAt: Moment,
  bookingEndAt: Moment,
  stayingStartAt: Moment,
  stayingEndAt: Moment,
  // roomTypeId is key
  // this should provide meta info for
  // such room type with association with
  // this offer
  roomTypeInfo: {
    [string]: {
      // sorted by its nights of stay
      packages: Package[],
      rates: Rates,
    },
  },
};

export function generateOfferLink(hotelSlug: string, offerId: string): string {
  const prefix = process.env.HT_FRONTEND_ENDPOINT;

  if (!prefix) {
    throw new Error(`HT_FRONTEND_ENDPOINT is null`);
  }

  return `${prefix}/hotel/${hotelSlug}/offer/${offerId}`;
}
