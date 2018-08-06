// @flow
import type Moment from 'moment';

export type Travelista = {
  salutation: string,
  firstName: string,
  lastName: string,
  passportName: string,
  email: string,
  countryOfResidence: string,
  mobileNumber: string,
  specialRequest: ?string,
};

export type TravelistaTrip = {
  arrivalDate: ?Moment,
  arrivalFlight: ?string,
  departureDate: ?Moment,
  departureFlight: ?string,
  updateProfile: boolean,
  saveSpecialRequest: boolean,
};
