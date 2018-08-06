// @flow
import type { Dispatch } from '../types/Dispatch';
import type { Offer } from '../models/Offer';
import type { OfferListItem } from '../models/OfferListItem';
import type { HotelDate } from '../models/HotelDate';
import type Moment from 'moment';
import { ERR_RECORD_NOT_FOUND } from '../utils/apiError';
import type {
  ApiError,
  PageInfo,
  OfferListItemsResponse,
  OfferResponse,
  HotelDatesResponse,
} from '../types';
import apiClient from '../api';

export const OFFER_FETCH_OFFERS_REQUESTING: 'OFFER_FETCH_OFFERS_REQUESTING' = `OFFER_FETCH_OFFERS_REQUESTING`;
export const OFFER_FETCH_OFFERS_SUCCESS: 'OFFER_FETCH_OFFERS_SUCCESS' = `OFFER_FETCH_OFFERS_SUCCESS`;
export const OFFER_FETCH_OFFERS_FAILURE: 'OFFER_FETCH_OFFERS_FAILURE' = `OFFER_FETCH_OFFERS_FAILURE`;
export const OFFER_FLUSH_OFFERS: 'OFFER_FLUSH_OFFERS' = `OFFER_FLUSH_OFFERS`;

export const OFFER_FETCH_OFFER_REQUESTING: 'OFFER_FETCH_OFFER_REQUESTING' = `OFFER_FETCH_OFFER_REQUESTING`;
export const OFFER_FETCH_OFFER_SUCCESS: 'OFFER_FETCH_OFFER_SUCCESS' = `OFFER_FETCH_OFFER_SUCCESS`;
export const OFFER_FETCH_OFFER_FAILURE: 'OFFER_FETCH_OFFER_FAILURE' = `OFFER_FETCH_OFFER_FAILURE`;

export const OFFER_FETCH_FEATURED_OFFERS_REQUESTING: 'OFFER_FETCH_FEATURED_OFFERS_REQUESTING' = `OFFER_FETCH_FEATURED_OFFERS_REQUESTING`;
export const OFFER_FETCH_FEATURED_OFFERS_SUCCESS: 'OFFER_FETCH_FEATURED_OFFERS_SUCCESS' = `OFFER_FETCH_FEATURED_OFFERS_SUCCESS`;
export const OFFER_FETCH_FEATURED_OFFERS_FAILURE: 'OFFER_FETCH_FEATURED_OFFERS_FAILURE' = `OFFER_FETCH_FEATURED_OFFERS_FAILURE`;

export const OFFER_FETCH_SIMILAR_OFFERS_REQUESTING: 'OFFER_FETCH_SIMILAR_OFFERS_REQUESTING' = `OFFER_FETCH_SIMILAR_OFFERS_REQUESTING`;
export const OFFER_FETCH_SIMILAR_OFFERS_SUCCESS: 'OFFER_FETCH_SIMILAR_OFFERS_SUCCESS' = `OFFER_FETCH_SIMILAR_OFFERS_SUCCESS`;
export const OFFER_FETCH_SIMILAR_OFFERS_FAILURE: 'OFFER_FETCH_SIMILAR_OFFERS_FAILURE' = `OFFER_FETCH_SIMILAR_OFFERS_FAILURE`;

export const OFFER_FETCH_HOTEL_DATES_REQUESTING: 'OFFER_FETCH_HOTEL_DATES_REQUESTING' = `OFFER_FETCH_HOTEL_DATES_REQUESTING`;
export const OFFER_FETCH_HOTEL_DATES_SUCCESS: 'OFFER_FETCH_HOTEL_DATES_SUCCESS' = `OFFER_FETCH_HOTEL_DATES_SUCCESS`;
export const OFFER_FETCH_HOTEL_DATES_FAILURE: 'OFFER_FETCH_HOTEL_DATES_FAILURE' = `OFFER_FETCH_HOTEL_DATES_FAILURE`;
export const OFFER_FLUSH_HOTEL_DATE_REQUESTS: 'OFFER_FLUSH_HOTEL_DATES_REQUEST' = `OFFER_FLUSH_HOTEL_DATES_REQUEST`;

type OfferFetchOffersRequesting = {|
  type: typeof OFFER_FETCH_OFFERS_REQUESTING,
|};
type OfferFetchOffersSuccess = {|
  type: typeof OFFER_FETCH_OFFERS_SUCCESS,
  payload: {
    offerListItems: OfferListItem[],
    pageInfo: PageInfo,
  },
|};
type OfferFetchOffersFailure = {|
  type: typeof OFFER_FETCH_OFFERS_FAILURE,
  payload: {
    reason: string,
  },
|};
type OfferFlushOffers = {|
  type: typeof OFFER_FLUSH_OFFERS,
|};

