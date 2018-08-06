// @flow

import moment from 'moment';
import orderListItemSchema from '../schemas/orderListItem';
import type { OrderListItem } from '../models/OrderListItem';

export function deserializeOrderListItem(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<OrderListItem> {
  // eslint-disable-next-line flowtype/no-weak-types
  return orderListItemSchema.validate(response).then((val: any) => {
    return {
      id: val.id,
      refNumber: val.ref_number,
      from: moment(val.staying_start_at),
      to: moment(val.staying_end_at),
      hotel: val.hotel,
      offerId: val.offer_id,
      image: val.image,
    };
  });
}
