// @flow
import userSchema from '../schemas/user';
import type { RawUser } from '../models/User';

// eslint-disable-next-line flowtype/no-weak-types
export function deserializeUser(response: any): Promise<RawUser> {
  // eslint-disable-next-line flowtype/no-weak-types
  return userSchema.validate(response).then((val: any) => {
    const {
      payment_method_info: {
        stripe_token,
        credit_card_name,
        credit_card_brand,
        credit_card_exp_year,
        credit_card_exp_month,
        credit_card_last_four,
      },
    } = val;
    let partnerCodeId: ?string = null;
    if (val.partner_code_id && val.partner_code_id.id) {
      partnerCodeId = val.partner_code_id.id.split('/')[1];
    }
    return {
      id: val._id,
      salutation: val.salutation,
      firstName: val.first_name,
      lastName: val.last_name,
      passportName: val.passport_name,
      email: val.email,
      countryOfResidence: val.country_of_residence,
      mobileNumber: val.mobile_number,
      profilePicture: val.profile_picture_id.url,
      defaultCurrency: val.default_currency,
      partnerCodeId: partnerCodeId,
      specialRequest: val.special_request,
      signupCompleted: val.sign_up_completed,
      verified: val.verified,
      creditCardInfo: stripe_token
        ? {
            stripeToken: stripe_token,
            cardName: credit_card_name,
            cardBrand: credit_card_brand,
            expiryMonth: credit_card_exp_month,
            expiryYear: credit_card_exp_year,
            lastFour: credit_card_last_four,
          }
        : null,
      travelistas: null,
      isSSO: val.is_sso,
    };
  });
}
