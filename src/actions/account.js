// @flow

import skygear from 'skygear';
import { push } from 'connected-react-router';
import apiClient from '../api';
import {
  ERR_MISSING_PARTNER_CODE,
  ERR_INVALID_PARTNER_CODE,
} from '../utils/apiError';
import type { User, UpdateUser } from '../models/User';
import type { Dispatch, GetState } from '../types/Dispatch';
import type { CreditCard } from '../models/CreditCard';
import type { CreditCardInfo } from '../models/CreditCardInfo';
import type { OrderListItem } from '../models/OrderListItem';
import type {
  ApiError,
  UpdatePasswordResponse,
  UpdateProfileResponse,
  UpdateProfilePictureResponse,
  UpdateCardResponse,
  MyOrdersResponse,
} from '../types';
import { mustBe } from '../utils/utils';
import { setCurrency } from '../utils/currency';

export const ACCOUNT_UPDATE_PASSWORD_REQUESTING: 'ACCOUNT_UPDATE_PASSWORD_REQUESTING' = `ACCOUNT_UPDATE_PASSWORD_REQUESTING`;
export const ACCOUNT_UPDATE_PASSWORD_SUCCESS: 'ACCOUNT_UPDATE_PASSWORD_SUCCESS' = `ACCOUNT_UPDATE_PASSWORD_SUCCESS`;
export const ACCOUNT_UPDATE_PASSWORD_FAILURE: 'ACCOUNT_UPDATE_PASSWORD_FAILURE' = `ACCOUNT_UPDATE_PASSWORD_FAILURE`;

export const ACCOUNT_UPDATE_PROFILE_REQUESTING: 'ACCOUNT_UPDATE_PROFILE_REQUESTING' = `ACCOUNT_UPDATE_PROFILE_REQUESTING`;
export const ACCOUNT_UPDATE_PROFILE_SUCCESS: 'ACCOUNT_UPDATE_PROFILE_SUCCESS' = `ACCOUNT_UPDATE_PROFILE_SUCCESS`;
export const ACCOUNT_UPDATE_PROFILE_FAILURE: 'ACCOUNT_UPDATE_PROFILE_FAILURE' = `ACCOUNT_UPDATE_PROFILE_FAILURE`;

export const ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING: 'ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING' = `ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING`;
export const ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS: 'ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS' = `ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS`;
export const ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE: 'ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE' = `ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE`;

export const ACCOUNT_UPDATE_CARD_REQUESTING: 'ACCOUNT_UPDATE_CARD_REQUESTING' = `ACCOUNT_UPDATE_CARD_REQUESTING`;
export const ACCOUNT_UPDATE_CARD_SUCCESS: 'ACCOUNT_UPDATE_CARD_SUCCESS' = `ACCOUNT_UPDATE_CARD_SUCCESS`;
export const ACCOUNT_UPDATE_CARD_FAILURE: 'ACCOUNT_UPDATE_CARD_FAILURE' = `ACCOUNT_UPDATE_CARD_FAILURE`;

export const ACCOUNT_FETCH_ORDERS_REQUESTING: 'ACCOUNT_FETCH_ORDERS_REQUESTING' = `ACCOUNT_FETCH_ORDERS_REQUESTING`;
export const ACCOUNT_FETCH_ORDERS_SUCCESS: 'ACCOUNT_FETCH_ORDERS_SUCCESS' = `ACCOUNT_FETCH_ORDERS_SUCCESS`;
export const ACCOUNT_FETCH_ORDERS_FAILURE: 'ACCOUNT_FETCH_ORDERS_FAILURE' = `ACCOUNT_FETCH_ORDERS_FAILURE`;

type UpdatePasswordRequesting = {|
  type: typeof ACCOUNT_UPDATE_PASSWORD_REQUESTING,
|};
type UpdatePasswordSuccess = {|
  type: typeof ACCOUNT_UPDATE_PASSWORD_SUCCESS,
|};
type UpdatePasswordFailure = {|
  type: typeof ACCOUNT_UPDATE_PASSWORD_FAILURE,
  payload: {
    reason: string,
  },
|};

