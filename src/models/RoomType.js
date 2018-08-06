// @flow
import type { AddOn } from './AddOn';

export type RoomType = {
  id: string,
  name: string,
  description: string,
  level: number,
  addOns: AddOn[],
  startingFrom: number,
  capacity: number,
  ordering: number,
};
