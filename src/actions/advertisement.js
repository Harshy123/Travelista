// @flow
import type { Dispatch } from '../types/Dispatch';
import type { Advertisement } from '../models/Advertisement';
import type { ApiError, AdvertisementsResponse } from '../types';
import apiClient from '../api';

export const ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING: 'ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING' = `ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING`;
export const ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS: 'ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS' = `ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS`;
export const ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE: 'ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE' = `ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE`;

type AdvertisementFetchAdvertisementsRequesting = {|
  type: typeof ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING,
  payload: {
    showAt: 'landing' | 'footer',
  },
|};

type AdvertisementFetchAdvertisementsSuccess = {|
  type: typeof ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS,
  payload: {
    showAt: 'landing' | 'footer',
    advertisements: Advertisement[],
  },
|};

type AdvertisementFetchAdvertisementsFailure = {|
  type: typeof ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE,
  payload: {
    showAt: 'landing' | 'footer',
    reason: string,
  },
|};

export type AdvertisementAction =
  | AdvertisementFetchAdvertisementsRequesting
  | AdvertisementFetchAdvertisementsSuccess
  | AdvertisementFetchAdvertisementsFailure;

function fetchAdvertisementsRequestingAction(
  showAt: 'landing' | 'footer'
): AdvertisementFetchAdvertisementsRequesting {
  return {
    type: ADVERTISEMENT_FETCH_ADVERTISEMENTS_REQUESTING,
    payload: { showAt },
  };
}

function fetchAdvertisementsSuccessAction(
  showAt: 'landing' | 'footer',
  advertisements: Advertisement[]
): AdvertisementFetchAdvertisementsSuccess {
  return {
    type: ADVERTISEMENT_FETCH_ADVERTISEMENTS_SUCCESS,
    payload: {
      showAt,
      advertisements,
    },
  };
}

function fetchAdvertisementsFailureAction(
  showAt: 'landing' | 'footer',
  reason: string
): AdvertisementFetchAdvertisementsFailure {
  return {
    type: ADVERTISEMENT_FETCH_ADVERTISEMENTS_FAILURE,
    payload: {
      showAt,
      reason,
    },
  };
}

export function fetchAdvertisements(
  offset: number,
  limit: number,
  showAt: 'landing' | 'footer'
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchAdvertisementsRequestingAction(showAt));
    apiClient
      .fetchAdvertisements(offset, limit, showAt)
      .then((response: AdvertisementsResponse) => {
        dispatch(
          fetchAdvertisementsSuccessAction(showAt, response.advertisements)
        );
      })
      .catch((error: ApiError) => {
        dispatch(fetchAdvertisementsFailureAction(showAt, error.message));
      });
  };
}