type UpdateProfileRequesting = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_REQUESTING,
|};
type UpdateProfileSuccess = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_SUCCESS,
  payload: {
    user: User,
  },
|};
type UpdateProfileFailure = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_FAILURE,
  payload: {
    reason: string,
  },
|};

type UpdateProfilePictureRequesting = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING,
|};
type UpdateProfilePictureSuccess = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS,
  payload: {
    profilePicture: string,
  },
|};
type UpdateProfilePictureFailure = {|
  type: typeof ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE,
  payload: {
    reason: string,
  },
|};

type UpdateCardRequesting = {|
  type: typeof ACCOUNT_UPDATE_CARD_REQUESTING,
|};
type UpdateCardSuccess = {|
  type: typeof ACCOUNT_UPDATE_CARD_SUCCESS,
  payload: {
    creditCardInfo: CreditCardInfo,
  },
|};
type UpdateCardFailure = {|
  type: typeof ACCOUNT_UPDATE_CARD_FAILURE,
  payload: {
    reason: string,
  },
|};

type FetchOrdersRequesting = {|
  type: typeof ACCOUNT_FETCH_ORDERS_REQUESTING,
|};
type FetchOrdersSuccess = {|
  type: typeof ACCOUNT_FETCH_ORDERS_SUCCESS,
  payload: {
    orders: OrderListItem[],
  },
|};
type FetchOrdersFailure = {|
  type: typeof ACCOUNT_FETCH_ORDERS_FAILURE,
  payload: {
    reason: string,
  },
|};

export type AccountAction =
  | UpdatePasswordRequesting
  | UpdatePasswordSuccess
  | UpdatePasswordFailure
  | UpdateProfileRequesting
  | UpdateProfileSuccess
  | UpdateProfileFailure
  | UpdateProfilePictureRequesting
  | UpdateProfilePictureSuccess
  | UpdateProfilePictureFailure
  | UpdateCardRequesting
  | UpdateCardSuccess
  | UpdateCardFailure
  | FetchOrdersRequesting
  | FetchOrdersSuccess
  | FetchOrdersFailure;

function updatePasswordRequestingAction(): UpdatePasswordRequesting {
  return {
    type: ACCOUNT_UPDATE_PASSWORD_REQUESTING,
  };
}

function updatePasswordSuccessAction(): UpdatePasswordSuccess {
  return {
    type: ACCOUNT_UPDATE_PASSWORD_SUCCESS,
  };
}

function updatePasswordFailureAction(reason: string): UpdatePasswordFailure {
  return {
    type: ACCOUNT_UPDATE_PASSWORD_FAILURE,
    payload: {
      reason,
    },
  };
}

export function updatePassword(
  currentPassword: string,
  newPassword: string
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(updatePasswordRequestingAction());
    apiClient
      .updatePassword(currentPassword, newPassword)
      .then((response: UpdatePasswordResponse) => {
        if (response.accessToken) {
          dispatch(updatePasswordSuccessAction());
          dispatch(push('/account'));
        }
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case skygear.ErrorCodes.InvalidCredentials:
            errorKey = 'account.update_password.error.wrong_password';
            break;
          default:
            errorKey = error.message;
        }

        dispatch(updatePasswordFailureAction(errorKey));
      });
  };
}

function updateProfileRequestingAction(): UpdateProfileRequesting {
  return {
    type: ACCOUNT_UPDATE_PROFILE_REQUESTING,
  };
}

function updateProfileSuccessAction(user: User): UpdateProfileSuccess {
  return {
    type: ACCOUNT_UPDATE_PROFILE_SUCCESS,
    payload: {
      user,
    },
  };
}

function updateProfileFailureAction(reason: string): UpdateProfileFailure {
  return {
    type: ACCOUNT_UPDATE_PROFILE_FAILURE,
    payload: {
      reason,
    },
  };
}

