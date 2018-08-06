// @flow
import hotelGroupSchema from '../schemas/hotelGroup';
import type { HotelGroup } from '../models/HotelGroup';

// eslint-disable-next-line flowtype/no-weak-types
export function deserializeHotelGroup(response: any): Promise<HotelGroup> {
  // eslint-disable-next-line flowtype/no-weak-types
  return hotelGroupSchema.validate(response).then((val: any) => {
    return {
      id: val.id,
      slug: val.slug,
      name: val.name,
      image: val.image,
    };
  });
}
