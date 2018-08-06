// @flow

import type { Request } from '../types/index';
import type { Press } from '../models/Press';

export type PressState = {
  presses: Press[],
  fetchPressesRequest: Request,
};
