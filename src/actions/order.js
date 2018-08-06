// @flow
import { push } from 'connected-react-router';
import apiClient from '../api';
import { whoami } from './auth';

import {
  ERR_PAYMENT,
  ERR_INVALID_STRIPE_TOKEN,
  ERR_INVALID_FORM_DATA,
  ERR_ROOM_SOLD_OUT,
} from '../utils/apiError';
import { setCurrency } from '../utils/currency';

import type { ApiError, OrderResponse } from '../types';
import type { Dispatch, GetState } from '../types/Dispatch';

import type { Order } from '../models/Order';
import type { Reservation } from '../models/Reservation';
import type { Travelista, TravelistaTrip } from '../models/Travelista';
import type { PaymentInfo } from '../models/PaymentInfo';

export const ORDER_MAKE_REQUESTING: 'ORDER_MAKE_REQUESTING' = `ORDER_MAKE_REQUESTING`;
export const ORDER_MAKE_SUCCESS: 'ORDER_MAKE_SUCCESS' = `ORDER_MAKE_SUCCESS`;
export const ORDER_MAKE_FAILURE: 'ORDER_MAKE_FAILURE' = `ORDER_MAKE_FAILURE`;

export const ORDER_FETCH_REQUESTING: 'ORDER_FETCH_REQUESTING' = `ORDER_FETCH_REQUESTING`;
export const ORDER_FETCH_SUCCESS: 'ORDER_FETCH_SUCCESS' = `ORDER_FETCH_SUCCESS`;
export const ORDER_FETCH_FAILURE: 'ORDER_FETCH_FAILURE' = `ORDER_FETCH_FAILURE`;

type OrderMakeRequesting = {|
  type: typeof ORDER_MAKE_REQUESTING,
|};
type OrderMakeSuccess = {|
  type: typeof ORDER_MAKE_SUCCESS,
  payload: {|
    order: Order,
  |},
|};
type OrderMakeFailure = {|
  type: typeof ORDER_MAKE_FAILURE,
  payload: {
    reason: string,
  },
|};

type OrderFetchRequesting = {|
  type: typeof ORDER_FETCH_REQUESTING,
|};
type OrderFetchSuccess = {|
  type: typeof ORDER_FETCH_SUCCESS,
  payload: {|
    order: Order,
  |},
|};
type OrderFetchFailure = {|
  type: typeof ORDER_FETCH_FAILURE,
  payload: {
    reason: string,
  },
|};

export type OrderAction =
  | OrderMakeRequesting
  | OrderMakeSuccess
  | OrderMakeFailure
  | OrderFetchRequesting
  | OrderFetchSuccess
  | OrderFetchFailure;

function makeOrderRequestingAction(): OrderMakeRequesting {
  return {
    type: ORDER_MAKE_REQUESTING,
  };
}

function makeOrderSuccessAction(order: Order): OrderMakeSuccess {
  return {
    type: ORDER_MAKE_SUCCESS,
    payload: {
      order,
    },
  };
}

function makeOrderFailureAction(reason: string): OrderMakeFailure {
  return {
    type: ORDER_MAKE_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchOrderRequestingAction(): OrderFetchRequesting {
  return {
    type: ORDER_FETCH_REQUESTING,
  };
}

function fetchOrderSuccessAction(order: Order): OrderFetchSuccess {
  return {
    type: ORDER_FETCH_SUCCESS,
    payload: {
      order,
    },
  };
}

function fetchOrderFailureAction(reason: string): OrderFetchFailure {
  return {
    type: ORDER_FETCH_FAILURE,
    payload: {
      reason,
    },
  };
}

export function makeOrder(
  reservation: Reservation,
  users: { user: Travelista, trip: TravelistaTrip }[],
  stripeToken: ?string,
  paymentInfo: PaymentInfo
): (Dispatch, GetState) => Promise<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    const user = getState().auth.user;
    if (user == null) {
      // impossible
      return Promise.reject(new Error('user is not logged in'));
    }

    dispatch(makeOrderRequestingAction());
    return apiClient
      .makeOrder(reservation, users, stripeToken, paymentInfo)
      .then((response: OrderResponse) => {
        const order = response.order;

        dispatch(makeOrderSuccessAction(order));
        setCurrency(user.defaultCurrency, false);
        dispatch(whoami());
        dispatch(push(`/order/${order.id}`));
      })
      .catch((error: ApiError) => {
        let errorKey = '';
        switch (error.code) {
          case ERR_PAYMENT:
            errorKey = 'packages.step2.error.payment_error';
            break;
          case ERR_INVALID_STRIPE_TOKEN:
            errorKey = 'packages.step2.error.invalid_stripe_token';
            break;
          case ERR_INVALID_FORM_DATA:
            errorKey = 'packages.step2.error.invalid_form_data';
            break;
          case ERR_ROOM_SOLD_OUT:
            errorKey = 'packages.step2.error.room_sold_out';
            break;
          default:
            errorKey = error.message;
        }

        dispatch(makeOrderFailureAction(errorKey));
      });
  };
}

export function fetchOrder(orderId: string): Dispatch => Promise<void> {
  return (dispatch: Dispatch) => {
    dispatch(fetchOrderRequestingAction());
    return apiClient.fetchOrder(orderId).then(
      (response: OrderResponse) => {
        dispatch(fetchOrderSuccessAction(response.order));
      },
      (error: ApiError) => {
        dispatch(fetchOrderFailureAction(error.message));
      }
    );
  };
}
