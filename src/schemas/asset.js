// @flow
import yup from 'yup';

const assetSchema = yup.object().shape({
  url: yup.string(),
});

export default assetSchema;
