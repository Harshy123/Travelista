// @flow

import React, { PureComponent } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { injectIntl } from 'react-intl';

import HTImage from '../HTImage/HTImage';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTCurrency from '../../containers/HTCurrency';
import { computePrice, computeDiscountedPrice } from '../../utils/price';
import { isPackageAvailable } from '../../utils/offer';

import type { IntlShape } from 'react-intl';
import type { Offer } from '../../models/Offer';
import type { HotelDate } from '../../models/HotelDate';
import type { Package } from '../../models/Package';
import type { RoomType } from '../../models/RoomType';
import type { Reservation } from '../../models/Reservation';
import type { PromoCode } from '../../models/PromoCode';
import type Moment from 'moment';

import foundation from '../../styles/foundation.scss';
import styles from './OfferUpgradesView.scss';

type Props = {
  intl: IntlShape,
  offer: Offer,
  promoCode: ?PromoCode,
  partnerCode: ?PromoCode,
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  },
  reservation: Reservation,
  fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
  onClickUpgradePackage: (Package, Moment, Moment) => void,
  onClickUpgradeRoomType: (Package, number) => void,
};

type State = {
  roomTypeUpgrade: {
    aPackage: ?Package,
    price: ?number,
    average: ?number,
  },
  packageUpgrade: {
    aPackage: ?Package,
    price: ?number,
    from: ?Moment,
    to: ?Moment,
  },
};

