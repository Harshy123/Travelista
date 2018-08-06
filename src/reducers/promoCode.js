// @flow

import type { PromoCodeState } from '../states/promoCode';
import type { Action } from '../actions';

import {
  PROMOCODE_FETCH_REQUESTING,
  PROMOCODE_FETCH_SUCCESS,
  PROMOCODE_FETCH_FAILURE,
  FLUSH_PROMOCODE,
} from '../actions/promoCode';

import { ORDER_MAKE_SUCCESS, ORDER_MAKE_FAILURE } from '../actions/order';

const initialState = {
  code: null,
  fetchPromoCodeRequest: {
    requesting: false,
    error: null,
  },
};

export default function(
  state: PromoCodeState = initialState,
  action: Action
): PromoCodeState {
  switch (action.type) {
    case PROMOCODE_FETCH_REQUESTING: {
      return {
        ...state,
        fetchPromoCodeRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case PROMOCODE_FETCH_SUCCESS: {
      const { payload: { promoCode } } = action;
      return {
        ...state,
        code: promoCode,
        fetchPromoCodeRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case PROMOCODE_FETCH_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        code: null,
        fetchPromoCodeRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case ORDER_MAKE_SUCCESS:
    case ORDER_MAKE_FAILURE:
    case FLUSH_PROMOCODE: {
      return initialState;
    }
    default:
      return state;
  }
}
