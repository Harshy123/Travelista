// @flow
import type Moment from 'moment';

export type HotelDate = {
  date: Moment,
  isAvailable: boolean,
  price: number,
  rooms: number,
};
