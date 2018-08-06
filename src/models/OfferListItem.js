// @flow
import type Moment from 'moment';

import type { SimpleHotel } from './Hotel';

export type OfferListItem = {
  id: string,
  bookingStartAt: Moment,
  bookingEndAt: Moment,
  stayingStartAt: Moment,
  stayingEndAt: Moment,
  price: number,
  nightCount: number,
  hotel: SimpleHotel,
};
