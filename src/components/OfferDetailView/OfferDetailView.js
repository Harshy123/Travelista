// @flow

import React, { Fragment, PureComponent } from 'react';
import { Route, Switch } from 'react-router';
import { injectIntl } from 'react-intl';
import cn from 'classnames';
import moment from 'moment';

import foundation from '../../styles/foundation.scss';
import styles from './OfferDetailView.scss';
import HTSlider from '../HTSlider/HTSlider';
import HTImage from '../HTImage/HTImage';
import HTPreloadIndicator from '../HTPreloadIndicator/HTPreloadIndicator';

import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import OfferDetailDesktop from './OfferDetailDesktop';
import OfferDetailMobile from './OfferDetailMobile';
import OfferDetailNavBar from '../OfferDetailNavBar/OfferDetailNavBar';
import PackageStep1 from './PackageStep1';
import PackageStep2 from './PackageStep2';
import HTFooter from '../HTFooter/HTFooter';
import RedirectToHomePage from '../RedirectToHomePage/RedirectToHomePage';

import { mustBe } from '../../utils/utils';
import { toastrSuccess } from '../../utils/toastr';

import type { IntlShape } from 'react-intl';
import type { Match } from 'react-router';
import type Moment from 'moment';
import type { OfferStep1FormData } from './PackageStep1';
import type { Capacity } from '../../models/Capacity';
import type { Offer } from '../../models/Offer';
import type { Request } from '../../types';
import type { Package } from '../../models/Package';
import type { RoomType } from '../../models/RoomType';
import type { HotelDate } from '../../models/HotelDate';
import type { Reservation } from '../../models/Reservation';
import type { PromoCode } from '../../models/PromoCode';
import type { User } from '../../models/User';
import type { PaymentInfo } from '../../models/PaymentInfo';
import type { Order } from '../../models/Order';
import type { Travelista, TravelistaTrip } from '../../models/Travelista';

type Props = {
  intl: IntlShape,
  currency: string,
  user: User,
  offer: ?Offer,
  order: ?Order,
  match: Match,
  request: Request,
  promoCode: ?PromoCode,
  hotelDateRequests: {
    [string]: Request,
  },
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  },
  replace: string => void,
  // default package generated using query string
  defaultPackage: ?Package,
  reservation: ?Reservation,
  makeReservationRequest: Request,
  makeOrderRequest: Request,
  makeReservation: (
    string,
    Moment,
    Moment,
    Capacity,
    promoCode?: string
  ) => void,
  fetchOrder: string => void,
  fetchOrderRequest: Request,
  fetchReservation: string => void,
  fetchReservationRequest: Request,
  flushReservation: () => void,
  fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
  flushHotelDateRequests: () => void,
  recommendedRequest: Request,
  makeOrder: (
    Reservation,
    { user: Travelista, trip: TravelistaTrip }[],
    stripeToken: ?string,
    PaymentInfo
  ) => void,
  openPackageDescriptionModal: (p: Package, roomType: RoomType) => void,
};

type State = {
  step1Data: ?OfferStep1FormData,
};

