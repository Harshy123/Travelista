// @flow
import yup from 'yup';
import moment from 'moment';

import type { Reservation } from '../models/Reservation';

const reservationDateSchema = yup.object().shape({
  id: yup.string().required(),
  num_rooms: yup.number().required(),
  staying_start_at: yup.date().required(),
  staying_end_at: yup.date().required(),
  price: yup.number().required(),
  promo_code: yup.string().nullable(),
  partner_code: yup.string().nullable(),
  currency: yup.string(),
  expired_at: yup.date().required(),
});

export function deserializeReservation(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<Reservation> {
  // eslint-disable-next-line flowtype/no-weak-types
  return reservationDateSchema.validate(response).then((val: any) => {
    const roomTypePackage = val.room_type_package;
    const roomType = roomTypePackage.room_type;
    return {
      id: val.id,
      from: moment(val.staying_start_at),
      to: moment(val.staying_end_at),
      expiredAt: moment(val.expired_at),
      price: val.price,
      currency: val.currency,
      capacity: {
        numberOfRooms: val.num_rooms,
        adults: val.num_adults,
        children: val.num_children,
        infants: val.num_infants,
      },
      promoCode: val.promo_code,
      partnerCode: val.partner_code,
      package: {
        id: roomTypePackage.id,
        name: roomTypePackage.name,
        image: roomTypePackage.image,
        roomType: {
          id: roomType.id,
          name: roomType.name,
          description: roomType.description,
          level: roomType.ordering,
          addOns: roomType.facilities,
          ordering: roomType.ordering,
          capacity: roomType.capacity,
          startingFrom: roomTypePackage.ratings.r1,
        },
        nights: roomTypePackage.nights,
        isSoldOut: roomTypePackage.is_sold_out,
        addOns: roomTypePackage.add_ons,
        startingFrom: roomTypePackage.ratings.r1,
        saveUpTo: roomTypePackage.save_up_to,
      },
    };
  });
}
