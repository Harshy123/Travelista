// @flow

import type { Request } from '../types/index';
import type { Advertisement } from '../models/Advertisement';

export type AdvertisementState = {
  [string]: {
    advertisements: Advertisement[],
    fetchAdvertisementsRequest: Request,
  },
};
