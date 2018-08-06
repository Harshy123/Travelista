// @flow

import type { Action } from '../actions';
import type { AuthState } from '../states/auth';

import {
  AUTH_WHOAMI_REQUESTING,
  AUTH_WHOAMI_SUCCESS,
  AUTH_WHOAMI_FAILURE,
  AUTH_SIGNIN_REQUESTING,
  AUTH_SIGNIN_SUCCESS,
  AUTH_SIGNIN_FAILURE,
  AUTH_SIGNUP_REQUESTING,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILURE,
  AUTH_COMPLETE_SIGNUP_REQUESTING,
  AUTH_COMPLETE_SIGNUP_SUCCESS,
  AUTH_COMPLETE_SIGNUP_FAILURE,
  AUTH_OAUTH_LOGIN_REQUESTING,
  AUTH_OAUTH_LOGIN_SUCCESS,
  AUTH_OAUTH_LOGIN_FAILURE,
  AUTH_FORGOT_PASSWORD_REQUESTING,
  AUTH_FORGOT_PASSWORD_SUCCESS,
  AUTH_FORGOT_PASSWORD_FAILURE,
  AUTH_RESET_PASSWORD_REQUESTING,
  AUTH_RESET_PASSWORD_SUCCESS,
  AUTH_RESET_PASSWORD_FAILURE,
  AUTH_SET_SIGNUP_INFO,
  AUTH_SET_PARTNER_CODE,
  AUTH_FLUSH_PARTNER_CODE,
  AUTH_SIGNOUT,
} from '../actions/auth';

import {
  ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS,
  ACCOUNT_UPDATE_PROFILE_SUCCESS,
  ACCOUNT_UPDATE_CARD_SUCCESS,
} from '../actions/account';

const initialState = {
  accessToken: null,
  isLoggedIn: false,
  whoamiRequest: {
    requesting: false,
    error: null,
  },
  signinRequest: {
    requesting: false,
    error: null,
  },
  signupRequest: {
    requesting: false,
    error: null,
  },
  completeSignupRequest: {
    requesting: false,
    error: null,
  },
  oauthLoginRequest: {
    requesting: false,
    error: null,
  },
  forgotPasswordRequest: {
    requesting: false,
    error: null,
  },
  resetPasswordRequest: {
    requesting: false,
    error: null,
  },
  signupInfo: {
    email: '',
    partnerCode: null,
  },
  user: null,
};

export default function(
  state: AuthState = initialState,
  action: Action
): AuthState {
  switch (action.type) {
    case AUTH_WHOAMI_REQUESTING: {
      return {
        ...state,
        whoamiRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_SIGNIN_REQUESTING: {
      return {
        ...state,
        signinRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_SIGNUP_REQUESTING: {
      return {
        ...state,
        signupRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_COMPLETE_SIGNUP_REQUESTING: {
      return {
        ...state,
        completeSignupRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_OAUTH_LOGIN_REQUESTING: {
      return {
        ...state,
        oauthLoginRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_FORGOT_PASSWORD_REQUESTING: {
      return {
        ...state,
        forgotPasswordRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_RESET_PASSWORD_REQUESTING: {
      return {
        ...state,
        resetPasswordRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case AUTH_WHOAMI_SUCCESS: {
      return {
        ...state,
        whoamiRequest: {
          requesting: false,
          error: null,
        },
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      };
    }
    case AUTH_SIGNIN_SUCCESS: {
      return {
        ...state,
        signinRequest: {
          requesting: false,
          error: null,
        },
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      };
    }
    case AUTH_SIGNUP_SUCCESS: {
      return {
        ...state,
        signupRequest: {
          requesting: false,
          error: null,
        },
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      };
    }
    case AUTH_COMPLETE_SIGNUP_SUCCESS: {
      return {
        ...state,
        completeSignupRequest: {
          requesting: false,
          error: null,
        },
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.user,
        },
        signupInfo: {
          email: '',
          partnerCode: null,
        },
      };
    }
    case AUTH_OAUTH_LOGIN_SUCCESS: {
      return {
        ...state,
        oauthLoginRequest: {
          requesting: false,
          error: null,
        },
        accessToken: action.payload.accessToken,
        isLoggedIn: true,
        user: {
          ...state.user,
          ...action.payload.user,
        },
        signupInfo: {
          email: '',
          partnerCode: null,
        },
      };
    }
    case AUTH_FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        forgotPasswordRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case AUTH_RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        resetPasswordRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case AUTH_WHOAMI_FAILURE: {
      return {
        ...state,
        whoamiRequest: {
          requesting: false,
          error: action.payload.reason,
          success: false,
        },
      };
    }
    case AUTH_SIGNIN_FAILURE: {
      return {
        ...state,
        signinRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_SIGNUP_FAILURE: {
      return {
        ...state,
        signupRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_COMPLETE_SIGNUP_FAILURE: {
      return {
        ...state,
        completeSignupRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_OAUTH_LOGIN_FAILURE: {
      return {
        ...state,
        oauthLoginRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_FORGOT_PASSWORD_FAILURE: {
      return {
        ...state,
        forgotPasswordRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        resetPasswordRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case AUTH_SET_SIGNUP_INFO: {
      const { email, partnerCode } = action.payload;
      return {
        ...state,
        signupInfo: {
          ...state.signupInfo,
          email,
          partnerCode,
        },
      };
    }
    case AUTH_SET_PARTNER_CODE: {
      const { partnerCode } = action.payload;
      return {
        ...state,
        signupInfo: {
          ...state.signupInfo,
          partnerCode,
        },
      };
    }
    case AUTH_FLUSH_PARTNER_CODE: {
      return {
        ...state,
        signupInfo: {
          ...state.signupInfo,
          partnerCode: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          profilePicture: action.payload.profilePicture,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        user: action.payload.user,
      };
    }
    case ACCOUNT_UPDATE_CARD_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          creditCardInfo: action.payload.creditCardInfo,
        },
      };
    }
    case AUTH_SIGNOUT: {
      return {
        ...state,
        accessToken: null,
        user: null,
        isLoggedIn: false,
      };
    }
    default:
      return state;
  }
}
