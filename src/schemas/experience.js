// @flow
import yup from 'yup';

const experienceSchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
});

export default experienceSchema;
