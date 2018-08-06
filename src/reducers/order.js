// @flow

import type { Action } from '../actions';
import type { OrderState } from '../states/order';

import {
  ORDER_MAKE_REQUESTING,
  ORDER_MAKE_SUCCESS,
  ORDER_MAKE_FAILURE,
  ORDER_FETCH_REQUESTING,
  ORDER_FETCH_SUCCESS,
  ORDER_FETCH_FAILURE,
} from '../actions/order';

const initialState = {
  makeOrderRequest: {
    requesting: false,
    error: null,
  },
  fetchOrderRequest: {
    requesting: false,
    error: null,
  },
  order: null,
};

export default function(
  state: OrderState = initialState,
  action: Action
): OrderState {
  switch (action.type) {
    case ORDER_MAKE_REQUESTING: {
      return {
        ...state,
        order: null,
        makeOrderRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ORDER_MAKE_SUCCESS: {
      const { payload: { order } } = action;
      return {
        ...state,
        order,
        makeOrderRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ORDER_MAKE_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        order: null,
        makeOrderRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case ORDER_FETCH_REQUESTING: {
      return {
        ...state,
        order: null,
        fetchOrderRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ORDER_FETCH_SUCCESS: {
      const { payload: { order } } = action;
      return {
        ...state,
        order,
        fetchOrderRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ORDER_FETCH_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        order: null,
        fetchOrderRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    default: {
      return state;
    }
  }
}
