// @flow

import yup from 'yup';

import type { ObjectSchema } from 'yup';
import type { Press } from '../models/Press';

const pressSchema: ObjectSchema<Press> = yup
  .object()
  .shape({
    id: yup.string().required(),
    title: yup.string().required(),
    file: yup.string().required(),
    publishedAt: yup.date().required(),
  })
  .camelCase();

export default pressSchema;