type OfferFetchOfferRequesting = {|
  type: typeof OFFER_FETCH_OFFER_REQUESTING,
|};
type OfferFetchOfferSuccess = {|
  type: typeof OFFER_FETCH_OFFER_SUCCESS,
  payload: {
    offer: Offer,
  },
|};
type OfferFetchOfferFailure = {|
  type: typeof OFFER_FETCH_OFFER_FAILURE,
  payload: {
    reason: string,
  },
|};

type OfferFetchFeaturedOffersRequesting = {|
  type: typeof OFFER_FETCH_FEATURED_OFFERS_REQUESTING,
|};
type OfferFetchFeaturedOffersSuccess = {|
  type: typeof OFFER_FETCH_FEATURED_OFFERS_SUCCESS,
  payload: {
    offerListItems: OfferListItem[],
  },
|};
type OfferFetchFeaturedOffersFailure = {|
  type: typeof OFFER_FETCH_FEATURED_OFFERS_FAILURE,
  payload: {
    reason: string,
  },
|};

type OfferFetchSimilarOffersRequesting = {|
  type: typeof OFFER_FETCH_SIMILAR_OFFERS_REQUESTING,
|};
type OfferFetchSimilarOffersSuccess = {|
  type: typeof OFFER_FETCH_SIMILAR_OFFERS_SUCCESS,
  payload: {
    offerListItems: OfferListItem[],
  },
|};
type OfferFetchSimilarOffersFailure = {|
  type: typeof OFFER_FETCH_SIMILAR_OFFERS_FAILURE,
  payload: {
    reason: string,
  },
|};

type OfferFetchHotelDatesRequesting = {|
  type: typeof OFFER_FETCH_HOTEL_DATES_REQUESTING,
  payload: {
    from: Moment,
    to: Moment,
  },
|};
type OfferFetchHotelDatesSuccess = {|
  type: typeof OFFER_FETCH_HOTEL_DATES_SUCCESS,
  payload: {
    offerId: string,
    roomTypeId: string,
    hotelDates: HotelDate[],
    from: Moment,
    to: Moment,
  },
|};
type OfferFetchHotelDatesFailure = {|
  type: typeof OFFER_FETCH_HOTEL_DATES_FAILURE,
  payload: {
    from: Moment,
    to: Moment,
    reason: string,
  },
|};
type OfferFlushHotelDateRequests = {|
  type: typeof OFFER_FLUSH_HOTEL_DATE_REQUESTS,
|};

export type OfferAction =
  | OfferFetchOffersRequesting
  | OfferFetchOffersSuccess
  | OfferFetchOffersFailure
  | OfferFlushOffers
  | OfferFetchOfferRequesting
  | OfferFetchOfferSuccess
  | OfferFetchOfferFailure
  | OfferFetchFeaturedOffersRequesting
  | OfferFetchFeaturedOffersSuccess
  | OfferFetchFeaturedOffersFailure
  | OfferFetchSimilarOffersRequesting
  | OfferFetchSimilarOffersSuccess
  | OfferFetchSimilarOffersFailure
  | OfferFetchHotelDatesRequesting
  | OfferFetchHotelDatesSuccess
  | OfferFetchHotelDatesFailure
  | OfferFlushHotelDateRequests;

function fetchOffersRequestingAction(): OfferFetchOffersRequesting {
  return {
    type: OFFER_FETCH_OFFERS_REQUESTING,
  };
}

function fetchOffersSuccessAction(
  offerListItems: OfferListItem[],
  pageInfo: PageInfo
): OfferFetchOffersSuccess {
  return {
    type: OFFER_FETCH_OFFERS_SUCCESS,
    payload: {
      offerListItems,
      pageInfo,
    },
  };
}

function fetchOffersFailureAction(reason: string): OfferFetchOffersFailure {
  return {
    type: OFFER_FETCH_OFFERS_FAILURE,
    payload: {
      reason,
    },
  };
}

export function flushOffers(): OfferFlushOffers {
  return {
    type: OFFER_FLUSH_OFFERS,
  };
}

function fetchOfferRequestingAction(): OfferFetchOfferRequesting {
  return {
    type: OFFER_FETCH_OFFER_REQUESTING,
  };
}

function fetchOfferSuccessAction(offer: Offer): OfferFetchOfferSuccess {
  return {
    type: OFFER_FETCH_OFFER_SUCCESS,
    payload: {
      offer,
    },
  };
}