class OfferDetailView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      step1Data: null,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const { match: thisMatch } = this.props;
    const { match: nextMatch, defaultPackage, offer, replace } = nextProps;
    const { step1Data } = this.state;
    const nextReservation = nextProps.reservation;
    const thisReservation = this.props.reservation;
    const step1Path = '/hotel/:hotelSlug/offer/:id/booking/1';
    // Redirect
    if (offer != null) {
      if (
        thisMatch.path !== nextMatch.path &&
        nextMatch.path === step1Path &&
        defaultPackage == null
      ) {
        replace('/all-offers');
      }
    }

    if (step1Data && thisReservation == null && nextReservation != null) {
      const { replace, offer } = this.props;
      const offerId = offer != null ? offer.id : '';
      const data = step1Data;
      if (offer) {
        replace(
          `/hotel/${offer.hotel.slug}/offer/${offerId}/booking/2?roomTypeId=${
            data.package.roomType.id
          }&packageId=${data.package.id}&reservationId=${nextReservation.id}`
        );
      }
    }

    if (
      step1Data &&
      defaultPackage &&
      (step1Data.package.id !== defaultPackage.id ||
        step1Data.package.roomType.id !== defaultPackage.roomType.id)
    ) {
      // NOTE(limouren): this setState tries to reset the date selection
      // after a package upgrade.
      // $FlowFixMe
      this.setState({
        step1Data: {
          ...this.state.step1Data,
          package: defaultPackage,
          from: null,
          to: null,
        },
      });
    }
  }

  onSubmitStep1 = (data: OfferStep1FormData) => {
    this.setState(
      {
        step1Data: data,
      },
      () => {
        const { makeReservation } = this.props;
        makeReservation(
          data.package.id,
          moment(data.from),
          moment(data.to),
          data.capacity,
          data.promoCode
        );
      }
    );
  };

  onClickUpgradePackage = (p: Package, from: Moment, to: Moment) => {
    const { offer, reservation, replace, intl: { formatMessage } } = this.props;
    if (offer && p && from && to) {
      this.setState(
        (state: State) => {
          const revervation_ = mustBe(reservation);
          return {
            step1Data: {
              from: from.toDate(),
              to: to.toDate(),
              capacity: revervation_.capacity,
              package: p,
              price: revervation_.price,
              promoCode: revervation_.promoCode || '',
            },
          };
        },
        () => {
          toastrSuccess(
            formatMessage(
              { id: 'packages.step2.stay_longer.message' },
              { nights: to.startOf('day').diff(from.startOf('day'), 'days') }
            )
          );
          replace(
            `/hotel/${offer.hotel.slug}/offer/${
              offer.id
            }/booking/1?roomTypeId=${p.roomType.id}&packageId=${p.id}`
          );
        }
      );
    }
  };

  onClickUpgradeRoomType = (p: Package, price: number) => {
    const { reservation, intl: { formatMessage } } = this.props;
    if (p && price) {
      const revervation_ = mustBe(reservation);
      const data = {
        from: revervation_.from.toDate(),
        to: revervation_.to.toDate(),
        capacity: revervation_.capacity,
        price,
        package: p,
        promoCode: revervation_.promoCode || '',
      };

      const { makeReservation } = this.props;
      makeReservation(
        data.package.id,
        moment(data.from),
        moment(data.to),
        data.capacity,
        data.promoCode
      );

      toastrSuccess(
        formatMessage(
          { id: 'packages.step2.upgrade_room_type.message' },
          { roomType: p.roomType.name }
        )
      );
    }
  };

  render() {
    const { step1Data } = this.state;
    const {
      currency,
      hotelDateRequests,
      hotelDateMap,
      defaultPackage,
      replace,
      request,
      user,
      offer,
      promoCode,
      fetchHotelDates,
      flushHotelDateRequests,
      reservation,
      makeReservationRequest,
      makeOrderRequest,
      fetchReservationRequest,
      fetchReservation,
      flushReservation,
      recommendedRequest,
      makeOrder,
      openPackageDescriptionModal,
    } = this.props;
    const { partnerCode } = this.props.user;
    if (request.requesting) {
      return this.renderLoading();
    }
    return (
      <Fragment>
        <div className={styles.offerDetailContainer}>
          <Switch>
            <Route exact path="/hotel/:hotelSlug/offer/:id/booking/1">
              {offer &&
                (defaultPackage ? (
                  <PackageStep1
                    currency={currency}
                    defaultPackage={defaultPackage}
                    formData={step1Data}
                    hotelDateMap={hotelDateMap}
                    offer={offer}
                    promoCode={promoCode}
                    partnerCode={partnerCode}
                    replace={replace}
                    makeReservationRequest={makeReservationRequest}
                    flushReservation={flushReservation}
                    onSubmitStep1={this.onSubmitStep1}
                    hotelDateRequests={hotelDateRequests}
                    fetchHotelDates={fetchHotelDates}
                    flushHotelDateRequests={flushHotelDateRequests}
                  />
                ) : (
                  <RedirectToHomePage />
                ))}
            </Route>
            <Route exact path="/hotel/:hotelSlug/offer/:id/booking/2">
              <div>
                {offer && (
                  <PackageStep2
                    user={user}
                    offer={offer}
                    hotelDateMap={hotelDateMap}
                    replace={replace}
                    step1Data={step1Data}
                    reservation={reservation}
                    promoCode={promoCode}
                    partnerCode={partnerCode}
                    onClickUpgradePackage={this.onClickUpgradePackage}
                    onClickUpgradeRoomType={this.onClickUpgradeRoomType}
                    recommendedRequest={recommendedRequest}
                    makeOrderRequest={makeOrderRequest}
                    makeOrder={makeOrder}
                    fetchReservationRequest={fetchReservationRequest}
                    fetchReservation={fetchReservation}
                    fetchHotelDates={fetchHotelDates}
                  />
                )}
              </div>
            </Route>
            <Route exact path="/hotel/:hotelSlug/offer/:id">
              <div>
                {offer && (
                  <div>
                    <OfferDetailNavBar />
                    {this.renderSlider(offer)}
                    <div>
                      <HTPageTitle
                        translationKey={'page.title.offer_detail'}
                        values={{ hotel: offer.hotel.name }}
                        descriptionKey="page.description.offer_detail"
                      />
                      <OfferDetailDesktop
                        offer={offer}
                        hotelDateMap={hotelDateMap}
                        hotelDateRequests={hotelDateRequests}
                        fetchHotelDates={fetchHotelDates}
                        flushHotelDateRequests={flushHotelDateRequests}
                        openPackageDescriptionModal={
                          openPackageDescriptionModal
                        }
                      />
                      <OfferDetailMobile offer={offer} />
                    </div>
                  </div>
                )}
              </div>
            </Route>
          </Switch>
        </div>
        <HTFooter />
      </Fragment>
    );
  }

  renderSingleSlide = (src: string, index: number) => {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className={styles.slide} key={'slide' + index}>
        <HTImage
          preloadIndicator={<HTPreloadIndicator />}
          type={'background'}
          src={src}
          alt={formatMessage({ id: 'image.icon.loading' })}
          objectFit={'cover'}
          width={'100%'}
          height={'100%'}
        />
      </div>
    );
  };

  renderSliderContent = (offer: Offer) => {
    return offer.hotel.images.map(this.renderSingleSlide);
  };

  renderSlider = (offer: Offer) => {
    return (
      <div className={styles.sliderContainer}>
        <HTSlider>{this.renderSliderContent(offer)}</HTSlider>
        {this.renderLogo(offer)}
      </div>
    );
  };

  renderLogo = (offer: Offer) => {
    const { hotel: { name, address, logo } } = offer;
    return (
      <div className={cn(styles.logoWrapper, foundation['grid-container'])}>
        <div className={styles.logoContainer}>
          <img alt={name} src={logo || ''} className={styles.logo} />
        </div>
        <div className={styles.title}>
          <div className={styles.name}>{name.toUpperCase()}</div>
          <div className={styles.address}>{address}</div>
        </div>
      </div>
    );
  };

  renderLoading() {
    return (
      <div className={styles.loadingContainer}>
        <HTLoadingIndicator />
      </div>
    );
  }
}

export default injectIntl(OfferDetailView);
