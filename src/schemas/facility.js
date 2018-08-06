// @flow
import yup from 'yup';

const facilitySchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  image: yup.string().required(),
});

export default facilitySchema;
