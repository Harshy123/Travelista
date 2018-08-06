// @flow

import type { OrderListItem } from '../models/OrderListItem';
import type { Request } from '../types/index';

export type AccountState = {
  updatePasswordRequest: Request,
  updateProfileRequest: Request,
  updateProfilePictureRequest: Request,
  updateCardRequest: Request,
  fetchOrdersRequest: Request,
  orders: OrderListItem[],
};
