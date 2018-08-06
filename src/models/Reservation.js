// @flow
import type Moment from 'moment';
import type { Package } from './Package';
import type { Capacity } from './Capacity';

export type Reservation = {
  id: string,
  package: Package,
  from: Moment,
  to: Moment,
  expiredAt: Moment,
  price: number,
  currency: string,
  capacity: Capacity,
  promoCode: ?string,
  partnerCode: ?string,
};
