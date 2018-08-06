// @flow
import experienceSchema from '../schemas/experience';
import type { Experience } from '../models/Experience';

// eslint-disable-next-line flowtype/no-weak-types
export function deserializeExperience(response: any): Promise<Experience> {
  // eslint-disable-next-line flowtype/no-weak-types
  return experienceSchema.validate(response).then((val: any) => {
    return {
      id: val.id,
      name: val.name,
    };
  });
}
