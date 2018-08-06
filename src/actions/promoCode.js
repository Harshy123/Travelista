// @flow
import type { Dispatch } from '../types/Dispatch';
import type { PromoCode } from '../models/PromoCode';
import type { ApiError, PromoCodeResponse } from '../types';

import apiClient from '../api';

export const PROMOCODE_FETCH_REQUESTING: 'PROMOCODE_FETCH_REQUESTING' = `PROMOCODE_FETCH_REQUESTING`;
export const PROMOCODE_FETCH_SUCCESS: 'PROMOCODE_FETCH_SUCCESS' = `PROMOCODE_FETCH_SUCCESS`;
export const PROMOCODE_FETCH_FAILURE: 'PROMOCODE_FETCH_FAILURE' = `PROMOCODE_FETCH_FAILURE`;

export const FLUSH_PROMOCODE: 'FLUSH_PROMOCODE' = `FLUSH_PROMOCODE`;

type PromoCodeRequesting = {|
  type: typeof PROMOCODE_FETCH_REQUESTING,
|};

type PromoCodeSuccess = {|
  type: typeof PROMOCODE_FETCH_SUCCESS,
  payload: {
    promoCode: PromoCode,
  },
|};

type PromoCodeFailure = {|
  type: typeof PROMOCODE_FETCH_FAILURE,
  payload: {
    reason: string,
  },
|};

type FlushPromoCode = {
  type: typeof FLUSH_PROMOCODE,
};

export type PromoCodeAction =
  | PromoCodeRequesting
  | PromoCodeSuccess
  | PromoCodeFailure
  | FlushPromoCode;

function fetchPromoCodeRequestingAction(): PromoCodeRequesting {
  return {
    type: PROMOCODE_FETCH_REQUESTING,
  };
}

function fetchPromoCodeSuccessAction(promoCode: PromoCode): PromoCodeSuccess {
  return {
    type: PROMOCODE_FETCH_SUCCESS,
    payload: {
      promoCode,
    },
  };
}

function fetchPromoCodeFailureAction(reason: string): PromoCodeFailure {
  return {
    type: PROMOCODE_FETCH_FAILURE,
    payload: {
      reason,
    },
  };
}

export function flushPromoCode(): FlushPromoCode {
  return {
    type: FLUSH_PROMOCODE,
  };
}

export function fetchPromoCode(code: string): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchPromoCodeRequestingAction());
    apiClient
      .fetchPromoCode(code)
      .then((response: PromoCodeResponse) => {
        dispatch(fetchPromoCodeSuccessAction(response.promoCode));
      })
      .catch((error: ApiError) => {
        dispatch(fetchPromoCodeFailureAction(error.message));
      });
  };
}
