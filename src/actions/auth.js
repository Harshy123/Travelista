// @flow

import { push, replace } from 'connected-react-router';
import apiClient from '../api';
import { setCurrency } from '../utils/currency';
import { clearToastr } from '../utils/toastr';
import {
  ERR_INVALID_CREDENTIALS,
  ERR_RESOURCE_NOT_FOUND,
  ERR_DUPLICATED,
  ERR_MISSING_PARTNER_CODE,
  ERR_INVALID_PARTNER_CODE,
  ERR_INVALID_ARGUMENT,
  ERR_UNEXPECTED_ERROR,
} from '../utils/apiError';
import type { Dispatch } from '../types/Dispatch';
import type {
  ApiError,
  SigninResponse,
  SignupResponse,
  OauthProvider,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '../types';
import type { User } from '../models/User';
import type { UserInfo } from '../models/UserInfo';

export const AUTH_WHOAMI_REQUESTING: 'AUTH_WHOAMI_REQUESTING' = `AUTH_WHOAMI_REQUESTING`;
export const AUTH_WHOAMI_SUCCESS: 'AUTH_WHOAMI_SUCCESS' = `AUTH_WHOAMI_SUCCESS`;
export const AUTH_WHOAMI_FAILURE: 'AUTH_WHOAMI_FAILURE' = `AUTH_WHOAMI_FAILURE`;

export const AUTH_SIGNIN_REQUESTING: 'AUTH_SIGNIN_REQUESTING' = `AUTH_SIGNIN_REQUESTING`;
export const AUTH_SIGNIN_SUCCESS: 'AUTH_SIGNIN_SUCCESS' = `AUTH_SIGNIN_SUCCESS`;
export const AUTH_SIGNIN_FAILURE: 'AUTH_SIGNIN_FAILURE' = `AUTH_SIGNIN_FAILURE`;

export const AUTH_SIGNUP_REQUESTING: 'AUTH_SIGNUP_REQUESTING' = `AUTH_SIGNUP_REQUESTING`;
export const AUTH_SIGNUP_SUCCESS: 'AUTH_SIGNUP_SUCCESS' = `AUTH_SIGNUP_SUCCESS`;
export const AUTH_SIGNUP_FAILURE: 'AUTH_SIGNUP_FAILURE' = `AUTH_SIGNUP_FAILURE`;

export const AUTH_COMPLETE_SIGNUP_REQUESTING: 'AUTH_COMPLETE_SIGNUP_REQUESTING' = `AUTH_COMPLETE_SIGNUP_REQUESTING`;
export const AUTH_COMPLETE_SIGNUP_SUCCESS: 'AUTH_COMPLETE_SIGNUP_SUCCESS' = `AUTH_COMPLETE_SIGNUP_SUCCESS`;
export const AUTH_COMPLETE_SIGNUP_FAILURE: 'AUTH_COMPLETE_SIGNUP_FAILURE' = `AUTH_COMPLETE_SIGNUP_FAILURE`;

export const AUTH_OAUTH_LOGIN_REQUESTING: 'AUTH_OAUTH_LOGIN_REQUESTING' = `AUTH_OAUTH_LOGIN_REQUESTING`;
export const AUTH_OAUTH_LOGIN_SUCCESS: 'AUTH_OAUTH_LOGIN_SUCCESS' = `AUTH_OAUTH_LOGIN_SUCCESS`;
export const AUTH_OAUTH_LOGIN_FAILURE: 'AUTH_OAUTH_LOGIN_FAILURE' = `AUTH_OAUTH_LOGIN_FAILURE`;

export const AUTH_FORGOT_PASSWORD_REQUESTING: 'AUTH_FORGOT_PASSWORD_REQUESTING' = `AUTH_FORGOT_PASSWORD_REQUESTING`;
export const AUTH_FORGOT_PASSWORD_SUCCESS: 'AUTH_FORGOT_PASSWORD_SUCCESS' = `AUTH_FORGOT_PASSWORD_SUCCESS`;
export const AUTH_FORGOT_PASSWORD_FAILURE: 'AUTH_FORGOT_PASSWORD_FAILURE' = `AUTH_FORGOT_PASSWORD_FAILURE`;

export const AUTH_RESET_PASSWORD_REQUESTING: 'AUTH_RESET_PASSWORD_REQUESTING' = `AUTH_RESET_PASSWORD_REQUESTING`;
export const AUTH_RESET_PASSWORD_SUCCESS: 'AUTH_RESET_PASSWORD_SUCCESS' = `AUTH_RESET_PASSWORD_SUCCESS`;
export const AUTH_RESET_PASSWORD_FAILURE: 'AUTH_RESET_PASSWORD_FAILURE' = `AUTH_RESET_PASSWORD_FAILURE`;

export const AUTH_SET_SIGNUP_INFO: 'AUTH_SET_SIGNUP_INFO' = `AUTH_SET_SIGNUP_INFO`;
export const AUTH_SET_PARTNER_CODE: 'AUTH_SET_PARTNER_CODE' = `AUTH_SET_PARTNER_CODE`;
export const AUTH_FLUSH_PARTNER_CODE: 'AUTH_FLUSH_PARTNER_CODE' = `AUTH_FLUSH_PARTNER_CODE`;

export const AUTH_SIGNOUT: 'AUTH_SIGNOUT' = `AUTH_SIGNOUT`;

type AuthWhoamiRequesting = {|
  type: typeof AUTH_WHOAMI_REQUESTING,
|};
type AuthWhoamiSuccess = {|
  type: typeof AUTH_WHOAMI_SUCCESS,
  payload: {
    accessToken: string,
    user: User,
  },
|};
type AuthWhoamiFailure = {|
  type: typeof AUTH_WHOAMI_FAILURE,
  payload: {
    reason: string,
  },
|};

type AuthSigninRequesting = {|
  type: typeof AUTH_SIGNIN_REQUESTING,
|};
type AuthSigninSuccess = {|
  type: typeof AUTH_SIGNIN_SUCCESS,
  payload: {
    accessToken: string,
    user: User,
  },
|};
type AuthSigninFailure = {|
  type: typeof AUTH_SIGNIN_FAILURE,
  payload: {
    reason: string,
  },
|};

type AuthSignupRequesting = {|
  type: typeof AUTH_SIGNUP_REQUESTING,
|};
type AuthSignupSuccess = {|
  type: typeof AUTH_SIGNUP_SUCCESS,
  payload: {
    accessToken: string,
    user: User,
  },
|};
type AuthSignupFailure = {|
  type: typeof AUTH_SIGNUP_FAILURE,
  payload: {
    reason: string,
  },
|};

type AuthCompleteSignupRequesting = {|
  type: typeof AUTH_COMPLETE_SIGNUP_REQUESTING,
|};
type AuthCompleteSignupSuccess = {|
  type: typeof AUTH_COMPLETE_SIGNUP_SUCCESS,
  payload: {
    accessToken: string,
    user: User,
  },
|};
type AuthCompleteSignupFailure = {|
  type: typeof AUTH_COMPLETE_SIGNUP_FAILURE,
  payload: {
    reason: string,
  },
|};

type AuthOauthLoginRequesting = {|
  type: typeof AUTH_OAUTH_LOGIN_REQUESTING,
|};
type AuthOauthLoginSuccess = {|
  type: typeof AUTH_OAUTH_LOGIN_SUCCESS,
  payload: {
    accessToken: string,
    user: User,
  },
|};
type AuthOauthLoginFailure = {|
  type: typeof AUTH_OAUTH_LOGIN_FAILURE,
  payload: {
    reason: string,
  },
|};

type ForgotPasswordRequesting = {|
  type: typeof AUTH_FORGOT_PASSWORD_REQUESTING,
|};
type ForgotPasswordSuccess = {|
  type: typeof AUTH_FORGOT_PASSWORD_SUCCESS,
|};
type ForgotPasswordFailure = {|
  type: typeof AUTH_FORGOT_PASSWORD_FAILURE,
  payload: {
    reason: string,
  },
|};

type ResetPasswordRequesting = {|
  type: typeof AUTH_RESET_PASSWORD_REQUESTING,
|};
type ResetPasswordSuccess = {|
  type: typeof AUTH_RESET_PASSWORD_SUCCESS,
|};
type ResetPasswordFailure = {|
  type: typeof AUTH_RESET_PASSWORD_FAILURE,
  payload: {
    reason: string,
  },
|};

type AuthSetSignupInfo = {|
  type: typeof AUTH_SET_SIGNUP_INFO,
  payload: {
    email: string,
    partnerCode: ?string,
  },
|};
type AuthSetPartnerCode = {
  type: typeof AUTH_SET_PARTNER_CODE,
  payload: {
    partnerCode: string,
  },
};
type AuthFlushPartnerCode = {
  type: typeof AUTH_FLUSH_PARTNER_CODE,
};

type AuthSignout = {|
  type: typeof AUTH_SIGNOUT,
|};

export type AuthAction =
  | AuthWhoamiRequesting
  | AuthWhoamiSuccess
  | AuthWhoamiFailure
  | AuthSigninRequesting
  | AuthSigninSuccess
  | AuthSigninFailure
  | AuthSignupRequesting
  | AuthSignupSuccess
  | AuthSignupFailure
  | AuthCompleteSignupRequesting
  | AuthCompleteSignupSuccess
  | AuthCompleteSignupFailure
  | AuthOauthLoginRequesting
  | AuthOauthLoginSuccess
  | AuthOauthLoginFailure
  | ForgotPasswordRequesting
  | ForgotPasswordSuccess
  | ForgotPasswordFailure
  | ResetPasswordRequesting
  | ResetPasswordSuccess
  | ResetPasswordFailure
  | AuthSetSignupInfo
  | AuthSetPartnerCode
  | AuthFlushPartnerCode
  | AuthSignout;

function whoamiRequestingAction(): AuthWhoamiRequesting {
  return {
    type: AUTH_WHOAMI_REQUESTING,
  };
}

function whoamiSuccessAction(
  accessToken: string,
  user: User
): AuthWhoamiSuccess {
  return {
    type: AUTH_WHOAMI_SUCCESS,
    payload: {
      accessToken,
      user,
    },
  };
}

function whoamiFailureAction(reason: string): AuthWhoamiFailure {
  return {
    type: AUTH_WHOAMI_FAILURE,
    payload: {
      reason,
    },
  };
}

function signinRequestingAction(): AuthSigninRequesting {
  return {
    type: AUTH_SIGNIN_REQUESTING,
  };
}

function signinSuccessAction(
  accessToken: string,
  user: User
): AuthSigninSuccess {
  setCurrency(user.defaultCurrency);
  return {
    type: AUTH_SIGNIN_SUCCESS,
    payload: {
      accessToken,
      user,
    },
  };
}

function signinFailureAction(reason: string): AuthSigninFailure {
  return {
    type: AUTH_SIGNIN_FAILURE,
    payload: {
      reason,
    },
  };
}

function signupRequestingAction(): AuthSignupRequesting {
  return {
    type: AUTH_SIGNUP_REQUESTING,
  };
}

function signupSuccessAction(
  accessToken: string,
  user: User
): AuthSignupSuccess {
  return {
    type: AUTH_SIGNUP_SUCCESS,
    payload: {
      accessToken,
      user,
    },
  };
}

function signupFailureAction(reason: string): AuthSignupFailure {
  return {
    type: AUTH_SIGNUP_FAILURE,
    payload: {
      reason,
    },
  };
}

function completeSignupRequestingAction(): AuthCompleteSignupRequesting {
  return {
    type: AUTH_COMPLETE_SIGNUP_REQUESTING,
  };
}

function completeSignupSuccessAction(
  accessToken: string,
  user: User
): AuthCompleteSignupSuccess {
  return {
    type: AUTH_COMPLETE_SIGNUP_SUCCESS,
    payload: {
      accessToken,
      user,
    },
  };
}

function completeSignupFailureAction(
  reason: string
): AuthCompleteSignupFailure {
  return {
    type: AUTH_COMPLETE_SIGNUP_FAILURE,
    payload: {
      reason,
    },
  };
}

export function setSignupInfo(
  email: string,
  partnerCode: ?string
): AuthSetSignupInfo {
  return {
    type: AUTH_SET_SIGNUP_INFO,
    payload: {
      email,
      partnerCode,
    },
  };
}

function setPartnerCodeAction(partnerCode: string): AuthSetPartnerCode {
  return {
    type: AUTH_SET_PARTNER_CODE,
    payload: {
      partnerCode,
    },
  };
}

export function flushPartnerCode(): AuthFlushPartnerCode {
  return {
    type: AUTH_FLUSH_PARTNER_CODE,
  };
}

function oauthLoginRequestingAction(): AuthOauthLoginRequesting {
  return {
    type: AUTH_OAUTH_LOGIN_REQUESTING,
  };
}

function oauthLoginSuccessAction(
  accessToken: string,
  user: User
): AuthOauthLoginSuccess {
  return {
    type: AUTH_OAUTH_LOGIN_SUCCESS,
    payload: {
      accessToken,
      user,
    },
  };
}

function oauthLoginFailureAction(reason: string): AuthOauthLoginFailure {
  return {
    type: AUTH_OAUTH_LOGIN_FAILURE,
    payload: {
      reason,
    },
  };
}

function forgotPasswordRequestingAction(): ForgotPasswordRequesting {
  return {
    type: AUTH_FORGOT_PASSWORD_REQUESTING,
  };
}

function forgotPasswordSuccessAction(): ForgotPasswordSuccess {
  return {
    type: AUTH_FORGOT_PASSWORD_SUCCESS,
  };
}

function forgotPasswordFailureAction(reason: string): ForgotPasswordFailure {
  return {
    type: AUTH_FORGOT_PASSWORD_FAILURE,
    payload: {
      reason,
    },
  };
}

function resetPasswordRequestingAction(): ResetPasswordRequesting {
  return {
    type: AUTH_RESET_PASSWORD_REQUESTING,
  };
}

function resetPasswordSuccessAction(): ResetPasswordSuccess {
  return {
    type: AUTH_RESET_PASSWORD_SUCCESS,
  };
}

function resetPasswordFailureAction(reason: string): ResetPasswordFailure {
  return {
    type: AUTH_RESET_PASSWORD_FAILURE,
    payload: {
      reason,
    },
  };
}

function signoutAction(): AuthSignout {
  return {
    type: AUTH_SIGNOUT,
  };
}

export function signout(): Dispatch => void {
  return (dispatch: Dispatch) => {
    apiClient.signout().then(() => {
      clearToastr();
      dispatch(signoutAction());
      dispatch(replace('/'));
      dispatch(whoami());
      localStorage.removeItem('ht_users');
    });
  };
}

export function whoami(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(whoamiRequestingAction());
    apiClient
      .whoami()
      .then((response: SigninResponse) => {
        dispatch(whoamiSuccessAction(response.accessToken, response.user));
        setCurrency(localStorage.getItem('ht_currency') || 'HKD');
      })
      .catch((error: ApiError) => {
        dispatch(whoamiFailureAction(error.message));
      });
  };
}

