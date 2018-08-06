// @flow
import skygear from 'skygear';

import { store } from './index';
import { deserializeUser } from './deserializers/user';
import { deserializeOfferListItem } from './deserializers/offerListItem';
import { deserializeOffer } from './deserializers/offer';
import { deserializeServerState } from './deserializers/serverState';
import { deserializeExperience } from './deserializers/experience';
import { deserializeAdvertisement } from './deserializers/advertisement';
import { deserializePromoCode } from './deserializers/promoCode';
import { deserializeHotelDate } from './deserializers/hotelDate';
import { deserializeReservation } from './deserializers/reservation';
import { deserializeOrder } from './deserializers/order';
import { deserializeHotelGroup } from './deserializers/hotelGroup';
import { deserializeUserTravelista } from './deserializers/userTravelista';
import { deserializeOrderListItem } from './deserializers/orderListItem';
import { deserializePress } from './deserializers/press';
import { deserializeCreditCardInfo } from './deserializers/creditCardInfo';

import {
  ERR_INVALID_PARTNER_CODE,
  ERR_PAYMENT,
  ERR_INVALID_PROMO_CODE,
} from './utils/apiError';
import { stripeTokeniseCard } from './utils/stripe';

import type {
  SigninResponse,
  SignupResponse,
  UpdatePasswordResponse,
  UpdateProfileResponse,
  UpdateProfilePictureResponse,
  AllExperiencesResponse,
  OfferListItemsResponse,
  OfferResponse,
  StatusError,
  ApiError,
  OauthProvider,
  AdvertisementsResponse,
  PromoCodeResponse,
  HotelDatesResponse,
  ReservationResponse,
  OrderResponse,
  HotelGroupsResponse,
  HotelGroupResponse,
  EmailExistResponse,
  UpdateCardResponse,
  ResendVerificationEmailResponse,
  MyOrdersResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  PressesResponse,
} from './types';

import type Moment from 'moment';

import type { CreditCardInfo } from './models/CreditCardInfo';
import type { User, UpdateUser, RawUser } from './models/User';
import type { UserInfo } from './models/UserInfo';
import type { OfferListItem } from './models/OfferListItem';
import type { HotelDate } from './models/HotelDate';
import type { Advertisement } from './models/Advertisement';
import type { PromoCode } from './models/PromoCode';
import type { Reservation } from './models/Reservation';
import type { Capacity } from './models//Capacity';
import type { Travelista, TravelistaTrip } from './models/Travelista';
import type { UserTravelista } from './models/UserTravelista';
import type { Order } from './models/Order';
import type { OrderListItem } from './models/OrderListItem';
import type { PaymentInfo } from './models/PaymentInfo';
import type { CreditCard } from './models/CreditCard';
import type { HotelGroup } from './models/HotelGroup';
import type { Press } from './models/Press';
import type { ServerState } from './models/ServerState';

