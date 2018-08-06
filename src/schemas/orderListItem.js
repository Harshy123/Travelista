import yup from 'yup';

import hotelSchema from './hotel';
import MomentDateSchemaType from './MomentDateSchemaType';

const orderListItemSchema = yup.object().shape({
  id: yup.string().required(),
  ref_number: yup.string().required(),
  staying_start_at: new MomentDateSchemaType().required(),
  staying_end_at: new MomentDateSchemaType().required(),
  hotel: hotelSchema.required(),
  image: yup.string(),
});

export default orderListItemSchema;
