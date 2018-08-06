// @flow
import type Moment from 'moment';

export type PromoCode = {
  id: string,
  code: string,
  discount: number,
  discountType: 'dollar' | 'precent',
  validStartAt: Moment,
  validEndAt: Moment,
};
