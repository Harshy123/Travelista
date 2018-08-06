// @flow
import yup from 'yup';
import moment from 'moment';

import hotelSchema from '../schemas/hotel';
import type { Order } from '../models/Order';

const orderDateSchema = yup.object().shape({
  id: yup.string().required(),
  user_id: yup.string().required(),
  num_rooms: yup.number().required(),
  num_adults: yup.number().required(),
  num_children: yup.number().required(),
  num_infants: yup.number().required(),
  staying_start_at: yup.date().required(),
  staying_end_at: yup.date().required(),
  book_at: yup.date().required(),
  price: yup.number().required(),
  promo_code: yup.string().nullable(),
  partner_code: yup.string().nullable(),
  currency: yup.string().required(),
  payment_method_info: yup.object().shape({
    credit_card_last_four: yup.string(),
    credit_card_brand: yup.string(),
  }),
  room_type_package: yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
    image: yup.string(),
    room_type: yup.object().shape({
      id: yup.string().required(),
      name: yup.string().required(),
      description: yup.string().required(),
    }),
  }),
  hotel: hotelSchema,
  travelista_details: yup
    .array()
    .of(
      yup.object().shape({
        salutation: yup.string().required(),
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        passport_name: yup.string().required(),
        email: yup.string().required(),
        mobile_number: yup.string().required(),
        country_of_residence: yup.string().required(),
        ordering: yup.number().required(),
        arrival_date: yup.string().nullable(),
        arrival_airline: yup.string().nullable(),
        arrival_flight_number: yup.string().nullable(),
        departure_date: yup.string().nullable(),
        departure_airline: yup.string().nullable(),
        departure_flight_number: yup.string().nullable(),
        special_request: yup.string().nullable(),
      })
    )
    .required(),
  ref_number: yup.string().required(),
});

export function deserializeOrder(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<Order> {
  // eslint-disable-next-line flowtype/no-weak-types
  return orderDateSchema.validate(response).then((val: any) => {
    return {
      id: val.id,
      userId: val.user_id,
      from: moment(val.staying_start_at),
      to: moment(val.staying_end_at),
      bookingDate: moment(val.book_at),
      price: val.price,
      currency: val.currency,
      capacity: {
        numberOfRooms: val.num_rooms,
        adults: val.num_adults,
        children: val.num_children,
        infants: val.num_infants,
      },
      creditCard: {
        brand: val.payment_method_info
          ? val.payment_method_info.credit_card_brand
          : '',
        lastFour: val.payment_method_info
          ? val.payment_method_info.credit_card_last_four
          : '',
      },
      package: {
        id: val.room_type_package.id,
        name: val.room_type_package.name,
        image: val.room_type_package.image,
        description: val.room_type_package.description,
        roomType: {
          id: val.room_type_package.room_type.id,
          name: val.room_type_package.room_type.name,
          description: val.room_type_package.room_type.description,
        },
      },
      hotel: val.hotel,
      offerId: val.offer_id,
      // eslint-disable-next-line flowtype/no-weak-types
      travelistas: val.travelista_details.map((travelistaDetails: any) => ({
        salutation: travelistaDetails.salutation,
        firstName: travelistaDetails.first_name,
        lastName: travelistaDetails.last_name,
        passportName: travelistaDetails.passport_name,
        email: travelistaDetails.email,
        countryOfResidence: travelistaDetails.country_of_residence,
        mobileNumber: travelistaDetails.mobile_number,
        specialRequest: travelistaDetails.special_request,
        trip: {
          arrivalDate:
            travelistaDetails.arrival_date &&
            moment(travelistaDetails.arrival_date),
          arrivalFlight: travelistaDetails.arrival_flight_number,
          departureDate:
            travelistaDetails.departure_date &&
            moment(travelistaDetails.departure_date),
          departureFlight: travelistaDetails.departure_flight_number,
        },
      })),
      refNumber: val.ref_number,
    };
  });
}
