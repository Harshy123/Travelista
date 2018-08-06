// @flow

import type Moment from 'moment';
import type { HotelDate } from '../models/HotelDate';
import type { OfferListItem } from '../models/OfferListItem';
import type { Offer } from '../models/Offer';
import type { Package } from '../models/Package';
import type { PageInfo, Request } from '../types';

export type RecommendedRoomTypeUpgrade = {
  package: Package,
  price: number,
  average: number,
};

export type RecommendedPackageUpgrade = {
  package: Package,
  price: number,
  from: Moment,
  to: Moment,
};

export type OfferState = {
  offerEntry: ?Offer,
  offerListItems: OfferListItem[],
  featuredOfferListItems: OfferListItem[],
  similarOfferListItems: OfferListItem[],
  fetchOfferRequest: Request,
  fetchOffersRequest: Request,
  fetchFeaturedOffersRequest: Request,
  fetchSimilarOffersRequest: Request,
  offersPageInfo: PageInfo,
  // using date duration string for hotel date key
  // see utils/time.js
  hotelDateRequests: {
    [string]: Request,
  },
  hotelDateMap: {
    // this key is contructed using the combinations of
    // offerId and roomTypeId
    [string]: {
      // using date string for hotel date key
      // see utils/time.js
      [string]: HotelDate,
    },
  },
  recommendedRoomTypeUpgrade: ?RecommendedRoomTypeUpgrade,
  recommendedPackageUpgrade: ?RecommendedPackageUpgrade,
  recommendedRequest: Request,
};
