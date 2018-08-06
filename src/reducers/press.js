// @flow

import type { Action } from '../actions';
import type { PressState } from '../states/press';

import {
  PRESS_FETCH_PRESSES_REQUESTING,
  PRESS_FETCH_PRESSES_SUCCESS,
  PRESS_FETCH_PRESSES_FAILURE,
} from '../actions/press';

const initialState = {
  presses: [],
  fetchPressesRequest: {
    requesting: false,
    error: null,
  },
};

export default function(
  state: PressState = initialState,
  action: Action
): PressState {
  switch (action.type) {
    case PRESS_FETCH_PRESSES_REQUESTING: {
      return {
        ...state,
        fetchPressesRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case PRESS_FETCH_PRESSES_SUCCESS: {
      const { payload: { presses } } = action;
      return {
        ...state,
        presses: state.presses.concat(presses),
        fetchPressesRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case PRESS_FETCH_PRESSES_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchPressesRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    default:
      return state;
  }
}
