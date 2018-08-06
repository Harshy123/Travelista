// @flow
import yup from 'yup';
import type { ObjectSchema } from 'yup';
import type { CreditCardInfo } from '../models/CreditCardInfo';

const creditCardInfoSchema: ObjectSchema<CreditCardInfo> = yup
  .object()
  .shape({
    cardBrand: yup.string().required(),
    cardName: yup.string().required(),
    expiryMonth: yup.string().required(),
    expiryYear: yup.string().required(),
    lastFour: yup.string().required(),
    stripeToken: yup.string().required(),
  })
  .camelCase();

export default creditCardInfoSchema;
