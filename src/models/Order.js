// @flow

import type Moment from 'moment';

import type { Travelista } from './Travelista';
import type { Capacity } from './Capacity';
import type { SimpleHotel } from './Hotel';

export type OrderTravelista = {
  ...Travelista,
  trip: {
    arrivalDate: ?Moment,
    arrivalFlight: ?string,
    departureDate: ?Moment,
    departureFlight: ?string,
  },
};

export type Order = {
  id: string,
  userId: string,
  from: Moment,
  to: Moment,
  bookingDate: Moment,
  price: number,
  currency: string,
  capacity: Capacity,
  creditCard: {
    brand: string,
    lastFour: string,
  },
  package: {
    id: string,
    name: string,
    image: string,
    description: string,
    roomType: {
      id: string,
      name: string,
      description: string,
    },
  },
  hotel: SimpleHotel,
  offerId: string,
  travelistas: OrderTravelista[],
  refNumber: string,
};
