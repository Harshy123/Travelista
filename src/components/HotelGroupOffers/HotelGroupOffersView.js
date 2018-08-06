// @flow

import React, { PureComponent } from 'react';
import cn from 'classnames';

import foundation from '../../styles/foundation.scss';
import styles from './HotelGroupOffersView.scss';

import HTText from '../HTText/HTText';
import HTLoadingPage from '../HTLoadingPage/HTLoadingPage';
import OfferListing from '../OfferListing/OfferListing';
import HTFooter from '../HTFooter/HTFooter';
import Advertisement from '../../containers/Advertisement';

import type { HotelGroup } from '../../models/HotelGroup';
import type { OfferListItem } from '../../models/OfferListItem';
import type { Request } from '../../types';

type Props = {
  hotelGroup: HotelGroup,
  offers: OfferListItem[],
  request: Request,
  fetchOffers: string => void,
};

export default class HotelGroupOffersView extends PureComponent<Props> {
  componentWillMount() {
    const hotelGroup = this.props.hotelGroup;
    this.props.fetchOffers(hotelGroup.slug);
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisHotelGroupSlug = this.props.hotelGroup
      ? this.props.hotelGroup.slug
      : null;
    const nextHotelGroupSlug = nextProps.hotelGroup
      ? nextProps.hotelGroup.slug
      : null;
    if (thisHotelGroupSlug !== nextHotelGroupSlug && nextHotelGroupSlug) {
      this.props.fetchOffers(nextHotelGroupSlug);
    }
  }

  renderEmpty = () => {
    return (
      <section className={styles.offers}>
        <div className={styles.emptyContainer}>
          <div className={foundation['grid-container']}>
            <HTText translationKey={'hotel_group.offer.empty'} />
          </div>
        </div>
      </section>
    );
  };

  renderOffers = () => {
    const { offers } = this.props;
    return (
      <section className={styles.offers}>
        <div>
          {offers.map((offer: OfferListItem, i: number) => {
            return <OfferListing offer={offer} key={'offer' + i} />;
          })}
        </div>
      </section>
    );
  };

  renderOffersView = () => {
    const { offers, request } = this.props;
    if (!request.requesting && offers.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderOffers();
    }
  };

  render() {
    const { hotelGroup: { name }, request } = this.props;
    if (request.requesting) {
      return <HTLoadingPage />;
    }
    return (
      <div>
        <section className={styles.offerHeader}>
          <div
            className={cn(
              foundation['grid-container'],
              styles.offerHeaderWrapper
            )}
          >
            <h2 className={cn(styles.title, foundation['hide-for-small-only'])}>
              <HTText
                translationKey={'hotel_group.offer.title'}
                values={{ name: name.toUpperCase() }}
              />
            </h2>
          </div>
        </section>
        {this.renderOffersView()}
        <Advertisement />
        <HTFooter />
      </div>
    );
  }
}
