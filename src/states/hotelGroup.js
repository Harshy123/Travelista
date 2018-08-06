// @flow

import type { Request } from '../types/index';
import type { HotelGroup } from '../models/HotelGroup';
import type { OfferListItem } from '../models/OfferListItem';

export type HotelGroupState = {
  hotelGroups: HotelGroup[],
  fetchHotelGroupsRequest: Request,
  hotelGroup: ?HotelGroup,
  fetchHotelGroupRequest: Request,
  offerListItems: OfferListItem[],
  fetchOffersRequest: Request,
};
