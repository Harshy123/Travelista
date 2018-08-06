// @flow
import yup from 'yup';
import type { Advertisement } from '../models/Advertisement';

const advertisementSchema = yup.object().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
  url: yup.string().required(),
  image: yup.string().required(),
});

export function deserializeAdvertisement(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<Advertisement> {
  // eslint-disable-next-line flowtype/no-weak-types
  return advertisementSchema.validate(response).then((val: any) => {
    return {
      id: val.id,
      name: val.name,
      description: val.description,
      url: val.url,
      image: val.image,
    };
  });
}
