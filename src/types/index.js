// @flow
import type { User } from '../models/User';
import type { Offer } from '../models/Offer';
import type { OfferListItem } from '../models/OfferListItem';
import type { Advertisement } from '../models/Advertisement';
import type { PromoCode } from '../models/PromoCode';
import type { HotelDate } from '../models/HotelDate';
import type { Reservation } from '../models/Reservation';
import type { Order } from '../models/Order';
import type { OrderListItem } from '../models/OrderListItem';
import type { HotelGroup } from '../models/HotelGroup';
import type { CreditCardInfo } from '../models/CreditCardInfo';
import type { Press } from '../models/Press';
import type {
  RecommendedRoomTypeUpgrade,
  RecommendedPackageUpgrade,
} from '../states/offer';

export type Request = {
  requesting: boolean,
  error: ?string,
};

export type ApiError = {
  message: string,
  code: number,
};

export type StatusError = {
  error: ApiError,
  status: string,
};

export type PageInfo = {
  hasNextPage: boolean,
};

export type SigninResponse = {
  accessToken: string,
  user: User,
};

export type SignupResponse = {
  accessToken: string,
  user: User,
};

export type UpdatePasswordResponse = {
  accessToken: string,
  user: User,
};

export type UpdateProfileResponse = {
  user: User,
};

export type UpdateProfilePictureResponse = {
  accessToken: string,
  user: User,
};

export type UpdateCardResponse = {
  creditCardInfo: CreditCardInfo,
};

export type AllExperiencesResponse = { id: string, name: string }[];

export type OfferListItemsResponse = {
  offers: OfferListItem[],
  totalCount: number,
};

export type OfferResponse = {
  offer: Offer,
};

export type HotelGroupsResponse = {
  hotelGroups: HotelGroup[],
};

export type HotelGroupResponse = {
  hotelGroup: HotelGroup,
};

export type AdvertisementsResponse = {
  advertisements: Advertisement[],
};

export type OauthProvider = 'facebook' | 'google' | 'instagram';

export type RecommendedUpgradeResponse = {
  recommendedRoomTypeUpgrade: ?RecommendedRoomTypeUpgrade,
  recommendedPackageUpgrade: ?RecommendedPackageUpgrade,
};

export type PromoCodeResponse = {
  promoCode: PromoCode,
};

export type HotelDatesResponse = {
  hotelDates: HotelDate[],
};

export type ReservationResponse = {
  reservation: Reservation,
};

export type OrderResponse = {
  order: Order,
};

export type EmailExistResponse = {
  exist: boolean,
};

export type ResendVerificationEmailResponse = {
  success: boolean,
};

export type MyOrdersResponse = {
  orders: OrderListItem[],
};

export type ForgotPasswordResponse = {
  status: 'OK',
};

export type ResetPasswordResponse = {
  status: 'OK',
};

export type PressesResponse = {
  presses: Press[],
  totalCount: number,
};
