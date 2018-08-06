// @flow

import type { ContextRouter } from 'react-router';

import type { AccountState } from './account';
import type { AdvertisementState } from './advertisement';
import type { AppState } from './app';
import type { AuthState } from './auth';
import type { HotelGroupState } from './hotelGroup';
import type { OfferState } from './offer';
import type { OrderState } from './order';
import type { PressState } from './press';
import type { PromoCodeState } from './promoCode';
import type { ReservationState } from './reservation';

export type RootState = {
  account: AccountState,
  advertisement: AdvertisementState,
  app: AppState,
  auth: AuthState,
  hotelGroup: HotelGroupState,
  offer: OfferState,
  order: OrderState,
  press: PressState,
  promoCode: PromoCodeState,
  reservation: ReservationState,

  // state provided by connected-react-router
  router: ContextRouter,
};
