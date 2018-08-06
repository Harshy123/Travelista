// @flow
import yup from 'yup';

const userTravelistaSchema = yup.object().shape({
  salutation: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  passport_name: yup.string().required(),
  email: yup.string().required(),
  mobile_number: yup.string().required(),
  country_of_residence: yup.string().required(),
  ordering: yup.number().required(),
});

export default userTravelistaSchema;