export function updateProfile(
  updateUser: UpdateUser
): (Dispatch, GetState) => Promise<void> {
  return (dispatch: Dispatch, getState: GetState) => {
    const { auth: { user: oldUser } } = getState();
    if (oldUser == null) {
      dispatch(updateProfileFailureAction('User is not logged in'));

      return Promise.resolve();
    }

    dispatch(updateProfileRequestingAction());
    return apiClient
      .updateProfile(oldUser, updateUser)
      .then((response: UpdateProfileResponse) => {
        dispatch(updateProfileSuccessAction(response.user));
        setCurrency(response.user.defaultCurrency);
      })
      .catch((error: ApiError) => {
        let errorKey = '';
        switch (error.code) {
          case ERR_MISSING_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.missing';
            break;
          case ERR_INVALID_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.invalid';
            break;
          default:
            errorKey = error.message;
        }

        dispatch(updateProfileFailureAction(errorKey));
      });
  };
}

function updateProfilePictureRequestingAction(): UpdateProfilePictureRequesting {
  return {
    type: ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING,
  };
}

function updateProfilePictureSuccessAction(
  profilePicture: string
): UpdateProfilePictureSuccess {
  return {
    type: ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS,
    payload: {
      profilePicture,
    },
  };
}

function updateProfilePictureFailureAction(
  reason: string
): UpdateProfilePictureFailure {
  return {
    type: ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE,
    payload: {
      reason,
    },
  };
}

export function updateProfilePicture(file: File): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(updateProfilePictureRequestingAction());
    apiClient
      .updateProfilePicture(file)
      .then((response: UpdateProfilePictureResponse) => {
        const { user: { profilePicture } } = response;
        dispatch(updateProfilePictureSuccessAction(mustBe(profilePicture)));
      })
      .catch((error: ApiError) => {
        const errorKey = error.message;
        dispatch(updateProfilePictureFailureAction(errorKey));
      });
  };
}

function updateCardRequestingAction(): UpdateCardRequesting {
  return {
    type: ACCOUNT_UPDATE_CARD_REQUESTING,
  };
}

function updateCardSuccessAction(
  creditCardInfo: CreditCardInfo
): UpdateCardSuccess {
  return {
    type: ACCOUNT_UPDATE_CARD_SUCCESS,
    payload: {
      creditCardInfo,
    },
  };
}

function updateCardFailureAction(reason: string): UpdateCardFailure {
  return {
    type: ACCOUNT_UPDATE_CARD_FAILURE,
    payload: {
      reason,
    },
  };
}

export function updateCard(card: CreditCard): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(updateCardRequestingAction());
    apiClient
      .updateCard(card)
      .then((response: UpdateCardResponse) => {
        const { creditCardInfo } = response;
        dispatch(updateCardSuccessAction(creditCardInfo));
      })
      .catch((error: ApiError) => {
        const errorKey = error.message;
        dispatch(updateCardFailureAction(errorKey));
      });
  };
}

function fetchOrdersRequestingAction(): FetchOrdersRequesting {
  return {
    type: ACCOUNT_FETCH_ORDERS_REQUESTING,
  };
}

function fetchOrdersSuccessAction(orders: OrderListItem[]): FetchOrdersSuccess {
  return {
    type: ACCOUNT_FETCH_ORDERS_SUCCESS,
    payload: {
      orders,
    },
  };
}

function fetchOrdersFailureAction(reason: string): FetchOrdersFailure {
  return {
    type: ACCOUNT_FETCH_ORDERS_FAILURE,
    payload: {
      reason,
    },
  };
}

export function fetchOrders(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(fetchOrdersRequestingAction());
    apiClient
      .fetchMyOrders()
      .then((response: MyOrdersResponse) => {
        dispatch(fetchOrdersSuccessAction(response.orders));
      })
      .catch((error: ApiError) => {
        dispatch(fetchOrdersFailureAction(error.message));
      });
  };
}
