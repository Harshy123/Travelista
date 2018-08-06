// @flow
import moment from 'moment';
import { createSelector } from 'reselect';

import type { Action } from '../actions';
import type { AccountState } from '../states/account';
import type { OrderListItem } from '../models/OrderListItem';
import {
  ACCOUNT_UPDATE_PASSWORD_REQUESTING,
  ACCOUNT_UPDATE_PASSWORD_SUCCESS,
  ACCOUNT_UPDATE_PASSWORD_FAILURE,
  ACCOUNT_UPDATE_PROFILE_REQUESTING,
  ACCOUNT_UPDATE_PROFILE_SUCCESS,
  ACCOUNT_UPDATE_PROFILE_FAILURE,
  ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING,
  ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS,
  ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE,
  ACCOUNT_UPDATE_CARD_REQUESTING,
  ACCOUNT_UPDATE_CARD_SUCCESS,
  ACCOUNT_UPDATE_CARD_FAILURE,
  ACCOUNT_FETCH_ORDERS_REQUESTING,
  ACCOUNT_FETCH_ORDERS_SUCCESS,
  ACCOUNT_FETCH_ORDERS_FAILURE,
} from '../actions/account';

const initialState = {
  updatePasswordRequest: {
    requesting: false,
    error: null,
  },
  updateProfileRequest: {
    requesting: false,
    error: null,
  },
  updateProfilePictureRequest: {
    requesting: false,
    error: null,
  },
  updateCardRequest: {
    requesting: false,
    error: null,
  },
  fetchOrdersRequest: {
    requesting: false,
    error: null,
  },
  orders: [],
};

export const getFutureOrders = createSelector(
  (state: AccountState) => state.orders,
  (orders: OrderListItem[]): OrderListItem[] => {
    return orders.filter((order: OrderListItem) => {
      return order.to.isAfter(moment());
    });
  }
);

export const getPastOrders = createSelector(
  (state: AccountState) => state.orders,
  (orders: OrderListItem[]): OrderListItem[] => {
    return orders.filter((order: OrderListItem) => {
      return order.to.isSameOrBefore(moment());
    });
  }
);

export default function(
  state: AccountState = initialState,
  action: Action
): AccountState {
  switch (action.type) {
    case ACCOUNT_UPDATE_PASSWORD_REQUESTING: {
      return {
        ...state,
        updatePasswordRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PASSWORD_SUCCESS: {
      return {
        ...state,
        updatePasswordRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PASSWORD_FAILURE: {
      return {
        ...state,
        updatePasswordRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_REQUESTING: {
      return {
        ...state,
        updateProfileRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_SUCCESS: {
      return {
        ...state,
        updateProfileRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_FAILURE: {
      return {
        ...state,
        updateProfileRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_PICTURE_REQUESTING: {
      return {
        ...state,
        updateProfilePictureRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_PICTURE_SUCCESS: {
      return {
        ...state,
        updateProfilePictureRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_PROFILE_PICTURE_FAILURE: {
      return {
        ...state,
        updateProfilePictureRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case ACCOUNT_UPDATE_CARD_REQUESTING: {
      return {
        ...state,
        updateCardRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_CARD_SUCCESS: {
      return {
        ...state,
        updateCardRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ACCOUNT_UPDATE_CARD_FAILURE: {
      return {
        ...state,
        updateCardRequest: {
          requesting: false,
          error: action.payload.reason,
        },
      };
    }
    case ACCOUNT_FETCH_ORDERS_REQUESTING: {
      return {
        ...state,
        orders: [],
        fetchOrdersRequest: {
          requesting: true,
          error: null,
        },
      };
    }
    case ACCOUNT_FETCH_ORDERS_SUCCESS: {
      const { payload: { orders } } = action;
      return {
        ...state,
        orders: orders,
        fetchOrdersRequest: {
          requesting: false,
          error: null,
        },
      };
    }
    case ACCOUNT_FETCH_ORDERS_FAILURE: {
      const { payload: { reason } } = action;
      return {
        ...state,
        orders: [],
        fetchOrdersRequest: {
          requesting: false,
          error: reason,
        },
      };
    }
    default:
      return state;
  }
}
