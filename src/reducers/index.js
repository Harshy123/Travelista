// @flow

import { combineReducers } from 'redux';
import app from './app';
import auth from './auth';
import account from './account';
import offer from './offer';
import hotelGroup from './hotelGroup';
import advertisement from './advertisement';
import promoCode from './promoCode';
import reservation from './reservation';
import order from './order';
import press from './press';
import { reducer as toastrReducer } from 'react-redux-toastr';

const reducers = {
  app,
  auth,
  account,
  offer,
  hotelGroup,
  advertisement,
  promoCode,
  reservation,
  order,
  press,
  toastr: toastrReducer,
};

export type Reducers = typeof reducers;

export default combineReducers({ ...reducers });
