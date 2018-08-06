// @flow
import yup from 'yup';
import type { ObjectSchema } from 'yup';
import hotelGroupSchema from './hotelGroup';
import experienceSchema from './experience';

import type { SimpleHotel } from '../models/Hotel';
import type { Location } from '../models/Location';

const locationSchema: ObjectSchema<Location> = yup.object().shape({
  lat: yup.number().required(),
  lng: yup.number().required(),
});

const hotelSchema: ObjectSchema<SimpleHotel> = yup
  .object()
  .shape({
    id: yup.string().required(),
    slug: yup.string().required(),
    name: yup.string().required(),
    phoneNumber: yup.string().required(),
    city: yup.string().required(),
    country: yup.string().required(),
    address: yup.string().required(),
    location: locationSchema.required(),
    about: yup.string().required(),
    whatWeLove: yup.string().required(),
    policy: yup.string().required(),
    logo: yup.string().nullable(),
    images: yup.array().of(yup.string().required()),
    hotelGroup: hotelGroupSchema.required(),
    experiences: yup.array().of(experienceSchema),
  })
  .camelCase()
  // eslint-disable-next-line flowtype/no-weak-types
  .transform(function(value: any, originalValue: any) {
    if (!this.isType(value)) {
      return value;
    }

    const { locationLong, locationLat, ...rest } = value;
    rest.location = {
      lat: locationLat,
      lng: locationLong,
    };

    return rest;
  });

export default hotelSchema;
