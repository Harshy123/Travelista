// @flow
import yup from 'yup';
import type { ObjectSchema } from 'yup';

import type { HotelDate } from '../models/HotelDate';
import MomentDateSchemaType from '../schemas/MomentDateSchemaType';

const hotelDateSchema: ObjectSchema<HotelDate> = yup
  .object()
  .shape({
    date: new MomentDateSchemaType().required(),
    isAvailable: yup.boolean().required(),
    // rate: yup.string().required(),
    price: yup.number().required(),
    rooms: yup.number().required(),
  })
  .camelCase();

export function deserializeHotelDate(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<HotelDate> {
  // eslint-disable-next-line flowtype/no-weak-types
  return hotelDateSchema.validate(response);
}
