// @flow
import yup from 'yup';
import type { ObjectSchema } from 'yup';

import type { HotelGroup } from '../models/HotelGroup';

const hotelGroupSchema: ObjectSchema<HotelGroup> = yup
  .object()
  .shape({
    id: yup.string().required(),
    name: yup.string().required(),
    image: yup.string(),
  })
  .camelCase();

export default hotelGroupSchema;
