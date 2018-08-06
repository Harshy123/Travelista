// @flow
import type { CreditCardInfo } from './CreditCardInfo';
import type { UserTravelista } from './UserTravelista';
import type { PromoCode } from './PromoCode';

type CommonUser = {
  id: string,
  salutation: string,
  firstName: string,
  lastName: string,
  passportName: string,
  email: string,
  countryOfResidence: string,
  mobileNumber: string,
  profilePicture: ?string,
  defaultCurrency: string,
  specialRequest: ?string,
  signupCompleted: boolean,
  verified: boolean,
  creditCardInfo: ?CreditCardInfo,
  travelistas: ?(UserTravelista[]),
  isSSO: boolean,
};

export type User = CommonUser & {
  partnerCode: ?PromoCode,
};

// represent a user just being fetched from server
// should only appear in API client
export type RawUser = CommonUser & {
  partnerCodeId: ?string,
};

// represent a user used to do user update
export type UpdateUser = CommonUser & {
  partnerCodeCode: ?string,
};

export function userToUpdateUser(user: User): UpdateUser {
  const { partnerCode, ...restUser } = user;
  let partnerCodeCode = null;
  if (partnerCode != null) {
    partnerCodeCode = partnerCode.code;
  }

  return {
    ...restUser,
    partnerCodeCode,
  };
}