export function signin(email: string, password: string): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(signinRequestingAction());
    apiClient
      .signin(email, password)
      .then((response: SigninResponse) => {
        dispatch(signinSuccessAction(response.accessToken, response.user));
        setCurrency(response.user.defaultCurrency);
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_INVALID_CREDENTIALS:
          case ERR_RESOURCE_NOT_FOUND:
            errorKey = 'auth.signin.error';
            break;
          default:
            errorKey = error.message;
        }
        dispatch(signinFailureAction(errorKey));
      });
  };
}

export function signup(
  email: string,
  password: string,
  userInfo: UserInfo
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(signupRequestingAction());
    apiClient
      .signup(email, password, userInfo)
      .then((response: SignupResponse) => {
        dispatch(signupSuccessAction(response.accessToken, response.user));
        setCurrency(response.user.defaultCurrency, false);
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_DUPLICATED:
            errorKey = 'auth.signup.error';
            break;
          case ERR_MISSING_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.missing';
            break;
          case ERR_INVALID_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.invalid';
            break;
          default:
            errorKey = error.message;
        }

        dispatch(signupFailureAction(errorKey));
      });
  };
}

export function completeSignup(
  id: string,
  userInfo: UserInfo
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(completeSignupRequestingAction());
    apiClient
      .completeSignup(id, userInfo)
      .then((response: SignupResponse) => {
        dispatch(
          completeSignupSuccessAction(response.accessToken, response.user)
        );
        setCurrency(response.user.defaultCurrency, false);
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_DUPLICATED:
            errorKey = 'auth.signup.error';
            break;
          case ERR_MISSING_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.missing';
            break;
          case ERR_INVALID_PARTNER_CODE:
            errorKey = 'auth.signup.partner_code.invalid';
            break;
          default:
            errorKey = error.message;
        }

        dispatch(completeSignupFailureAction(errorKey));
      });
  };
}

