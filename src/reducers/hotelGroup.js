// @flow

import type { Action } from '../actions';
import type { HotelGroupState } from '../states/hotelGroup';

import {
  HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING,
  HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS,
  HOTELGROUP_FETCH_HOTELGROUPS_FAILURE,
  HOTELGROUP_FETCH_HOTELGROUP_REQUESTING,
  HOTELGROUP_FETCH_HOTELGROUP_SUCCESS,
  HOTELGROUP_FETCH_HOTELGROUP_FAILURE,
  HOTELGROUP_FETCH_OFFERS_REQUESTING,
  HOTELGROUP_FETCH_OFFERS_SUCCESS,
  HOTELGROUP_FETCH_OFFERS_FAILURE,
} from '../actions/hotelGroup';

const initialState = {
  hotelGroups: [],
  fetchHotelGroupsRequest: {
    requesting: false,
    error: null,
  },
  hotelGroup: null,
  fetchHotelGroupRequest: {
    requesting: false,
    error: null,
  },
  offerListItems: [],
  fetchOffersRequest: {
    requesting: false,
    error: null,
  },
};

export default function(
  state: HotelGroupState = initialState,
  action: Action
): HotelGroupState {
  switch (action.type) {
    case HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING: {
      return {
        ...state,
        fetchHotelGroupsRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS: {
      const { payload: { hotelGroups } } = action;
      return {
        ...state,
        hotelGroups,
        fetchHotelGroupsRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_HOTELGROUPS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchHotelGroupsRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case HOTELGROUP_FETCH_HOTELGROUP_REQUESTING: {
      return {
        ...state,
        fetchHotelGroupRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_HOTELGROUP_SUCCESS: {
      const { payload: { hotelGroup } } = action;
      return {
        ...state,
        hotelGroup,
        fetchHotelGroupRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_HOTELGROUP_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchHotelGroupRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case HOTELGROUP_FETCH_OFFERS_REQUESTING: {
      return {
        ...state,
        fetchOffersRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_OFFERS_SUCCESS: {
      const { payload: { offers } } = action;
      return {
        ...state,
        offerListItems: offers,
        fetchOffersRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case HOTELGROUP_FETCH_OFFERS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchOffersRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    default:
      return state;
  }
}
