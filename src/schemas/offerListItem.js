// @flow
import yup from 'yup';
import type { ObjectSchema } from 'yup';
import hotelSchema from './hotel';
import MomentDateSchemaType from './MomentDateSchemaType';

import type { OfferListItem } from '../models/OfferListItem';

const offerListItemSchema: ObjectSchema<OfferListItem> = yup
  .object()
  .shape({
    id: yup.string().required(),
    bookingStartAt: new MomentDateSchemaType().required(),
    bookingEndAt: new MomentDateSchemaType().required(),
    stayingStartAt: new MomentDateSchemaType().required(),
    stayingEndAt: new MomentDateSchemaType().required(),
    price: yup.number().required(),
    nightCount: yup.number().required(),
    hotel: hotelSchema.required(),
  })
  .camelCase();

export default offerListItemSchema;
