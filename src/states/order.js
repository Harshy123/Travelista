// @flow

import type { Request } from '../types';
import type { Order } from '../models/Order';

export type OrderState = {
  makeOrderRequest: Request,
  fetchOrderRequest: Request,
  order: ?Order,
};
