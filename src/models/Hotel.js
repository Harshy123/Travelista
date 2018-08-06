// @flow
import type { Location } from './Location';
import type { HotelGroup } from './HotelGroup';
import type { Experience } from './Experience';
import type { RoomType } from './RoomType';
import type { AddOn } from './AddOn';

export type SimpleHotel = {
  id: string,
  slug: string,
  hotelGroup: HotelGroup,
  experiences: Experience[],
  logo: ?string,
  images: string[],
  name: string,
  phoneNumber: string,
  city: string,
  country: string,
  address: string,
  location: Location,
  about: string,
  whatWeLove: string,
  policy: string,
};

export type Hotel = SimpleHotel & {
  hotelFacilities: AddOn[],
  // sorted by its level
  roomTypes: RoomType[],
};
