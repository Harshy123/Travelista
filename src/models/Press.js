// @flow
import type Moment from 'moment';

export type Press = {
  id: string,
  title: string,
  file: string,
  publishedAt: Moment,
};
