// @flow
import yup from 'yup';
import type { PromoCode } from '../models/PromoCode';
import MomentDateSchemaType from '../schemas/MomentDateSchemaType';

const promoSchema = yup
  .object()
  .shape({
    id: yup.string().required(),
    code: yup.string().required(),
    discount: yup.number().required(),
    discountType: yup.string().required(),
    validStartAt: new MomentDateSchemaType().required(),
    validEndAt: new MomentDateSchemaType().required(),
  })
  .camelCase();

export function deserializePromoCode(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<PromoCode> {
  return promoSchema.validate(response);
}
