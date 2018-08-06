// @flow
import moment from 'moment';
import { toHotelDateMapKey } from '../utils/utils';
import { toDateString, timeMapping } from '../utils/time';

import type Moment from 'moment';
import type { RoomType } from '../models/RoomType';
import type { HotelDate } from '../models/HotelDate';
import type { Offer } from '../models/Offer';
import type { Package } from '../models/Package';
import type { AddOn } from '../models/AddOn';

export const isPackageAvailable = (
  numberOfRooms: number,
  from: Moment,
  to: Moment,
  roomType: RoomType,
  offer: Offer,
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  }
): boolean => {
  const { id } = offer;
  const hotelDates = hotelDateMap[toHotelDateMapKey(id, roomType.id)] || {};

  const hotelDateEntries: (?HotelDate)[] = timeMapping(
    moment(from),
    moment(to).subtract(1, 'd'),
    'd',
    (date: Moment) => hotelDates[toDateString(moment(date))]
  );

  const isAvailable = hotelDateEntries.reduce(
    (isAvailable_: boolean, hd: ?HotelDate) => {
      if (!isAvailable_ || !hd) {
        return false;
      }

      return hd.isAvailable && hd.rooms >= numberOfRooms;
    },
    true
  );

  return isAvailable;
};

export function sortAddOns(addOns: AddOn[]): AddOn[] {
  const addOns_ = addOns.slice();
  addOns_.sort((a: AddOn, b: AddOn) => {
    if (a.name > b.name) {
      return 1;
    }
    return -1;
  });
  return addOns_;
}

export function getOfferMinNightCount(offer: Offer): number {
  const firstRoomTypeKey = Object.keys(offer.roomTypeInfo)[0];
  const packages = offer.roomTypeInfo[firstRoomTypeKey].packages;
  return packages.reduce((min: number, p: Package) => {
    if (min > p.nights) {
      return p.nights;
    }
    return min;
  }, Number.MAX_SAFE_INTEGER);
}
