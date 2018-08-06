// @flow

import type { Request } from '../types/index';
import type { PromoCode } from '../models/PromoCode';

export type PromoCodeState = {
  code: ?PromoCode,
  fetchPromoCodeRequest: Request,
};
