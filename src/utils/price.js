// @flow
import moment from 'moment';
import { toHotelDateMapKey } from '../utils/utils';
import { toDateString, timeMapping } from '../utils/time';

import type Moment from 'moment';
import type { RoomType } from '../models/RoomType';
import type { HotelDate } from '../models/HotelDate';
import type { Offer } from '../models/Offer';
import type { PromoCode } from '../models/PromoCode';

function validateDiscountCode(discoutCode: PromoCode) {
  return (
    discoutCode.validStartAt.isBefore(moment()) &&
    discoutCode.validEndAt.isAfter(moment())
  );
}

export const computePrice = (
  numberOfRooms: number,
  from: Date,
  to: Date,
  roomType: RoomType,
  offer: Offer,
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  }
): number => {
  const { id } = offer;
  const hotelDates = hotelDateMap[toHotelDateMapKey(id, roomType.id)] || {};

  // need to subtract one from the last date, since it won't be counted as a day.
  const hotelDateEntries: (?HotelDate)[] = timeMapping(
    from,
    moment(to).subtract(1, 'd'),
    'd',
    (date: Moment) => hotelDates[toDateString(moment(date))]
  );

  const computedPrice = hotelDateEntries.reduce(
    (price: number, hd: ?HotelDate) => {
      if (hd != null) {
        return price + hd.price;
      }
      return price;
    },
    0
  );

  return Math.ceil(computedPrice * numberOfRooms * 1);
};

function _computeSellingPrice(price: number, discountCode: PromoCode) {
  if (discountCode.discountType === 'dollar') {
    return price - discountCode.discount;
  }
  return price - Math.ceil(price * discountCode.discount / 100);
}

export function computeDiscountedPrice(
  originalPrice: number,
  promoCode: ?PromoCode,
  partnerCode: ?PromoCode
): number {
  let discountedPrice = originalPrice;
  if (partnerCode && validateDiscountCode(partnerCode)) {
    discountedPrice = _computeSellingPrice(discountedPrice, partnerCode);
  }
  if (promoCode && validateDiscountCode(promoCode)) {
    discountedPrice = _computeSellingPrice(discountedPrice, promoCode);
  }
  return Math.ceil(discountedPrice);
}

export function computeDiscountedPriceOff(
  price: number,
  discountCode: PromoCode
): number {
  if (!validateDiscountCode(discountCode)) {
    return 0;
  }
  if (discountCode.discountType === 'dollar') {
    return discountCode.discount;
  }
  return Math.ceil(price * discountCode.discount / 100);
}
