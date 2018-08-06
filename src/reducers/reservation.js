// @flow

import type { Action } from '../actions';
import type { ReservationState } from '../states/reservation';

import {
  RESERVATION_MAKE_RESERVATION_REQUESTING,
  RESERVATION_MAKE_RESERVATION_SUCCESS,
  RESERVATION_MAKE_RESERVATION_FAILURE,
  RESERVATION_FETCH_RESERVATION_REQUESTING,
  RESERVATION_FETCH_RESERVATION_SUCCESS,
  RESERVATION_FETCH_RESERVATION_FAILURE,
  RESERVATION_FLUSH_RESERVATION,
} from '../actions/reservation';
import { ORDER_MAKE_SUCCESS } from '../actions/order';

const initialState = {
  makeReservationRequest: {
    requesting: false,
    error: null,
  },
  fetchReservationRequest: {
    requesting: false,
    error: null,
  },
  reservation: null,
};

export default function(
  state: ReservationState = initialState,
  action: Action
): ReservationState {
  switch (action.type) {
    case RESERVATION_MAKE_RESERVATION_REQUESTING: {
      return {
        ...state,
        reservation: null,
        makeReservationRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case RESERVATION_MAKE_RESERVATION_SUCCESS: {
      const { payload: { reservation } } = action;
      return {
        ...state,
        reservation,
        makeReservationRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case RESERVATION_MAKE_RESERVATION_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        reservation: null,
        makeReservationRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case RESERVATION_FETCH_RESERVATION_REQUESTING: {
      return {
        ...state,
        reservation: null,
        fetchReservationRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case RESERVATION_FETCH_RESERVATION_SUCCESS: {
      const { payload: { reservation } } = action;
      return {
        ...state,
        reservation,
        fetchReservationRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case RESERVATION_FETCH_RESERVATION_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        reservation: null,
        fetchReservationRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case ORDER_MAKE_SUCCESS:
    case RESERVATION_FLUSH_RESERVATION: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