export type ApiClient = {
  whoami: () => Promise<SigninResponse>,
  signin: (string, string) => Promise<SigninResponse>,
  signup: (string, string, UserInfo) => Promise<SignupResponse>,
  completeSignup: (string, UserInfo) => Promise<SignupResponse>,
  signout: () => Promise<void>,
  oauthLogin: OauthProvider => Promise<SignupResponse>,
  updatePassword: (string, string) => Promise<UpdatePasswordResponse>,
  updateProfile: (User, UpdateUser) => Promise<UpdateProfileResponse>,
  updateProfilePicture: File => Promise<UpdateProfilePictureResponse>,
  fetchServerState: () => Promise<ServerState>,
  fetchAllExperiences: () => Promise<AllExperiencesResponse>,
  fetchOffersByHotelGroupSlug: string => Promise<OfferListItemsResponse>,
  fetchOffersByExperienceId: (
    number,
    number,
    ?string
  ) => Promise<OfferListItemsResponse>,
  fetchOffer: (id: string, hotelSlug: string) => Promise<OfferResponse>,
  fetchFeaturedOffers: () => Promise<OfferListItemsResponse>,
  fetchSimilarOffers: string => Promise<OfferListItemsResponse>,
  fetchHotelGroups: () => Promise<HotelGroupsResponse>,
  fetchHotelGroup: string => Promise<HotelGroupResponse>,
  fetchAdvertisements: (
    number,
    number,
    string
  ) => Promise<AdvertisementsResponse>,
  fetchPromoCode: string => Promise<PromoCodeResponse>,
  fetchHotelDates: (
    offerId: string,
    roomTypeId: string,
    from: Moment,
    to: Moment
  ) => Promise<HotelDatesResponse>,
  fetchReservation: string => Promise<ReservationResponse>,
  fetchOrder: string => Promise<OrderResponse>,
  makeReservation: (
    string,
    Moment,
    Moment,
    Capacity,
    promoCode?: string
  ) => Promise<ReservationResponse>,
  makeOrder: (
    Reservation,
    { user: Travelista, trip: TravelistaTrip }[],
    stripeToken: ?string,
    PaymentInfo
  ) => Promise<OrderResponse>,
  sendOrderInvoice: (
    orderId: string,
    emails: string[],
    message: string
  ) => Promise<void>,
  sendBookingConfirmation: (
    orderId: string,
    emails: string[],
    message: string
  ) => Promise<void>,
  checkEmailExist: string => Promise<EmailExistResponse>,
  resendVerificationEmail: void => Promise<ResendVerificationEmailResponse>,
  updateCard: CreditCard => Promise<UpdateCardResponse>,
  fetchMyOrders: void => Promise<MyOrdersResponse>,
  forgotPassword: string => Promise<ForgotPasswordResponse>,
  resetPassword: (
    string,
    string,
    number,
    string
  ) => Promise<ResetPasswordResponse>,
  fetchPresses: (number, number) => Promise<PressesResponse>,
  validatePartnerCode: string => Promise<string>,
  sendOffer: (string, string[], message: string) => Promise<void>,
  recordSignup: (string, ?string) => Promise<void>,
};

// eslint-disable-next-line flowtype/no-weak-types
function skygearLambda(lambda: string, args: any): any {
  const { app: { config: { currency } } } = store.getState();
  return skygear.lambda(lambda, [{ ...args, currency }]);
}

