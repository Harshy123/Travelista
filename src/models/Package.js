// @flow
import type { RoomType } from './RoomType';
import type { AddOn } from './AddOn';
export type Package = {
  id: string,
  name: string,
  image: string,
  roomType: RoomType,
  nights: number,
  isSoldOut: boolean,
  addOns: AddOn[],
  startingFrom: number,
  saveUpTo: number,
  description: string,
};
