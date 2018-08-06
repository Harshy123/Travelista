// @flow
import apiClient from '../api';
import {
  ERR_INVALID_RESERVATION,
  ERR_RESERVATION_EXPIRED,
} from '../utils/apiError';

import type Moment from 'moment';
import type { ApiError, ReservationResponse } from '../types';
import type { Dispatch } from '../types/Dispatch';
import type { Reservation } from '../models/Reservation';
import type { Capacity } from '../models/Capacity';

export const RESERVATION_MAKE_RESERVATION_REQUESTING: 'RESERVATION_MAKE_RESERVATION_REQUESTING' = `RESERVATION_MAKE_RESERVATION_REQUESTING`;
export const RESERVATION_MAKE_RESERVATION_SUCCESS: 'RESERVATION_MAKE_RESERVATION_SUCCESS' = `RESERVATION_MAKE_RESERVATION_SUCCESS`;
export const RESERVATION_MAKE_RESERVATION_FAILURE: 'RESERVATION_MAKE_RESERVATION_FAILURE' = `RESERVATION_MAKE_RESERVATION_FAILURE`;

export const RESERVATION_FETCH_RESERVATION_REQUESTING: 'RESERVATION_FETCH_RESERVATION_REQUESTING' = `RESERVATION_FETCH_RESERVATION_REQUESTING`;
export const RESERVATION_FETCH_RESERVATION_SUCCESS: 'RESERVATION_FETCH_RESERVATION_SUCCESS' = `RESERVATION_FETCH_RESERVATION_SUCCESS`;
export const RESERVATION_FETCH_RESERVATION_FAILURE: 'RESERVATION_FETCH_RESERVATION_FAILURE' = `RESERVATION_FETCH_RESERVATION_FAILURE`;
export const RESERVATION_FLUSH_RESERVATION: 'RESERVATION_FLUSH_RESERVATION' = `RESERVATION_FLUSH_RESERVATION`;

type ReservationMakeReservationRequesting = {|
  type: typeof RESERVATION_MAKE_RESERVATION_REQUESTING,
|};
type ReservationMakeReservationSuccess = {|
  type: typeof RESERVATION_MAKE_RESERVATION_SUCCESS,
  payload: {|
    reservation: Reservation,
  |},
|};
type ReservationMakeReservationFailure = {|
  type: typeof RESERVATION_MAKE_RESERVATION_FAILURE,
  payload: {
    reason: string,
  },
|};

type ReservationFetchReservationRequesting = {|
  type: typeof RESERVATION_FETCH_RESERVATION_REQUESTING,
|};
type ReservationFetchReservationSuccess = {|
  type: typeof RESERVATION_FETCH_RESERVATION_SUCCESS,
  payload: {|
    reservation: Reservation,
  |},
|};
type ReservationFetchReservationFailure = {|
  type: typeof RESERVATION_FETCH_RESERVATION_FAILURE,
  payload: {
    reason: string,
  },
|};
type ReservationFlushReservation = {|
  type: typeof RESERVATION_FLUSH_RESERVATION,
|};

export type ReservationAction =
  | ReservationMakeReservationRequesting
  | ReservationMakeReservationSuccess
  | ReservationMakeReservationFailure
  | ReservationFetchReservationRequesting
  | ReservationFetchReservationSuccess
  | ReservationFetchReservationFailure
  | ReservationFlushReservation;

function makeReservationRequestingAction(): ReservationMakeReservationRequesting {
  return {
    type: RESERVATION_MAKE_RESERVATION_REQUESTING,
  };
}

function makeReservationSuccessAction(
  reservation: Reservation
): ReservationMakeReservationSuccess {
  return {
    type: RESERVATION_MAKE_RESERVATION_SUCCESS,
    payload: {
      reservation,
    },
  };
}

function makeReservationFailureAction(
  reason: string
): ReservationMakeReservationFailure {
  return {
    type: RESERVATION_MAKE_RESERVATION_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchReservationRequestingAction(): ReservationFetchReservationRequesting {
  return {
    type: RESERVATION_FETCH_RESERVATION_REQUESTING,
  };
}

function fetchReservationSuccessAction(
  reservation: Reservation
): ReservationFetchReservationSuccess {
  return {
    type: RESERVATION_FETCH_RESERVATION_SUCCESS,
    payload: {
      reservation,
    },
  };
}

function fetchReservationFailureAction(
  reason: string
): ReservationFetchReservationFailure {
  return {
    type: RESERVATION_FETCH_RESERVATION_FAILURE,
    payload: {
      reason,
    },
  };
}

export function flushReservationAction(): ReservationFlushReservation {
  return {
    type: RESERVATION_FLUSH_RESERVATION,
  };
}

export function makeReservation(
  packageId: string,
  from: Moment,
  to: Moment,
  capacity: Capacity,
  promoCode?: string
): Dispatch => Promise<Reservation> {
  return (dispatch: Dispatch) => {
    dispatch(makeReservationRequestingAction());
    return apiClient
      .makeReservation(packageId, from, to, capacity, promoCode)
      .then((response: ReservationResponse) => {
        const reservation = response.reservation;
        dispatch(makeReservationSuccessAction(reservation));
        return Promise.resolve(reservation);
      })
      .catch((error: ApiError) => {
        dispatch(makeReservationFailureAction(error.message));
        return Promise.reject(error);
      });
  };
}

export function fetchReservation(
  reservationId: string
): Dispatch => Promise<Reservation> {
  return (dispatch: Dispatch) => {
    dispatch(fetchReservationRequestingAction());
    return apiClient
      .fetchReservation(reservationId)
      .then((response: ReservationResponse) => {
        const reservation = response.reservation;
        dispatch(fetchReservationSuccessAction(reservation));
        return Promise.resolve(reservation);
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_INVALID_RESERVATION:
            errorKey = 'reservation.fetch_reservation.invalid_reservation';
            break;
          case ERR_RESERVATION_EXPIRED:
            errorKey = 'reservation.fetch_reservation.expired';
            break;
          default:
            errorKey = 'unexpected_error';
        }
        dispatch(fetchReservationFailureAction(errorKey));
        return Promise.reject(error);
      });
  };
}