class OfferUpgradesView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      roomTypeUpgrade: {
        aPackage: null,
        price: null,
        average: null,
      },
      packageUpgrade: {
        aPackage: null,
        price: null,
        from: null,
        to: null,
      },
    };
  }

  componentWillMount() {
    this.fetchHotelDates().then(() => {
      this.setPackageUpgradeState();
      this.setRoomTypeUpgradeState();
    });
  }

  fetchHotelDates = () => {
    const {
      offer: { id, roomTypeInfo },
      reservation: { from },
      fetchHotelDates,
    } = this.props;
    const promises = Object.keys(roomTypeInfo).map((roomTypeId: string) => {
      const packages = roomTypeInfo[roomTypeId].packages;
      const maxNights = packages
        .map((p: Package) => p.nights)
        .reduce(
          (max: number, nights: number) => (max = nights > max ? nights : max)
        );
      const momentFrom = moment(from);
      const momentTo = moment(from).add(maxNights, 'days');
      return fetchHotelDates(id, roomTypeId, momentFrom, momentTo);
    });
    return Promise.all(promises);
  };

  computePrice = (p: Package): number => {
    const {
      reservation,
      offer,
      hotelDateMap,
      promoCode,
      partnerCode,
    } = this.props;
    const { capacity: { numberOfRooms }, from } = reservation;
    const to = moment(from)
      .add(p.nights, 'days')
      .toDate();
    const originalPrice =
      computePrice(
        numberOfRooms,
        from.toDate(),
        to,
        p.roomType,
        offer,
        hotelDateMap
      ) || 0;
    const discountedPrice = computeDiscountedPrice(
      originalPrice,
      promoCode,
      partnerCode
    );
    return discountedPrice;
  };

  isPackageAvailable = (p: Package): boolean => {
    const { reservation, offer, hotelDateMap } = this.props;
    const { capacity: { numberOfRooms }, from } = reservation;
    const to = moment(from).add(p.nights, 'days');
    return isPackageAvailable(
      numberOfRooms,
      from,
      to,
      p.roomType,
      offer,
      hotelDateMap
    );
  };

  setPackageUpgradeState = () => {
    const aPackage = this.getPackageUpgrade();
    if (aPackage) {
      const price = this.computePrice(aPackage);
      const { reservation: { from } } = this.props;
      const momentFrom = moment(from);
      const momentTo = moment(from).add(aPackage.nights, 'days');
      this.setState((state: State) => ({
        packageUpgrade: {
          ...state.packageUpgrade,
          aPackage,
          price,
          from: momentFrom,
          to: momentTo,
        },
      }));
    }
  };

  setRoomTypeUpgradeState = () => {
    const aPackage = this.getRoomTypeUpgrade();
    if (aPackage) {
      const price = this.computePrice(aPackage);
      this.setState((state: State) => ({
        roomTypeUpgrade: {
          ...state.roomTypeUpgrade,
          aPackage,
          price,
          average: price ? price / aPackage.nights : null,
        },
      }));
    }
  };

  searchUpgradeRoomType = (): ?RoomType => {
    const { reservation, offer: { hotel: { roomTypes } } } = this.props;
    const search = reservation.package.roomType.ordering;
    const roomType = roomTypes.find(
      (roomType: RoomType) => roomType.ordering > search
    );
    return roomType;
  };

  searchPackageOfRoomType = (roomType: RoomType): ?Package => {
    const { reservation, offer } = this.props;
    const search = reservation.package.nights;
    const packages = offer.roomTypeInfo[roomType.id].packages;
    const p = packages
      .filter((p: Package) => !p.isSoldOut)
      .filter((p: Package) => this.isPackageAvailable(p))
      .find((p: Package) => p.nights === search);

    return p;
  };

  getRoomTypeUpgrade = (): ?Package => {
    const upgradeRoomType = this.searchUpgradeRoomType();
    if (!upgradeRoomType) {
      return null;
    }
    const upgradePackage = this.searchPackageOfRoomType(upgradeRoomType);
    if (!upgradePackage) {
      return null;
    }
    return upgradePackage;
  };

  getPackageUpgrade = (): ?Package => {
    const { reservation, offer: { roomTypeInfo } } = this.props;
    const { from, to } = reservation;
    const { roomType: { id } } = reservation.package;
    const nights = to.startOf('day').diff(from.startOf('day'), 'days');
    const p = roomTypeInfo[id].packages
      .filter((p: Package) => !p.isSoldOut)
      .filter((p: Package) => this.isPackageAvailable(p))
      .find((p: Package) => p.nights > nights);
    return p;
  };

  onClickUpgradeRoomType = () => {
    const { roomTypeUpgrade } = this.state;
    if (roomTypeUpgrade) {
      const { aPackage, price } = roomTypeUpgrade;
      if (aPackage && price) {
        this.props.onClickUpgradeRoomType(aPackage, price);
      }
    }
  };

  onClickUpgradePackage = () => {
    const { packageUpgrade } = this.state;
    if (packageUpgrade) {
      const { aPackage, from, to } = packageUpgrade;
      if (aPackage && from && to) {
        this.props.onClickUpgradePackage(aPackage, from, to);
      }
    }
  };

  renderRecommendedRoomType = () => {
    const { roomTypeUpgrade: { aPackage, price, average } } = this.state;
    const {
      intl: { formatMessage },
      reservation: { price: currentPrice },
    } = this.props;

    if (!aPackage) {
      return null;
    }

    return (
      <div className={styles.recommendedContainer}>
        <div className={styles.recommendedImageContainer}>
          {aPackage && (
            <HTImage
              src={aPackage.image}
              alt={aPackage.name}
              objectFit={'cover'}
              width={'100%'}
              height={'100%'}
            />
          )}
        </div>
        <div className={styles.recommendedInfo}>
          <div className={styles.recommendedInfoTitle}>
            <HTText translationKey={'packages.step2.upgrade_room_type'} />
          </div>
          <div className={styles.recommendedInfoPrice}>
            {price ? <HTCurrency value={price - currentPrice} /> : null}
          </div>
          <div className={styles.recommendedInfoBlurb}>
            <HTText
              translationKey={'packages.step2.average'}
              values={{
                price: average ? <HTCurrency value={average} /> : null,
              }}
            />
          </div>
          <HTButton
            buttonType="green"
            contentClassName={styles.recommendedButtonContent}
            text={formatMessage({ id: 'packages.step2.upgrade_and_pay' })}
            onClick={this.onClickUpgradeRoomType}
          />
        </div>
      </div>
    );
  };

  renderRecommendedPackage = () => {
    const { packageUpgrade: { aPackage, price, from, to } } = this.state;
    const {
      intl: { formatMessage },
      reservation: { price: currentPrice },
    } = this.props;

    if (!aPackage) {
      return null;
    }
    return (
      <div className={styles.recommendedContainer}>
        <div className={styles.recommendedImageContainer}>
          {aPackage && (
            <HTImage
              src={aPackage.image}
              alt={aPackage.name}
              objectFit={'cover'}
              width={'100%'}
              height={'100%'}
            />
          )}
        </div>
        <div className={styles.recommendedInfo}>
          <div className={styles.recommendedInfoTitle}>
            {aPackage && (
              <HTText
                translationKey="packages.step2.stay_longer"
                values={{ nights: aPackage.nights }}
              />
            )}
          </div>
          <div className={styles.recommendedInfoPrice}>
            {price ? <HTCurrency value={price - currentPrice} /> : null}
          </div>
          <div className={styles.recommendedInfoBlurb}>
            {from &&
              to && (
                <HTText
                  translationKey="packages.step2.date_range"
                  values={{
                    from: from.format('DD/MM/YYYY'),
                    to: to.format('DD/MM/YYYY'),
                  }}
                />
              )}
          </div>
          <HTButton
            buttonType="green"
            contentClassName={styles.recommendedButtonContent}
            text={formatMessage({ id: 'packages.step2.upgrade_and_pay' })}
            onClick={this.onClickUpgradePackage}
          />
        </div>
      </div>
    );
  };

  render() {
    const { roomTypeUpgrade, packageUpgrade } = this.state;
    if (!roomTypeUpgrade.aPackage && !packageUpgrade.aPackage) {
      return null;
    }
    return (
      <section
        className={cn(styles.upgradeContainer, foundation['grid-container'])}
      >
        <div className={styles.upgradeTitle}>
          <HTText translationKey={'packages.step2.want_to_upgrade'} />
        </div>
        <div className={foundation['grid-x']}>
          <div className={cn(styles.recommendLeft, foundation['medium-6'])}>
            {this.renderRecommendedRoomType()}
          </div>
          <div className={cn(styles.recommendRight, foundation['medium-6'])}>
            {this.renderRecommendedPackage()}
          </div>
        </div>
      </section>
    );
  }
}

export default injectIntl(OfferUpgradesView);
