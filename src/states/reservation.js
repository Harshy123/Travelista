// @flow

import type { Request } from '../types/index';
import type { Reservation } from '../models/Reservation';

export type ReservationState = {
  makeReservationRequest: Request,
  fetchReservationRequest: Request,
  reservation: ?Reservation,
};
