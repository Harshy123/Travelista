// @flow

import type Moment from 'moment';

import type { SimpleHotel } from './Hotel';

export type OrderListItem = {
  id: string,
  refNumber: string,
  from: Moment,
  to: Moment,
  image: string,
  offerId: string,
  hotel: SimpleHotel,
};
