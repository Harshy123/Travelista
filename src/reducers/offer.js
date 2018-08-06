// @flow

import {
  OFFER_FETCH_OFFERS_REQUESTING,
  OFFER_FETCH_OFFERS_SUCCESS,
  OFFER_FETCH_OFFERS_FAILURE,
  OFFER_FLUSH_OFFERS,
  OFFER_FETCH_OFFER_REQUESTING,
  OFFER_FETCH_OFFER_SUCCESS,
  OFFER_FETCH_OFFER_FAILURE,
  OFFER_FETCH_FEATURED_OFFERS_REQUESTING,
  OFFER_FETCH_FEATURED_OFFERS_SUCCESS,
  OFFER_FETCH_FEATURED_OFFERS_FAILURE,
  OFFER_FETCH_SIMILAR_OFFERS_REQUESTING,
  OFFER_FETCH_SIMILAR_OFFERS_SUCCESS,
  OFFER_FETCH_SIMILAR_OFFERS_FAILURE,
  OFFER_FETCH_HOTEL_DATES_REQUESTING,
  OFFER_FETCH_HOTEL_DATES_SUCCESS,
  OFFER_FETCH_HOTEL_DATES_FAILURE,
  OFFER_FLUSH_HOTEL_DATE_REQUESTS,
} from '../actions/offer';
import { toHotelDateMapKey } from '../utils/utils';
import { toDateString, toDurationString } from '../utils/time';

import type { Action } from '../actions';
import type { HotelDate } from '../models/HotelDate';
import type { OfferState } from '../states/offer';

const initialState = {
  offerEntry: null,
  offerListItems: [],
  featuredOfferListItems: [],
  similarOfferListItems: [],
  fetchOfferRequest: {
    requesting: false,
    error: null,
  },
  fetchOffersRequest: {
    requesting: false,
    error: null,
  },
  fetchFeaturedOffersRequest: {
    requesting: false,
    error: null,
  },
  fetchSimilarOffersRequest: {
    requesting: false,
    error: null,
  },
  offersPageInfo: {
    hasNextPage: false,
  },
  hotelDateRequests: {},
  hotelDateMap: {},
  recommendedRoomTypeUpgrade: null,
  recommendedPackageUpgrade: null,
  recommendedRequest: {
    requesting: false,
    error: null,
  },
};

export default function(
  state: OfferState = initialState,
  action: Action
): OfferState {
  switch (action.type) {
    case OFFER_FETCH_OFFERS_REQUESTING: {
      return {
        ...state,
        fetchOffersRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case OFFER_FETCH_OFFERS_SUCCESS: {
      const { payload: { offerListItems, pageInfo } } = action;
      return {
        ...state,
        offerListItems: state.offerListItems.concat(offerListItems),
        fetchOffersRequest: {
          requesting: false,
          error: null,
        },
        offersPageInfo: {
          ...pageInfo,
        },
      };
    }
    case OFFER_FETCH_OFFERS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchOffersRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case OFFER_FLUSH_OFFERS: {
      return {
        ...state,
        offerListItems: [],
        offersPageInfo: {
          hasNextPage: false,
        },
      };
    }
    case OFFER_FETCH_OFFER_REQUESTING: {
      return {
        ...state,
        fetchOfferRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case OFFER_FETCH_OFFER_SUCCESS: {
      const { payload: { offer } } = action;
      return {
        ...state,
        offerEntry: offer,
        fetchOfferRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case OFFER_FETCH_OFFER_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchOfferRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case OFFER_FETCH_FEATURED_OFFERS_REQUESTING: {
      return {
        ...state,
        fetchFeaturedOffersRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case OFFER_FETCH_FEATURED_OFFERS_SUCCESS: {
      const { payload: { offerListItems } } = action;
      return {
        ...state,
        featuredOfferListItems: offerListItems,
        fetchFeaturedOffersRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case OFFER_FETCH_FEATURED_OFFERS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchFeaturedOffersRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case OFFER_FETCH_SIMILAR_OFFERS_REQUESTING: {
      return {
        ...state,
        fetchSimilarOffersRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case OFFER_FETCH_SIMILAR_OFFERS_SUCCESS: {
      const { payload: { offerListItems } } = action;
      return {
        ...state,
        similarOfferListItems: offerListItems,
        fetchSimilarOffersRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case OFFER_FETCH_SIMILAR_OFFERS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        fetchSimilarOffersRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case OFFER_FETCH_HOTEL_DATES_REQUESTING: {
      const { payload: { from, to } } = action;
      return {
        ...state,
        hotelDateRequests: {
          ...state.hotelDateRequests,
          [toDurationString(from, to)]: {
            requesting: true,
            error: null,
          },
        },
      };
    }
    case OFFER_FETCH_HOTEL_DATES_SUCCESS: {
      const { payload: { offerId, roomTypeId, hotelDates, from, to } } = action;
      const hotelDateKey = offerId + ',' + roomTypeId;
      const previousHotelDates =
        state.hotelDateMap[toHotelDateMapKey(offerId, roomTypeId)] || {};
      const dates = hotelDates.reduce(
        (m: { [string]: HotelDate }, hd: HotelDate) => ({
          ...m,
          [toDateString(hd.date)]: hd,
        }),
        { ...previousHotelDates }
      );
      return {
        ...state,
        hotelDateMap: {
          ...state.hotelDateMap,
          [hotelDateKey]: dates,
        },
        hotelDateRequests: {
          ...state.hotelDateRequests,
          [toDurationString(from, to)]: {
            requesting: false,
            error: null,
          },
        },
      };
    }
    case OFFER_FETCH_HOTEL_DATES_FAILURE: {
      const { payload: { from, to, reason } } = action;
      return {
        ...state,
        hotelDateRequests: {
          ...state.hotelDateRequests,
          [toDurationString(from, to)]: {
            requesting: false,
            error: reason,
          },
        },
      };
    }
    case OFFER_FLUSH_HOTEL_DATE_REQUESTS: {
      return {
        ...state,
        hotelDateRequests: {},
      };
    }
    default:
      return state;
  }
}