function whoami(): Promise<SigninResponse> {
  return (
    skygear.auth
      .whoami()
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function signin(email: string, password: string): Promise<SigninResponse> {
  return (
    skygear.auth
      .loginWithEmail(email, password)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function signup(
  email: string,
  password: string,
  userInfo: UserInfo
): Promise<SignupResponse> {
  if (userInfo.partnerCode) {
    return validatePartnerCode(userInfo.partnerCode).then(
      (partnerCodeId: string) => {
        return _signupWithEmail(password, {
          ...userInfo,
          partnerCode: new skygear.Reference({
            id: `partner_code/${partnerCodeId}`,
          }),
        });
      }
    );
  }

  return _signupWithEmail(password, { ...userInfo, partnerCode: null });
}

function _signupWithEmail(
  password: string,
  userInfo: UserInfo
): Promise<SignupResponse> {
  const _userInfo = {
    salutation: userInfo.salutation,
    first_name: userInfo.firstName,
    last_name: userInfo.lastName,
    passport_name: userInfo.passportName,
    country_of_residence: userInfo.countryOfResidence,
    mobile_number: userInfo.mobileNumber,
    default_currency: userInfo.defaultCurrency,
    partner_code_id: userInfo.partnerCode,
    receive_promotion: userInfo.receivePromotion,
  };

  return (
    skygear.auth
      .signupWithEmail(userInfo.email, password, _userInfo)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function completeSignup(
  id: string,
  userInfo: UserInfo
): Promise<SignupResponse> {
  if (userInfo.partnerCode) {
    return validatePartnerCode(userInfo.partnerCode).then(
      (partnerCodeId: string) => {
        return _completeSignup(id, {
          ...userInfo,
          partnerCode: new skygear.Reference({
            id: `partner_code/${partnerCodeId}`,
          }),
        });
      }
    );
  }

  return _completeSignup(id, userInfo);
}

function _completeSignup(
  id: string,
  userInfo: UserInfo
): Promise<SignupResponse> {
  const User = skygear.Record.extend('user');
  const query = new skygear.Query(User).equalTo('_id', id);
  return (
    skygear.publicDB
      .query(query)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((records: any) => {
        let user = records[0];
        user['salutation'] = userInfo.salutation;
        user['first_name'] = userInfo.firstName;
        user['last_name'] = userInfo.lastName;
        user['passport_name'] = userInfo.passportName;
        user['email'] = userInfo.email;
        user['country_of_residence'] = userInfo.countryOfResidence;
        user['mobile_number'] = userInfo.mobileNumber;
        user['default_currency'] = userInfo.defaultCurrency;
        user['partner_code_id'] = userInfo.partnerCode || null;
        user['receive_promotion'] = userInfo.receivePromotion;
        return skygear.publicDB.save(user);
      })
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

// FIXME: some fields may require checking with the old profile e.g. profile pic will need to upload assert
// Passing both oldUser and newUser here to prepare for the update
function updateProfile(
  oldUser: User,
  updateUser: UpdateUser
): Promise<UpdateProfileResponse> {
  const oldPartnerCode = oldUser.partnerCode;
  const newPartnerCodeCode = updateUser.partnerCodeCode;

  if (newPartnerCodeCode == null) {
    return _updateProfile(updateUser);
  }

  if (oldPartnerCode != null && oldPartnerCode.code === newPartnerCodeCode) {
    return _updateProfile(updateUser);
  }

  return validatePartnerCode(newPartnerCodeCode).then(
    (partnerCodeId: string) => {
      return _updateProfile(updateUser, partnerCodeId);
    },
    (error: ApiError) => {
      if (error === ERR_INVALID_PARTNER_CODE) {
        return _updateProfile(updateUser);
      }

      throw error;
    }
  );
}

function _updateProfile(
  user: UpdateUser,
  partnerCodeId: ?string
): Promise<UpdateProfileResponse> {
  const User = skygear.Record.extend('user');
  const query = new skygear.Query(User).equalTo('_id', user.id);

  return (
    skygear.publicDB
      .query(query)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((records: any) => {
        let userRecord = records[0];
        userRecord['salutation'] = user.salutation;
        userRecord['first_name'] = user.firstName;
        userRecord['last_name'] = user.lastName;
        userRecord['passport_name'] = user.passportName;
        userRecord['email'] = user.email;
        userRecord['country_of_residence'] = user.countryOfResidence;
        userRecord['mobile_number'] = user.mobileNumber;
        userRecord['default_currency'] = user.defaultCurrency;
        if (partnerCodeId) {
          userRecord['partner_code_id'] = new skygear.Reference({
            id: `partner_code/${partnerCodeId}`,
          });
        }
        userRecord['special_request'] = user.specialRequest || null;
        userRecord['payment_method_info'] = user.creditCardInfo
          ? {
              stripe_token: user.creditCardInfo.stripeToken,
              credit_card_name: user.creditCardInfo.cardName,
              credit_card_brand: user.creditCardInfo.cardBrand,
              credit_card_exp_year: user.creditCardInfo.expiryYear,
              credit_card_exp_month: user.creditCardInfo.expiryMonth,
              credit_card_last_four: user.creditCardInfo.lastFour,
            }
          : null;
        return skygear.publicDB.save(userRecord);
      })
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      // eslint-disable-next-line flowtype/no-weak-types
      .catch((error: any) => {
        if (error.error) {
          throw error.error;
        }

        throw error;
      })
      .then((user: User) => {
        return {
          user: user,
        };
      })
  );
}

function signout(): Promise<void> {
  return skygear.auth.logout();
}

function oauthLogin(provider: string): Promise<SignupResponse> {
  return (
    skygear.auth
      .loginOAuthProviderWithPopup(provider)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<UpdatePasswordResponse> {
  return (
    skygearLambda('heytravelista:auth:change_password', {
      old_password: currentPassword,
      new_password: newPassword,
    })
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => skygear.auth._authResolve(response))
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function updateProfilePicture(
  file: File
): Promise<UpdateProfilePictureResponse> {
  const userId = skygear.auth.currentUser._id;

  const profilePicture = new skygear.Asset({
    name: `${userId}-profile-picture`,
    file,
  });

  const modifiedProfile = new skygear.UserRecord({
    _id: `user/${userId}`,
    profile_picture_id: profilePicture,
  });

  return (
    skygear.publicDB
      .save(modifiedProfile)
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => deserializeUser(response))
      .then((rawUser: RawUser) => _populateRawUser(rawUser))
      .catch((error: StatusError) => {
        throw error.error;
      })
      .then((user: User) => {
        return {
          accessToken: skygear.auth.accessToken,
          user: user,
        };
      })
  );
}

function _fetchUserTravelistas(): Promise<UserTravelista[]> {
  return skygearLambda('heytravelista:user:fetch_user_travelistas').then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      return Promise.all(
        // eslint-disable-next-line flowtype/no-weak-types
        response['data'].map((travelistaResponse: any) => {
          return deserializeUserTravelista(travelistaResponse);
        })
      );
    }
  );
}

function _populateRawUser(rawUser: RawUser): Promise<User> {
  const partnerCodeId = rawUser.partnerCodeId;
  if (!partnerCodeId) {
    return _fetchUserTravelistas().then((travelistas: UserTravelista[]) => ({
      ...rawUser,
      partnerCode: null,
      travelistas,
    }));
  }

  // Note(Anson): Because the currency is not set when this function is called, so the
  // currency value has to be read from localStorage directly
  const currency = localStorage.getItem('ht_currency') || 'HKD';

  return _fetchPartnerCodeById(partnerCodeId, currency).then(
    (partnerCode: PromoCode) =>
      _fetchUserTravelistas().then((travelistas: UserTravelista[]) => ({
        ...rawUser,
        partnerCode,
        travelistas,
      }))
  );
}

function _fetchPartnerCodeById(
  partnerCodeId: string,
  currency: string
): Promise<PromoCode> {
  return skygear
    .lambda('heytravelista:auth:fetch_partner_code_by_id', [
      {
        partner_code_id: partnerCodeId,
        currency: currency,
      },
    ])
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializePromoCode(response);
      }
    );
}

function fetchServerState(): Promise<ServerState> {
  return skygearLambda('heytravelista:server_state:get_server_state').then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      return deserializeServerState(response.data);
    },
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function fetchAllExperiences(): Promise<AllExperiencesResponse> {
  return skygearLambda(
    'heytravelista:hotel_experience:list_all_hotel_experience'
  ).then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      // eslint-disable-next-line flowtype/no-weak-types
      const promises = response.data.map((record: any) => {
        return deserializeExperience(record);
      });
      return Promise.all(promises);
    },
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function fetchOffersByHotelGroupSlug(
  hotelGroupSlug: string
): Promise<OfferListItemsResponse> {
  return skygearLambda('heytravelista:offer:list_offer_by_hotel_group_slug', {
    hotel_group_slug: hotelGroupSlug,
  }).then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      // eslint-disable-next-line flowtype/no-weak-types
      const offerListItemPromises = response.data.map((record: any) => {
        return deserializeOfferListItem(record);
      });
      return Promise.all(offerListItemPromises).then(
        (offerListItems: OfferListItem[]) => {
          return {
            offers: offerListItems,
          };
        }
      );
    },
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function fetchOffersByExperienceId(
  offset: number,
  limit: number,
  experienceId: ?string
): Promise<OfferListItemsResponse> {
  return skygearLambda('heytravelista:offer:list_offer_by_experience_id', {
    offset,
    limit,
    experience_id: experienceId,
  }).then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      // eslint-disable-next-line flowtype/no-weak-types
      const offerListItemPromises = response.data.map((record: any) => {
        return deserializeOfferListItem(record);
      });
      return Promise.all(offerListItemPromises).then(
        (offerListItems: OfferListItem[]) => {
          return {
            offers: offerListItems,
            totalCount: response.totalCount,
          };
        }
      );
    },
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function fetchOffer(id: string, hotelSlug: string): Promise<OfferResponse> {
  return (
    skygearLambda('heytravelista:offer:fetch_offer', {
      offer_id: id,
      hotel_slug: hotelSlug,
    })
      .then(
        // eslint-disable-next-line flowtype/no-weak-types
        (response: any) => {
          return deserializeOffer(response);
        },
        (error: StatusError) => {
          // TODO: Redirect back to homepage in upper level
          throw error.error;
        }
      )
      // eslint-disable-next-line flowtype/no-weak-types
      .then((e: any) => ({ offer: e }))
  );
}

function fetchFeaturedOffers(): Promise<OfferListItemsResponse> {
  return skygearLambda('heytravelista:offer:list_is_featured_offer')
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const offerListItemPromises = response.data.map((record: any) => {
          return deserializeOfferListItem(record);
        });
        return Promise.all(offerListItemPromises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((offerListItems: OfferListItem[]) => {
      return {
        offers: offerListItems,
      };
    });
}

function fetchSimilarOffers(offerId: string): Promise<OfferListItemsResponse> {
  return skygearLambda('heytravelista:offer:list_similar_offer_by_offer_id', {
    offeset: 0,
    limit: 2,
    offer_id: offerId,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const offerListItemPromises = response.data.map((record: any) => {
          return deserializeOfferListItem(record);
        });
        return Promise.all(offerListItemPromises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((offerListItems: OfferListItem[]) => {
      return {
        offers: offerListItems,
      };
    });
}

function fetchHotelGroups(): Promise<HotelGroupsResponse> {
  return skygearLambda('heytravelista:hotel_group:list_hotel_group')
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const promises = response.data.map((record: any) => {
          return deserializeHotelGroup(record);
        });
        return Promise.all(promises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((hotelGroups: HotelGroup[]) => {
      return {
        hotelGroups,
      };
    });
}

function fetchHotelGroup(hotelGroupSlug: string): Promise<HotelGroupResponse> {
  return skygearLambda('heytravelista:hotel_group:fetch_hotel_group', {
    slug: hotelGroupSlug,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeHotelGroup(response.data);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((hotelGroup: HotelGroup) => {
      return {
        hotelGroup,
      };
    });
}

function fetchAdvertisements(
  offset: number,
  limit: number,
  showAt: string
): Promise<AdvertisementsResponse> {
  return skygearLambda('heytravelista:advertisement:list_advertisement', {
    offset,
    limit,
    showAt,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const advertisementPromises = response.data.map((record: any) => {
          return deserializeAdvertisement(record);
        });
        return Promise.all(advertisementPromises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((advertisements: Advertisement[]) => {
      return {
        advertisements,
      };
    });
}

function fetchPromoCode(code: string): Promise<PromoCodeResponse> {
  return skygearLambda('heytravelista:auth:validate_promo_code', {
    promo_code: code,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        if (response === null) {
          // eslint-disable-next-line
          throw {
            code: ERR_INVALID_PROMO_CODE,
            message: 'invalid promo code',
          };
        }
        return deserializePromoCode(response);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((promoCode: PromoCode[]) => {
      return {
        promoCode,
      };
    });
}

// dates are in inclusive interval [from, to]
function fetchHotelDates(
  offerId: string,
  roomTypeId: string,
  from: Moment,
  to: Moment
): Promise<HotelDatesResponse> {
  return skygearLambda('heytravelista:offer:fetch_hotel_dates', {
    offer_id: offerId,
    room_type_id: roomTypeId,
    from: from.format('YYYY-MM-DDTHH:mm:ss'),
    to: to.format('YYYY-MM-DDTHH:mm:ss'),
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const hotelDatePromises = response.data.map((record: any) => {
          return deserializeHotelDate(record);
        });
        return Promise.all(hotelDatePromises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((hotelDates: HotelDate[]) => {
      return {
        hotelDates,
      };
    });
}

function makeReservation(
  packageId: string,
  from: Moment,
  to: Moment,
  capacity: Capacity,
  promoCode?: string
): Promise<ReservationResponse> {
  return skygearLambda('heytavelista:reservation:make_reservation', {
    package_id: packageId,
    from: from.format('YYYY-MM-DDTHH:mm:ss'),
    to: to.format('YYYY-MM-DDTHH:mm:ss'),
    num_adults: capacity.adults,
    num_children: capacity.children,
    num_infants: capacity.infants,
    num_rooms: capacity.numberOfRooms,
    promo_code: promoCode,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeReservation(response);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((reservation: Reservation) => {
      return {
        reservation,
      };
    });
}

function fetchReservation(reservationId: string): Promise<ReservationResponse> {
  return skygearLambda('heytavelista:reservation:fetch_reservation', {
    reservation_id: reservationId,
  })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeReservation(response);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((reservation: Reservation) => {
      return {
        reservation,
      };
    });
}

function makeOrder(
  reservation: Reservation,
  users: { user: Travelista, trip: TravelistaTrip }[],
  stripeToken: ?string,
  paymentInfo: PaymentInfo
): Promise<OrderResponse> {
  if (stripeToken) {
    return _makeOrder(reservation, users, stripeToken, false);
  }
  const {
    card: { cardNumber, cardName, expiryMonth, expiryYear, cvv },
  } = paymentInfo;
  return stripeTokeniseCard({
    cardNumber,
    cardName,
    expiryMonth,
    expiryYear,
    cvv,
  })
    .then(
      (token: string) => {
        return token;
      },
      (error: StatusError) => {
        // eslint-disable-next-line
        throw {
          code: ERR_PAYMENT,
        };
      }
    )
    .then((token: string) => {
      return _makeOrder(reservation, users, token, paymentInfo.saveCard);
    });
}

function _makeOrder(
  reservation: Reservation,
  users: { user: Travelista, trip: TravelistaTrip }[],
  stripeToken: string,
  saveCard: boolean
): Promise<OrderResponse> {
  const travelistaDetails = users.map(
    (user: { user: Travelista, trip: TravelistaTrip }, i: number) => ({
      save: user.trip.updateProfile,
      salutation: user.user.salutation,
      first_name: user.user.firstName,
      last_name: user.user.lastName,
      passport_name: user.user.passportName,
      email: user.user.email,
      country_of_residence: user.user.countryOfResidence,
      mobile_number: user.user.mobileNumber,
      ordering: i + 1,
      special_request: user.user.specialRequest,
      arrival_date:
        user.trip.arrivalDate && user.trip.arrivalDate.format('YYYY-MM-DD'),
      arrival_flight_number: user.trip.arrivalFlight,
      departure_date:
        user.trip.departureDate && user.trip.departureDate.format('YYYY-MM-DD'),
      departure_flight_number: user.trip.departureFlight,
    })
  );
  const payload = {
    reservation_id: reservation.id,
    num_adults: reservation.capacity.adults,
    num_children: reservation.capacity.children,
    num_infants: reservation.capacity.infants,
    user: {
      special_request: users[0].user.specialRequest,
      save_special_request: users[0].trip.saveSpecialRequest,
      stripe_token: stripeToken,
      save_credit_card: saveCard,
    },
    travelista_details: travelistaDetails,
  };

  return skygearLambda('heytravelista:order:make_order', payload)
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeOrder(response);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((order: Order) => {
      return {
        order,
      };
    });
}

function fetchOrder(orderId: string): Promise<OrderResponse> {
  return skygearLambda('heytravelista:order:fetch_order', { order_id: orderId })
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeOrder(response);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((order: Order) => {
      return {
        order,
      };
    });
}

function sendOrderInvoice(
  orderId: string,
  emails: string[],
  message: string
): Promise<void> {
  return skygearLambda('heytravelista:order:send_invoice', {
    order_id: orderId,
    emails,
    message,
  }).catch((error: StatusError) => {
    throw error.error;
  });
}

function sendBookingConfirmation(
  orderId: string,
  emails: string[],
  message: string
): Promise<void> {
  return skygearLambda('heytravelista:order:send_booking_confirmation', {
    order_id: orderId,
    emails,
    message,
  }).catch((error: StatusError) => {
    throw error.error;
  });
}

function checkEmailExist(email: string): Promise<EmailExistResponse> {
  return skygearLambda('heytravelista:auth:check_email_exist', {
    email,
  }).catch((error: StatusError) => {
    throw error.error;
  });
}

function resendVerificationEmail(): Promise<ResendVerificationEmailResponse> {
  return skygearLambda('heytravelista:auth:resend_verification_email').catch(
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function updateCard(card: CreditCard): Promise<UpdateCardResponse> {
  return stripeTokeniseCard(card)
    .then(
      (token: string) => {
        return skygearLambda('heytravelista:user:update_card', {
          stripe_token: token,
        });
      },
      (error: StatusError) => {
        // eslint-disable-next-line
        throw {
          code: ERR_PAYMENT,
        };
      }
    )
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        return deserializeCreditCardInfo(response);
      }
    )
    .then((creditCardInfo: CreditCardInfo) => {
      return {
        creditCardInfo,
      };
    })
    .catch((error: StatusError) => {
      throw error.error;
    });
}

function fetchMyOrders(): Promise<MyOrdersResponse> {
  return skygearLambda('heytravelista:order:list_my_order')
    .then(
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line flowtype/no-weak-types
        const orderListItemPromises = response.data.map((record: any) => {
          return deserializeOrderListItem(record);
        });
        return Promise.all(orderListItemPromises);
      },
      (error: StatusError) => {
        throw error.error;
      }
    )
    .then((orders: OrderListItem[]) => {
      return {
        orders,
      };
    });
}

function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
  return skygear
    .lambda('user:forgot-password', {
      email,
    })
    .then((response: ForgotPasswordResponse) => {
      return response;
    })
    .catch((error: StatusError) => {
      throw error.error;
    });
}

function resetPassword(
  userID: string,
  code: string,
  expireAt: number,
  newPassword: string
): Promise<ResetPasswordResponse> {
  return skygear.auth
    .resetPassword(userID, code, expireAt, newPassword)
    .then((response: ForgotPasswordResponse) => {
      return response;
    })
    .catch((error: StatusError) => {
      throw error.error;
    });
}

function fetchPresses(offset: number, limit: number): Promise<PressesResponse> {
  return skygearLambda('heytravelista:press:list_press', {
    offset,
    limit,
  }).then(
    // eslint-disable-next-line flowtype/no-weak-types
    (response: any) => {
      // eslint-disable-next-line flowtype/no-weak-types
      const promises = response.data.map((record: any) => {
        return deserializePress(record);
      });
      return Promise.all(promises).then((presses: Press[]) => {
        return {
          presses,
          totalCount: response.totalCount,
        };
      });
    },
    (error: StatusError) => {
      throw error.error;
    }
  );
}

function validatePartnerCode(partnerCode: string): Promise<string> {
  return (
    skygearLambda('heytravelista:auth:validate_partner_code', {
      partner_code: partnerCode,
    })
      // eslint-disable-next-line flowtype/no-weak-types
      .then((response: any) => {
        if (!response) {
          // eslint-disable-next-line no-throw-literal
          throw {
            code: ERR_INVALID_PARTNER_CODE,
            message: 'invalid partner code',
          };
        }

        return response.id;
      })
  );
}

function sendOffer(
  offerId: string,
  emails: string[],
  message: string
): Promise<void> {
  return skygearLambda('heytravelista:offer:send_offer', {
    offer_id: offerId,
    emails,
    message,
  }).catch((error: StatusError) => {
    throw error.error;
  });
}

function recordSignup(email: string, partnerCode: ?string) {
  return skygearLambda('heytravelista:auth:record_signup', {
    email,
    partner_code: partnerCode,
  }).catch((error: StatusError) => {
    throw error.error;
  });
}

export const apiClient: ApiClient = {
  whoami,
  signin,
  signup,
  signout,
  completeSignup,
  oauthLogin,
  updatePassword,
  updateProfile,
  updateProfilePicture,
  fetchServerState,
  fetchAllExperiences,
  fetchOffersByHotelGroupSlug,
  fetchOffersByExperienceId,
  fetchOffer,
  fetchFeaturedOffers,
  fetchSimilarOffers,
  fetchHotelGroups,
  fetchHotelGroup,
  fetchAdvertisements,
  fetchPromoCode,
  fetchHotelDates,
  fetchReservation,
  fetchOrder,
  makeReservation,
  makeOrder,
  sendOrderInvoice,
  sendBookingConfirmation,
  checkEmailExist,
  resendVerificationEmail,
  updateCard,
  fetchMyOrders,
  forgotPassword,
  resetPassword,
  fetchPresses,
  validatePartnerCode,
  sendOffer,
  recordSignup,
};

export default apiClient;
