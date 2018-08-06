// @flow

import type { Action } from '../actions';
import type { AdvertisementState } from '../states/advertisement';

import {
  ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING,
  ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS,
  ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE,
} from '../actions/advertisement';

const initialState = {
  landing: {
    advertisements: [],
    fetchAdvertisementsRequest: {
      requesting: false,
      error: null,
    },
  },
  footer: {
    advertisements: [],
    fetchAdvertisementsRequest: {
      requesting: false,
      error: null,
    },
  },
};

export default function(
  state: AdvertisementState = initialState,
  action: Action
): AdvertisementState {
  switch (action.type) {
    case ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING: {
      const { payload: { showAt } } = action;
      return {
        ...state,
        [showAt]: {
          ...state[showAt],
          fetchAdvertisementsRequest: {
            requesting: true,
            error: null,
          },
        },
      };
    }
    case ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS: {
      const { payload: { showAt, advertisements } } = action;
      return {
        ...state,
        [showAt]: {
          advertisements,
          fetchAdvertisementsRequest: {
            requesting: false,
            error: null,
          },
        },
      };
    }
    case ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE: {
      const { payload: { showAt, reason } } = action;
      return {
        ...state,
        [showAt]: {
          ...state[showAt],
          fetchAdvertisementsRequest: {
            requesting: false,
            error: reason,
          },
        },
      };
    }
    default:
      return state;
  }
}
