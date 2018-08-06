// @flow

import type { AccountAction } from './account';
import type { AdvertisementAction } from './advertisement';
import type { AppAction } from './app';
import type { AuthAction } from './auth';
import type { HotelGroupAction } from './hotelGroup';
import type { OfferAction } from './offer';
import type { OrderAction } from './order';
import type { PressAction } from './press';
import type { PromoCodeAction } from './promoCode';
import type { ReservationAction } from './reservation';

export type Action =
  | AccountAction
  | AdvertisementAction
  | AppAction
  | AuthAction
  | HotelGroupAction
  | OfferAction
  | OrderAction
  | PressAction
  | PromoCodeAction
  | ReservationAction;

export type {
  AccountAction,
  AdvertisementAction,
  AppAction,
  AuthAction,
  HotelGroupAction,
  OfferAction,
  OrderAction,
  PressAction,
  PromoCodeAction,
  ReservationAction,
};
