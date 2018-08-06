// @flow

import React, { PureComponent } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import foundation from '../../styles/foundation.scss';
import styles from './OfferCollection.scss';
import clockIcon from '../../images/ic_clock.svg';
import { injectIntl } from 'react-intl';
import { diffDays } from '../../utils/time';
import HTText from '../HTText/HTText';
import HTImage from '../HTImage/HTImage';
import HTLink from '../../containers/HTLink';
import HTCurrency from '../../containers/HTCurrency';
import type { IntlShape } from 'react-intl';
import type { OfferListItem } from '../../models/OfferListItem';

type Props = {
  intl: IntlShape,
  offers: OfferListItem[],
};
// Possibly to be extended to cater search results and user's wishlist also
export class OfferCollection extends PureComponent<Props> {
  renderLogo = (offer: OfferListItem) => {
    const { logo, name } = offer.hotel;
    return (
      <div className={styles.logoContainer}>
        <div
          className={classNames(
            styles.logoWrapper,
            foundation['grid-container']
          )}
        >
          <HTImage
            src={logo || ''}
            alt={name}
            className={styles.logo}
            objectFit="fill"
          />
        </div>
      </div>
    );
  };

  renderContent = (offer: OfferListItem) => {
    const { intl: { formatMessage } } = this.props;
    const { bookingEndAt, price, nightCount, hotel: { name, address } } = offer;
    const days = diffDays(bookingEndAt, moment());
    return (
      <div className={classNames(foundation['grid-container'], styles.content)}>
        <div className={foundation['grid-x']}>
          <div
            className={classNames(
              foundation['small-12'],
              foundation['medium-6']
            )}
          >
            <div className={styles.hotelName}>{name.toUpperCase()}</div>
            <div className={styles.location}>{address}</div>
          </div>
          <div
            className={classNames(
              foundation['small-12'],
              foundation['medium-6'],
              styles.timeWrapper
            )}
          >
            <div className={styles.priceAndTime}>
              <div className={styles.price}>
                <HTText
                  translationKey={'offer.listing.pricing'}
                  values={{
                    days: nightCount,
                    price: <HTCurrency value={nightCount * price} />,
                  }}
                />
              </div>
              <div className={styles.time}>
                <img
                  alt={formatMessage({ id: 'image.icon.clock' })}
                  src={clockIcon}
                  className={styles.clockIcon}
                />
                <div className={styles.timeDetail}>
                  {days > 0 ? (
                    <HTText
                      translationKey={'offer.listing.end_in'}
                      values={{
                        days: (
                          <span className={styles.days}>
                            <HTText
                              translationKey={'offer.days'}
                              values={{
                                days,
                              }}
                            />
                          </span>
                        ),
                      }}
                    />
                  ) : (
                    <span className={styles.days}>
                      <HTText translationKey={'offer.listing.expired'} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderOffer = (offer: OfferListItem, i: number) => {
    const { id, hotel } = offer;
    return (
      <div
        key={'offer' + i}
        className={classNames(styles.container, foundation['medium-6'])}
      >
        <HTLink to={`/hotel/${hotel.slug}/offer/${id}`} isPrivate>
          <div className={styles.imageContainer}>
            <HTImage
              src={hotel.images[0]}
              alt={hotel.name}
              objectFit={'cover'}
              className={styles.hotelImage}
              type="background"
            />
            {this.renderLogo(offer)}
          </div>
          {this.renderContent(offer)}
        </HTLink>
      </div>
    );
  };

  render() {
    const { offers } = this.props;
    return (
      <div className={foundation['grid-container']}>
        <div className={foundation['grid-x']}>
          {offers.map(this.renderOffer)}
        </div>
      </div>
    );
  }
}

export default injectIntl(OfferCollection);
