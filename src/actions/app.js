// @flow
import { push } from 'connected-react-router';
import type { ServerState } from '../models/ServerState';
import type { Experience } from '../models/Experience';
import type { Dispatch, GetState } from '../types/Dispatch';
import type { ApiError, AllExperiencesResponse } from '../types';
import type { Context } from '../states/app';
import apiClient from '../api';
import { setCurrency } from '../utils/currency';

export const APP_SET_SIDE_MENU_STATE: 'APP_SET_SIDE_MENU_STATE' = `APP_SET_SIDE_MENU_STATE`;

export const APP_OPEN_AUTH_MODAL: 'APP_OPEN_AUTH_MODAL' = `APP_OPEN_AUTH_MODAL`;
export const APP_CLOSE_AUTH_MODAL: 'APP_CLOSE_AUTH_MODAL' = `APP_CLOSE_AUTH_MODAL`;
export const APP_SWITCH_AUTH_MODAL_MODE: 'APP_SWITCH_AUTH_MODAL_MODE' = `APP_SWITCH_AUTH_MODAL_MODE`;

export const APP_SAVE_CONTEXT: 'APP_SAVE_CONTEXT' = `APP_SAVE_CONTEXT`;
export const APP_RESUME_CONTEXT: 'APP_RESUME_CONTEXT' = `APP_RESUME_CONTEXT`;
export const APP_CHANGE_CURRENCY: 'APP_CHANGE_CURRENCY' = `APP_CHANGE_CURRENCY`;

export const APP_OPEN_UPDATE_CARD_MODAL: 'APP_OPEN_UPDATE_CARD_MODAL' = `APP_OPEN_UPDATE_CARD_MODAL`;
export const APP_CLOSE_UPDATE_CARD_MODAL: 'APP_CLOSE_UPDATE_CARD_MODAL' = `APP_CLOSE_UPDATE_CARD_MODAL`;

export const APP_SERVER_STATE_REQUESTING: 'APP_SERVER_STATE_REQUESTING' = `APP_SERVER_STATE_REQUESTING`;
export const APP_SERVER_STATE_SUCCESS: 'APP_SERVER_STATE_SUCCESS' = `APP_SERVER_STATE_SUCCESS`;
export const APP_SERVER_STATE_FAILURE: 'APP_SERVER_STATE_FAILURE' = `APP_SERVER_STATE_FAILURE`;

export const APP_EXPERIENCES_REQUESTING: 'APP_EXPERIENCES_REQUESTING' = `APP_EXPERIENCES_REQUESTING`;
export const APP_EXPERIENCES_SUCCESS: 'APP_EXPERIENCES_SUCCESS' = `APP_EXPERIENCES_SUCCESS`;
export const APP_EXPERIENCES_FAILURE: 'APP_EXPERIENCES_FAILURE' = `APP_EXPERIENCES_FAILURE`;

type AppSetSideMenuState = {|
  type: typeof APP_SET_SIDE_MENU_STATE,
  payload: {
    isOpen: boolean,
  },
|};

type AppOpenAuthModal = {|
  type: typeof APP_OPEN_AUTH_MODAL,
  payload: {
    mode: 'signin' | 'signup',
  },
|};
type AppCloseAuthModal = {|
  type: typeof APP_CLOSE_AUTH_MODAL,
|};
type AppSwitchAuthModalMode = {|
  type: typeof APP_SWITCH_AUTH_MODAL_MODE,
  payload: {
    mode: 'signin' | 'signup',
  },
|};

type AppSaveContext = {
  type: typeof APP_SAVE_CONTEXT,
  payload: {
    context: Context,
  },
};
type AppResumeContext = {
  type: typeof APP_RESUME_CONTEXT,
};
type AppChangeCurrency = {
  type: typeof APP_CHANGE_CURRENCY,
  payload: {
    currency: string,
  },
};

type AppOpenUpdateCardModal = {
  type: typeof APP_OPEN_UPDATE_CARD_MODAL,
};
type AppCloseUpdateCardModal = {
  type: typeof APP_CLOSE_UPDATE_CARD_MODAL,
};

type AppServerStateRequesting = {|
  type: typeof APP_SERVER_STATE_REQUESTING,
|};
type AppServerStateSuccess = {|
  type: typeof APP_SERVER_STATE_SUCCESS,
  payload: {
    serverState: ServerState,
  },
|};
type AppServerStateFailure = {|
  type: typeof APP_SERVER_STATE_FAILURE,
  payload: {
    reason: string,
  },
|};

