// @flow
import type { Dispatch } from '../types/Dispatch';
import type { HotelGroup } from '../models/HotelGroup';
import type { OfferListItem } from '../models/OfferListItem';
import type {
  ApiError,
  HotelGroupsResponse,
  HotelGroupResponse,
  OfferListItemsResponse,
} from '../types';
import apiClient from '../api';

export const HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING: 'HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING' = `HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING`;
export const HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS: 'HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS' = `HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS`;
export const HOTELGROUP_FETCH_HOTELGROUPS_FAILURE: 'HOTELGROUP_FETCH_HOTELGROUPS_FAILURE' = `HOTELGROUP_FETCH_HOTELGROUPS_FAILURE`;

export const HOTELGROUP_FETCH_HOTELGROUP_REQUESTING: 'HOTELGROUP_FETCH_HOTELGROUP_REQUESTING' = `HOTELGROUP_FETCH_HOTELGROUP_REQUESTING`;
export const HOTELGROUP_FETCH_HOTELGROUP_SUCCESS: 'HOTELGROUP_FETCH_HOTELGROUP_SUCCESS' = `HOTELGROUP_FETCH_HOTELGROUP_SUCCESS`;
export const HOTELGROUP_FETCH_HOTELGROUP_FAILURE: 'HOTELGROUP_FETCH_HOTELGROUP_FAILURE' = `HOTELGROUP_FETCH_HOTELGROUP_FAILURE`;

export const HOTELGROUP_FETCH_OFFERS_REQUESTING: 'HOTELGROUP_FETCH_OFFERS_REQUESTING' = `HOTELGROUP_FETCH_OFFERS_REQUESTING`;
export const HOTELGROUP_FETCH_OFFERS_SUCCESS: 'HOTELGROUP_FETCH_OFFERS_SUCCESS' = `HOTELGROUP_FETCH_OFFERS_SUCCESS`;
export const HOTELGROUP_FETCH_OFFERS_FAILURE: 'HOTELGROUP_FETCH_OFFERS_FAILURE' = `HOTELGROUP_FETCH_OFFERS_FAILURE`;

type HotelGroupFetchHotelGroupsRequesting = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING,
|};
type HotelGroupFetchHotelGroupsSuccess = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS,
  payload: {
    hotelGroups: HotelGroup[],
  },
|};
type HotelGroupFetchHotelGroupsFailure = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUPS_FAILURE,
  payload: {
    reason: string,
  },
|};

type HotelGroupFetchHotelGroupRequesting = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUP_REQUESTING,
|};
type HotelGroupFetchHotelGroupSuccess = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUP_SUCCESS,
  payload: {
    hotelGroup: HotelGroup,
  },
|};
type HotelGroupFetchHotelGroupFailure = {|
  type: typeof HOTELGROUP_FETCH_HOTELGROUP_FAILURE,
  payload: {
    reason: string,
  },
|};

type HotelGroupFetchOffersRequesting = {|
  type: typeof HOTELGROUP_FETCH_OFFERS_REQUESTING,
|};
type HotelGroupFetchOffersSuccess = {|
  type: typeof HOTELGROUP_FETCH_OFFERS_SUCCESS,
  payload: {
    offers: OfferListItem[],
  },
|};
type HotelGroupFetchOffersFailure = {|
  type: typeof HOTELGROUP_FETCH_OFFERS_FAILURE,
  payload: {
    reason: string,
  },
|};

export type HotelGroupAction =
  | HotelGroupFetchHotelGroupsRequesting
  | HotelGroupFetchHotelGroupsSuccess
  | HotelGroupFetchHotelGroupsFailure
  | HotelGroupFetchHotelGroupRequesting
  | HotelGroupFetchHotelGroupSuccess
  | HotelGroupFetchHotelGroupFailure
  | HotelGroupFetchOffersRequesting
  | HotelGroupFetchOffersSuccess
  | HotelGroupFetchOffersFailure;

function fetchHotelGroupsRequestingAction(): HotelGroupFetchHotelGroupsRequesting {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUPS_REQUESTING,
  };
}

function fetchHotelGroupsSuccessAction(
  hotelGroups: HotelGroup[]
): HotelGroupFetchHotelGroupsSuccess {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUPS_SUCCESS,
    payload: {
      hotelGroups,
    },
  };
}

function fetchHotelGroupsFailureAction(
  reason: string
): HotelGroupFetchHotelGroupsFailure {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUPS_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchHotelGroupRequestingAction(): HotelGroupFetchHotelGroupRequesting {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUP_REQUESTING,
  };
}

function fetchHotelGroupSuccessAction(
  hotelGroup: HotelGroup
): HotelGroupFetchHotelGroupSuccess {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUP_SUCCESS,
    payload: {
      hotelGroup,
    },
  };
}

function fetchHotelGroupFailureAction(
  reason: string
): HotelGroupFetchHotelGroupFailure {
  return {
    type: HOTELGROUP_FETCH_HOTELGROUP_FAILURE,
    payload: {
      reason,
    },
  };
}

function fetchOffersRequestingAction(): HotelGroupFetchOffersRequesting {
  return {
    type: HOTELGROUP_FETCH_OFFERS_REQUESTING,
  };
}

function fetchOffersSuccessAction(
  offers: OfferListItem[]
): HotelGroupFetchOffersSuccess {
  return {
    type: HOTELGROUP_FETCH_OFFERS_SUCCESS,
    payload: {
      offers: offers,
    },
  };
}

function fetchOffersFailureAction(
  reason: string
): HotelGroupFetchOffersFailure {
  return {
    type: HOTELGROUP_FETCH_OFFERS_FAILURE,
    payload: {
      reason,
    },
  };
}

export function fetchHotelGroups(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchHotelGroupsRequestingAction());
    apiClient
      .fetchHotelGroups()
      .then((response: HotelGroupsResponse) => {
        dispatch(fetchHotelGroupsSuccessAction(response.hotelGroups));
      })
      .catch((error: ApiError) => {
        dispatch(fetchHotelGroupsFailureAction(error.message));
      });
  };
}

export function fetchHotelGroup(
  hotelGroupSlug: string
): Dispatch => Promise<HotelGroup> {
  return (dispatch: Dispatch) => {
    dispatch(fetchHotelGroupRequestingAction());
    return apiClient
      .fetchHotelGroup(hotelGroupSlug)
      .then((response: HotelGroupResponse) => {
        dispatch(fetchHotelGroupSuccessAction(response.hotelGroup));

        return response.hotelGroup;
      })
      .catch((error: ApiError) => {
        dispatch(fetchHotelGroupFailureAction(error.message));

        throw error;
      });
  };
}

export function fetchOffers(hotelGroupSlug: string): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchOffersRequestingAction());
    apiClient
      .fetchOffersByHotelGroupSlug(hotelGroupSlug)
      .then((response: OfferListItemsResponse) => {
        dispatch(fetchOffersSuccessAction(response.offers));
      })
      .catch((error: ApiError) => {
        dispatch(fetchOffersFailureAction(error.message));
      });
  };
}
