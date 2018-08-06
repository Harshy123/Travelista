// @flow

import {
  APP_SWITCH_AUTH_MODAL_MODE,
  APP_OPEN_AUTH_MODAL,
  APP_CLOSE_AUTH_MODAL,
  APP_SAVE_CONTEXT,
  APP_RESUME_CONTEXT,
  APP_CHANGE_CURRENCY,
  APP_OPEN_UPDATE_CARD_MODAL,
  APP_CLOSE_UPDATE_CARD_MODAL,
  APP_SERVER_STATE_REQUESTING,
  APP_SERVER_STATE_SUCCESS,
  APP_SERVER_STATE_FAILURE,
  APP_EXPERIENCES_REQUESTING,
  APP_EXPERIENCES_SUCCESS,
  APP_EXPERIENCES_FAILURE,
  APP_SET_SIDE_MENU_STATE,
} from '../actions/app';
import {
  AUTH_WHOAMI_SUCCESS,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNUP_SUCCESS,
  AUTH_COMPLETE_SIGNUP_SUCCESS,
  AUTH_OAUTH_LOGIN_SUCCESS,
  AUTH_WHOAMI_FAILURE,
  AUTH_SIGNIN_FAILURE,
  AUTH_SIGNUP_FAILURE,
  AUTH_COMPLETE_SIGNUP_FAILURE,
  AUTH_OAUTH_LOGIN_FAILURE,
} from '../actions/auth';
import { emptySeverState } from '../models/ServerState';

import type { Action } from '../actions';
import type { AppState } from '../states/app';

const initialState: AppState = {
  sideMenu: {
    isOpen: false,
  },
  authModalConfig: {
    isOpen: false,
    mode: 'signin',
  },
  updateCardModalConfig: {
    isOpen: false,
  },
  serverState: emptySeverState(),
  serverStateRequest: {
    requesting: false,
    error: null,
  },
  experiences: [],
  experienceRequest: {
    requesting: false,
    error: null,
  },
  context: {
    path: null,
  },
  config: {
    currency: 'HKD',
  },
};

export default function app(
  state: AppState = initialState,
  action: Action
): AppState {
  switch (action.type) {
    case APP_SET_SIDE_MENU_STATE: {
      return {
        ...state,
        sideMenu: {
          isOpen: action.payload.isOpen,
        },
      };
    }
    case APP_OPEN_AUTH_MODAL: {
      return {
        ...state,
        authModalConfig: {
          ...state.authModalConfig,
          isOpen: true,
          mode: action.payload.mode,
        },
      };
    }
    case APP_CLOSE_AUTH_MODAL: {
      return {
        ...state,
        authModalConfig: {
          ...state.authModalConfig,
          isOpen: false,
        },
      };
    }
    case APP_SAVE_CONTEXT: {
      return {
        ...state,
        context: {
          ...state.context,
          ...action.payload.context,
        },
      };
    }
    case APP_RESUME_CONTEXT: {
      return {
        ...state,
        context: {
          path: null,
        },
      };
    }
    case APP_CHANGE_CURRENCY: {
      return {
        ...state,
        config: {
          ...state.config,
          currency: action.payload.currency,
        },
      };
    }
    case APP_SWITCH_AUTH_MODAL_MODE: {
      return {
        ...state,
        authModalConfig: {
          ...state.authModalConfig,
          mode: action.payload.mode,
        },
      };
    }
    case APP_OPEN_UPDATE_CARD_MODAL: {
      return {
        ...state,
        updateCardModalConfig: {
          isOpen: true,
        },
      };
    }
    case APP_CLOSE_UPDATE_CARD_MODAL: {
      return {
        ...state,
        updateCardModalConfig: {
          isOpen: false,
        },
      };
    }
    case APP_SERVER_STATE_REQUESTING: {
      return {
        ...state,
        serverStateRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case APP_SERVER_STATE_SUCCESS: {
      const { serverState } = action.payload;
      return {
        ...state,
        serverState,
        serverStateRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case APP_SERVER_STATE_FAILURE: {
      const { reason } = action.payload;
      return {
        ...state,
        serverStateRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case APP_EXPERIENCES_REQUESTING: {
      return {
        ...state,
        experienceRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case APP_EXPERIENCES_SUCCESS: {
      const { experiences } = action.payload;
      return {
        ...state,
        experiences: [...experiences],
        experienceRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case APP_EXPERIENCES_FAILURE: {
      const { reason } = action.payload;
      return {
        ...state,
        experienceRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    case AUTH_SIGNIN_SUCCESS:
    case AUTH_SIGNUP_SUCCESS:
    case AUTH_COMPLETE_SIGNUP_SUCCESS:
    case AUTH_OAUTH_LOGIN_SUCCESS: {
      return {
        ...state,
        config: {
          ...state.config,
          currency: action.payload.user.defaultCurrency || 'HKD',
        },
      };
    }
    case AUTH_WHOAMI_SUCCESS:
    case AUTH_WHOAMI_FAILURE:
    case AUTH_SIGNIN_FAILURE:
    case AUTH_SIGNUP_FAILURE:
    case AUTH_COMPLETE_SIGNUP_FAILURE:
    case AUTH_OAUTH_LOGIN_FAILURE: {
      return {
        ...state,
        config: {
          ...state.config,
          currency: localStorage.getItem('ht_currency') || 'HKD',
        },
      };
    }
    default:
      return state;
  }
}
