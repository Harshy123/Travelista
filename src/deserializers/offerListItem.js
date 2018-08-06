// @flow
import offerListItemSchema from '../schemas/offerListItem';
import type { OfferListItem } from '../models/OfferListItem';

export function deserializeOfferListItem(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<OfferListItem> {
  return offerListItemSchema.validate(response);
}
