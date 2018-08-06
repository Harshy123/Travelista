// @flow
import userTravelistaSchema from '../schemas/userTravelista';
import type { UserTravelista } from '../models/UserTravelista';

export function deserializeUserTravelista(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<UserTravelista> {
  // eslint-disable-next-line flowtype/no-weak-types
  return userTravelistaSchema.validate(response).then((val: any) => {
    return {
      salutation: val.salutation,
      firstName: val.first_name,
      lastName: val.last_name,
      passportName: val.passport_name,
      email: val.email,
      countryOfResidence: val.country_of_residence,
      mobileNumber: val.mobile_number,
      ordering: val.ordering,
    };
  });
}
