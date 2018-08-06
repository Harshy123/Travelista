// @flow
import type { Dispatch } from '../types/Dispatch';
import type { Press } from '../models/Press';
import type { ApiError, PressesResponse } from '../types';
import apiClient from '../api';

export const PRESS_FETCH_PRESSES_SUCCESS: 'PRESS_FETCH_PRESSES_SUCCESS' = `PRESS_FETCH_PRESSES_SUCCESS`;
export const PRESS_FETCH_PRESSES_REQUESTING: 'PRESS_FETCH_PRESSES_REQUESTING' = `PRESS_FETCH_PRESSES_REQUESTING`;
export const PRESS_FETCH_PRESSES_FAILURE: 'PRESS_FETCH_PRESSES_FAILURE' = `PRESS_FETCH_PRESSES_FAILURE`;

type PressFetchPressesRequesting = {|
  type: typeof PRESS_FETCH_PRESSES_REQUESTING,
|};
type PressFetchPressesSuccess = {|
  type: typeof PRESS_FETCH_PRESSES_SUCCESS,
  payload: {|
    presses: Press[],
  |},
|};
type PressFetchPressesFailure = {|
  type: typeof PRESS_FETCH_PRESSES_FAILURE,
  payload: {
    reason: string,
  },
|};

export type PressAction =
  | PressFetchPressesRequesting
  | PressFetchPressesSuccess
  | PressFetchPressesFailure;

function fetchPressesRequestingAction(): PressFetchPressesRequesting {
  return {
    type: PRESS_FETCH_PRESSES_REQUESTING,
  };
}

function fetchPressesSuccessAction(presses: Press[]): PressFetchPressesSuccess {
  return {
    type: PRESS_FETCH_PRESSES_SUCCESS,
    payload: {
      presses,
    },
  };
}

function fetchPressesFailureAction(reason: string): PressFetchPressesFailure {
  return {
    type: PRESS_FETCH_PRESSES_FAILURE,
    payload: {
      reason,
    },
  };
}

export function fetchPresses(
  offset: number,
  limit: number
): Dispatch => Promise<PressesResponse> {
  return (dispatch: Dispatch) => {
    dispatch(fetchPressesRequestingAction());
    return apiClient
      .fetchPresses(offset, limit)
      .then((response: PressesResponse) => {
        dispatch(fetchPressesSuccessAction(response.presses));
        return Promise.resolve(response);
      })
      .catch((error: ApiError) => {
        dispatch(fetchPressesFailureAction(error.message));
        return Promise.reject(error);
      });
  };
}
