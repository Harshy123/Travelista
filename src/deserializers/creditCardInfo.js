// @flow
import creditCardInfoSchema from '../schemas/creditCardInfoSchema';
import type { CreditCardInfo } from '../models/CreditCardInfo';

export function deserializeCreditCardInfo(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<CreditCardInfo> {
  return creditCardInfoSchema.validate(response.credit_card_info);
}
