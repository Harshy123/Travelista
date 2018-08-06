// @flow
import moment from 'moment';
import pressSchema from '../schemas/press';

import type { Press } from '../models/Press';

export function deserializePress(
  // eslint-disable-next-line flowtype/no-weak-types
  response: any
): Promise<Press> {
  // eslint-disable-next-line flowtype/no-weak-types
  return pressSchema.validate(response).then((val: any) => {
    return { ...val, publishedAt: moment(val.publishedAt) };
  });
}
