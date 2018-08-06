// @flow

import React, { PureComponent } from 'react';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import HTText from '../HTText/HTText';
import foundation from '../../styles/foundation.scss';
import classNames from 'classnames';
import HTPreloadIndicator from '../../components/HTPreloadIndicator/HTPreloadIndicator';
import HTImage from '../HTImage/HTImage';
import styles from './OfferListing.scss';
import HTSlider from '../HTSlider/HTSlider';
import HTButton from '../HTButton/HTButton';
import HTLink from '../../containers/HTLink';
import HTCurrency from '../../containers/HTCurrency';
import mapPinIcon from '../../images/map_pin.svg';
import { diffDays } from '../../utils/time';

import type { IntlShape } from 'react-intl';
import type { OfferListItem } from '../../models/OfferListItem';

type Props = {
  intl: IntlShape,
  offer: OfferListItem,
};

class OfferListing extends PureComponent<Props> {
  renderLogo = () => {
    const hotel = this.props.offer.hotel;
    return (
      <div className={styles.logoContainer}>
        <div
          className={classNames(
            styles.logoWrapper,
            foundation['grid-container']
          )}
        >
          <HTImage
            src={hotel.logo || ''}
            alt={hotel.name}
            className={styles.logo}
            objectFit="fill"
          />
        </div>
      </div>
    );
  };

  renderSingleSlide = (src: string, index: number) => {
    const {
      offer: { id, bookingEndAt, hotel: { slug } },
      intl: { formatMessage },
    } = this.props;
    const expired = bookingEndAt.isBefore(moment());

    return (
      <div className={styles.slide} key={'slide' + index}>
        <HTLink to={`/hotel/${slug}/offer/${id}`} disabled={expired} isPrivate>
          <HTImage
            preloadIndicator={<HTPreloadIndicator />}
            type={'background'}
            src={src}
            alt={formatMessage({ id: 'image.icon.loading' })}
            objectFit={'cover'}
            width={'100%'}
            height={'100%'}
          />
        </HTLink>
      </div>
    );
  };

  renderSliderContent = () => {
    const { offer: { hotel: { images } } } = this.props;
    return images.map(this.renderSingleSlide);
  };

  render() {
    const {
      offer: {
        id,
        bookingEndAt,
        price,
        nightCount,
        hotel: { slug, name, city, country },
      },
    } = this.props;
    const expired = bookingEndAt.isBefore(moment());

    return (
      <div>
        <div className={styles.sliderContainer}>
          <HTSlider>{this.renderSliderContent()}</HTSlider>
          {this.renderLogo()}
        </div>
        <div
          className={classNames(foundation['grid-container'], styles.content)}
        >
          <div className={foundation['grid-x']}>
            <div
              className={classNames(
                foundation['small-6'],
                foundation['medium-5']
              )}
            >
              <div className={styles.hotelName}>{name.toUpperCase()}</div>
              <div className={styles.location}>
                <img src={mapPinIcon} alt="" />
                <span className={styles.city}>{city}</span>,{' '}
                <span className={styles.country}>{country}</span>
              </div>
            </div>
            <div
              className={classNames(
                foundation['small-4'],
                foundation['medium-5'],
                styles.priceWrapper
              )}
            >
              <div className={styles.startingFrom}>
                <HTText translationKey="offer.listing.starting_from" />
              </div>
              <div className={styles.pricePerNights}>
                <span className={styles.price}>
                  <HTCurrency value={nightCount * price} />
                </span>
                <span className={styles.perNights}>
                  <HTText
                    translationKey="offer.listing.per_nights"
                    values={{ nights: nightCount }}
                  />
                </span>
              </div>
              <div className={styles.bold}>
                <HTText translationKey="offer.listing.tax_inclusive" />
              </div>
              {expired ? (
                <div>
                  <HTText translationKey="offer.listing.expired" />
                </div>
              ) : (
                <div>
                  <HTText
                    translationKey="offer.listing.end_in"
                    values={{
                      days: (
                        <span className={styles.bold}>
                          <HTText
                            translationKey="offer.days"
                            values={{ days: diffDays(bookingEndAt, moment()) }}
                          />
                        </span>
                      ),
                    }}
                  />
                </div>
              )}
            </div>
            <div
              className={classNames(
                foundation['small-2'],
                foundation['medium-2']
              )}
            >
              <HTLink
                to={`/hotel/${slug}/offer/${id}`}
                disabled={expired}
                isPrivate
              >
                <HTButton
                  buttonType="green"
                  className={styles.viewDetailsButton}
                  contentClassName={styles.viewDetailsButtonContent}
                  isDisabled={expired}
                >
                  {expired ? (
                    <HTText translationKey="offer.listing.sold_out" />
                  ) : (
                    <HTText translationKey="offer.listing.view_details_button" />
                  )}
                </HTButton>
              </HTLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(OfferListing);