type AppExperiencesRequesting = {|
  type: typeof APP_EXPERIENCES_REQUESTING,
|};
type AppExperiencesSuccess = {|
  type: typeof APP_EXPERIENCES_SUCCESS,
  payload: {
    experiences: Experience[],
  },
|};
type AppExperiencesFailure = {|
  type: typeof APP_EXPERIENCES_FAILURE,
  payload: {
    reason: string,
  },
|};

export type AppAction =
  | AppSetSideMenuState
  | AppOpenAuthModal
  | AppCloseAuthModal
  | AppSwitchAuthModalMode
  | AppSaveContext
  | AppResumeContext
  | AppChangeCurrency
  | AppOpenUpdateCardModal
  | AppCloseUpdateCardModal
  | AppServerStateRequesting
  | AppServerStateSuccess
  | AppServerStateFailure
  | AppExperiencesRequesting
  | AppExperiencesSuccess
  | AppExperiencesFailure;

export function setSideMenuState(isOpen: boolean): AppSetSideMenuState {
  return {
    type: APP_SET_SIDE_MENU_STATE,
    payload: {
      isOpen,
    },
  };
}

export function openAuthModal(mode: 'signin' | 'signup'): AppOpenAuthModal {
  return {
    type: APP_OPEN_AUTH_MODAL,
    payload: {
      mode,
    },
  };
}

export function closeAuthModal(): AppCloseAuthModal {
  return {
    type: APP_CLOSE_AUTH_MODAL,
  };
}

export function switchAuthModalMode(
  mode: 'signin' | 'signup'
): AppSwitchAuthModalMode {
  return {
    type: APP_SWITCH_AUTH_MODAL_MODE,
    payload: {
      mode,
    },
  };
}

export function saveContext(context: Context): AppSaveContext {
  return {
    type: APP_SAVE_CONTEXT,
    payload: {
      context,
    },
  };
}

function resumeContextAction(): AppResumeContext {
  return {
    type: APP_RESUME_CONTEXT,
  };
}

function changeCurrencyAction(currency: string): AppChangeCurrency {
  return {
    type: APP_CHANGE_CURRENCY,
    payload: {
      currency,
    },
  };
}

export function openUpdateCardModal(): AppOpenUpdateCardModal {
  return {
    type: APP_OPEN_UPDATE_CARD_MODAL,
  };
}

export function closeUpdateCardModal(): AppCloseUpdateCardModal {
  return {
    type: APP_CLOSE_UPDATE_CARD_MODAL,
  };
}

function serverStateRequestingAction(): AppServerStateRequesting {
  return {
    type: APP_SERVER_STATE_REQUESTING,
  };
}

function serverStateSuccessAction(
  serverState: ServerState
): AppServerStateSuccess {
  return {
    type: APP_SERVER_STATE_SUCCESS,
    payload: {
      serverState,
    },
  };
}

function serverStateFailureAction(reason: string): AppServerStateFailure {
  return {
    type: APP_SERVER_STATE_FAILURE,
    payload: {
      reason,
    },
  };
}

function experiencesRequestingAction(): AppExperiencesRequesting {
  return {
    type: APP_EXPERIENCES_REQUESTING,
  };
}

function experiencesSuccessAction(
  experiences: Array<Experience>
): AppExperiencesSuccess {
  return {
    type: APP_EXPERIENCES_SUCCESS,
    payload: {
      experiences,
    },
  };
}

function experiencesFailureAction(reason: string): AppExperiencesFailure {
  return {
    type: APP_EXPERIENCES_FAILURE,
    payload: {
      reason,
    },
  };
}

export function fetchServerState(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(serverStateRequestingAction());
    apiClient
      .fetchServerState()
      .then((serverState: ServerState) => {
        dispatch(serverStateSuccessAction(serverState));
      })
      .catch((error: ApiError) => {
        dispatch(serverStateFailureAction(error.message));
      });
  };
}

export function fetchAllExperiences(): Dispatch => void {
  return (dispatch: Dispatch) => {
    dispatch(experiencesRequestingAction());
    apiClient
      .fetchAllExperiences()
      .then((response: AllExperiencesResponse) => {
        dispatch(experiencesSuccessAction(response));
      })
      .catch((error: ApiError) => {
        dispatch(experiencesFailureAction(error.message));
      });
  };
}

export function resumeContext(): (Dispatch, GetState) => void {
  return (dispatch: Dispatch, getState: GetState) => {
    const { app: { context } } = getState();
    if (context.path) {
      dispatch(push(context.path));
    } else {
      dispatch(push('/'));
    }
    dispatch(resumeContextAction());
  };
}

export function changeCurrency(currency: string): (Dispatch, GetState) => void {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(changeCurrencyAction(currency));
    setCurrency(currency);
  };
}