function fetchOfferFailureAction(reason: string): OfferFetchOfferFailure {
  return {
    type: OFFER_FETCH_OFFER_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchFeaturedOffersRequestingAction(): OfferFetchFeaturedOffersRequesting {
  return {
    type: OFFER_FETCH_FEATURED_OFFERS_REQUESTING,
  };
}

function fetchFeaturedOffersSuccessAction(
  offerListItems: OfferListItem[]
): OfferFetchFeaturedOffersSuccess {
  return {
    type: OFFER_FETCH_FEATURED_OFFERS_SUCCESS,
    payload: {
      offerListItems,
    },
  };
}

function fetchFeaturedOffersFailureAction(
  reason: string
): OfferFetchFeaturedOffersFailure {
  return {
    type: OFFER_FETCH_FEATURED_OFFERS_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchSimilarOffersRequestingAction(): OfferFetchSimilarOffersRequesting {
  return {
    type: OFFER_FETCH_SIMILAR_OFFERS_REQUESTING,
  };
}

function fetchSimilarOffersSuccessAction(
  offerListItems: OfferListItem[]
): OfferFetchSimilarOffersSuccess {
  return {
    type: OFFER_FETCH_SIMILAR_OFFERS_SUCCESS,
    payload: {
      offerListItems,
    },
  };
}

function fetchSimilarOffersFailureAction(
  reason: string
): OfferFetchSimilarOffersFailure {
  return {
    type: OFFER_FETCH_SIMILAR_OFFERS_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchHotelDatesRequestingAction(
  from: Moment,
  to: Moment
): OfferFetchHotelDatesRequesting {
  return {
    type: OFFER_FETCH_HOTEL_DATES_REQUESTING,
    payload: {
      from,
      to,
    },
  };
}

function fetchHotelDatesSuccessAction(
  offerId: string,
  roomTypeId: string,
  hotelDates: HotelDate[],
  from: Moment,
  to: Moment
): OfferFetchHotelDatesSuccess {
  return {
    type: OFFER_FETCH_HOTEL_DATES_SUCCESS,
    payload: {
      offerId,
      roomTypeId,
      hotelDates,
      from,
      to,
    },
  };
}

function fetchHotelDatesFailureAction(
  from: Moment,
  to: Moment,
  reason: string
): OfferFetchHotelDatesFailure {
  return {
    type: OFFER_FETCH_HOTEL_DATES_FAILURE,
    payload: {
      from,
      to,
      reason,
    },
  };
}

export function flushHotelDateRequests(): OfferFlushHotelDateRequests {
  return {
    type: OFFER_FLUSH_HOTEL_DATE_REQUESTS,
  };
}

export function fetchOffers(
  offset: number,
  limit: number,
  experienceId: ?string
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchOffersRequestingAction());
    apiClient
      .fetchOffersByExperienceId(offset, limit, experienceId)
      .then((response: OfferListItemsResponse) => {
        const hasNextPage = response.totalCount > offset + limit;
        const pageInfo = { hasNextPage };
        dispatch(fetchOffersSuccessAction(response.offers, pageInfo));
      })
      .catch((error: ApiError) => {
        dispatch(fetchOffersFailureAction(error.message));
      });
  };
}

export function fetchOffer(
  id: string,
  hotelSlug: string
): Dispatch => Promise<OfferResponse> {
  return (dispatch: Dispatch) => {
    dispatch(fetchOfferRequestingAction());
    return apiClient
      .fetchOffer(id, hotelSlug)
      .then((response: OfferResponse) => {
        dispatch(fetchOfferSuccessAction(response.offer));
        return Promise.resolve(response);
      })
      .catch((error: ApiError) => {
        let errorKey = '';
        switch (error.code) {
          case ERR_RECORD_NOT_FOUND:
            errorKey = 'offer.not_found';
            break;
          default:
            errorKey = error.message;
        }
        dispatch(fetchOfferFailureAction(errorKey));
        return Promise.reject(error);
      });
  };
}

export function fetchFeaturedOffers(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchFeaturedOffersRequestingAction());
    apiClient
      .fetchFeaturedOffers()
      .then((response: OfferListItemsResponse) => {
        dispatch(fetchFeaturedOffersSuccessAction(response.offers));
      })
      .catch((error: ApiError) => {
        dispatch(fetchFeaturedOffersFailureAction(error.message));
      });
  };
}

export function fetchSimilarOffers(offerId: string): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchSimilarOffersRequestingAction());
    apiClient
      .fetchSimilarOffers(offerId)
      .then((response: OfferListItemsResponse) => {
        dispatch(fetchSimilarOffersSuccessAction(response.offers));
      })
      .catch((error: ApiError) => {
        dispatch(fetchSimilarOffersFailureAction(error.message));
      });
  };
}

export function fetchHotelDates(
  offerId: string,
  roomTypeId: string,
  from: Moment,
  to: Moment
): Dispatch => Promise<HotelDate[]> {
  return (dispatch: Dispatch) => {
    dispatch(fetchHotelDatesRequestingAction(from, to));
    return apiClient
      .fetchHotelDates(offerId, roomTypeId, from, to)
      .then((response: HotelDatesResponse) => {
        const dates = response.hotelDates;
        dispatch(
          fetchHotelDatesSuccessAction(offerId, roomTypeId, dates, from, to)
        );
        return Promise.resolve(dates);
      })
      .catch((error: ApiError) => {
        dispatch(fetchHotelDatesFailureAction(from, to, error.message));
        return Promise.reject(error);
      });
  };
}
