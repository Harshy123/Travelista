// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';

import { generateOfferLink } from '../../models/Offer';
import facebookShareIcon from '../../images/ic_share_facebook.svg';

import styles from './Account.scss';

import type Moment from 'moment';
import type { IntlShape } from 'react-intl';
import type { Request } from '../../types/index';
import type { OrderListItem } from '../../models/OrderListItem';

type Props = {
  intl: IntlShape,
  type: 'future' | 'completed',
  push: string => void,
  request: Request,
  trips: OrderListItem[],
};

class MyTripsView extends PureComponent<Props> {
  render() {
    const { request: { requesting } } = this.props;
    if (requesting) {
      return (
        <div className={styles.loadingTrips}>
          <HTLoadingIndicator />
        </div>
      );
    }
    return (
      <div className={styles.myTripsContainer}>{this.renderMyTrips()}</div>
    );
  }

  renderMyTrips = () => {
    const { intl: { formatMessage }, trips, type } = this.props;
    if (trips.length === 0) {
      return (
        <div className={styles.noTrips}>
          <HTText translationKey={`account.tab.my_trips.no_${type}_trip`} />
        </div>
      );
    }
    const formatDate = (m: Moment) => m.format('D MMM YY').toUpperCase();
    return trips.map((trip: OrderListItem) => (
      <div className={styles.myTrip} key={trip.id}>
        <div className={styles.myTripImage}>
          <img src={trip.image} alt={trip.hotel.name} />
        </div>
        <div className={styles.myTripDetail}>
          <div>
            <div className={styles.myTripHeading}>
              <h1 className={styles.myTripTitle}>{trip.hotel.name}</h1>
              <div className={styles.myTripDate}>
                {formatDate(trip.from)} - {formatDate(trip.to)}
              </div>
            </div>
            <div className={styles.myTripPlace}>{trip.hotel.address}</div>
          </div>
          <div className={styles.myTripBookingRef}>
            <HTText
              translationKey={'account.tab.my_trips.booking_ref_no'}
              values={{ ref: trip.refNumber }}
            />
          </div>
          <div className={styles.myTripActions}>
            <div className={styles.myTripShare}>
              <div className={styles.myTripShareTitle}>
                <HTText translationKey={'account.tab.my_trips.share_my_trip'} />
              </div>
              <div className={styles.socialMedia}>
                <button
                  onClick={() => {
                    this.handleFacebookShareClick(trip);
                  }}
                >
                  <img
                    alt={formatMessage({ id: 'image.social_media.facebook' })}
                    src={facebookShareIcon}
                    className={styles.socialMediaIcon}
                  />
                </button>
              </div>
            </div>
            <HTButton
              className={styles.myTripActionButton}
              buttonType={'hollowBrown'}
              onClick={this.goto(`order/${trip.id}`)}
              text={formatMessage({
                id: 'account.tab.my_trips.view_detail',
              })}
            />
          </div>
        </div>
      </div>
    ));
  };

  handleFacebookShareClick = (order: OrderListItem) => {
    const offerLink = generateOfferLink(order.hotel.slug, order.offerId);

    FB.ui(
      {
        method: 'share',
        href: offerLink,
      },
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // eslint-disable-next-line no-console
        console.log('Facebook share response', response);
      }
    );
  };

  goto = (dst: string) => () => {
    this.props.push(dst);
  };
}

export default injectIntl(MyTripsView);