export function oauthLogin(provider: OauthProvider): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(oauthLoginRequestingAction());
    apiClient
      .oauthLogin(provider)
      .then((response: SignupResponse) => {
        dispatch(oauthLoginSuccessAction(response.accessToken, response.user));
        if (!response.user.signupCompleted) {
          dispatch(push('/complete_signup'));
        }
        setCurrency(response.user.defaultCurrency);
      })
      .catch((error: ApiError) => {
        dispatch(oauthLoginFailureAction(error.message));
      });
  };
}

export function forgotPassword(email: string): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(forgotPasswordRequestingAction());
    apiClient
      .forgotPassword(email)
      .then((response: ForgotPasswordResponse) => {
        dispatch(forgotPasswordSuccessAction());
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_INVALID_ARGUMENT:
            errorKey = 'auth.forgot_password.email.invalid';
            break;
          default:
            errorKey = error.message;
        }
        dispatch(forgotPasswordFailureAction(errorKey));
      });
  };
}

export function resetPassword(
  userID: string,
  code: string,
  expireAt: number,
  newPassword: string
): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(resetPasswordRequestingAction());
    apiClient
      .resetPassword(userID, code, expireAt, newPassword)
      .then((response: ResetPasswordResponse) => {
        dispatch(resetPasswordSuccessAction());
        dispatch(signout());
      })
      .catch((error: ApiError) => {
        // locale key shall be store in state
        let errorKey = '';
        switch (error.code) {
          case ERR_UNEXPECTED_ERROR:
          case ERR_RESOURCE_NOT_FOUND:
            errorKey = 'auth.reset_password.url_invalid';
            break;
          default:
            errorKey = error.message;
        }
        dispatch(resetPasswordFailureAction(errorKey));
      });
  };
}

export function setPartnerCode(partnerCode: string): Dispatch => Promise<void> {
  return (dispatch: Dispatch) => {
    return apiClient
      .validatePartnerCode(partnerCode)
      .then(() => {
        dispatch(setPartnerCodeAction(partnerCode));
      })
      .catch((error: ApiError) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };
}
