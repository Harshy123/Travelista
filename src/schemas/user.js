// @flow
import yup from 'yup';
import assetSchema from './asset';

const userSchema = yup.object().shape({
  salutation: yup.string(),
  first_name: yup.string(),
  last_name: yup.string(),
  passport_name: yup.string(),
  email: yup.string().email(),
  country_of_residence: yup.string(),
  mobile_number: yup.string(),
  profile_picture_id: assetSchema,
  default_currency: yup.string(),
  partner_code: yup.string(),
  special_request: yup.string(),
  sign_up_completed: yup.boolean(),
  payment_method_info: yup.object().shape({
    stripe_token: yup.string(),
    credit_card_name: yup.string(),
    credit_card_brand: yup.string(),
    credit_card_exp_year: yup.number(),
    credit_card_exp_month: yup.number(),
    credit_card_last_four: yup.string(),
  }),
});

export default userSchema;
