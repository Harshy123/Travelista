// @flow
import React, { Fragment, PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { replace } from 'connected-react-router';
import qs from 'query-string';
import moment from 'moment';

import Navigation from '../containers/Navigation';
import {
  fetchOffer,
  fetchHotelDates,
  flushHotelDateRequests,
} from '../actions/offer';
import {
  makeReservation,
  fetchReservation,
  flushReservationAction,
} from '../actions/reservation';
import { makeOrder, fetchOrder } from '../actions/order';
import OfferDetailView from '../components/OfferDetailView/OfferDetailView';
import PackageDescriptionModal from '../components/PackageDescriptionModal/PackageDescriptionModal';

import { mustBe } from '../utils/utils';
import { toastrError } from '../utils/toastr';
import type { IntlShape } from 'react-intl';
import type Moment from 'moment';
import type { ContextRouter } from 'react-router';
import type { Match } from 'react-router';
import type { RootState } from '../states';
import type { ReservationState } from '../states/reservation';
import type { OfferState } from '../states/offer';
import type { PromoCodeState } from '../states/promoCode';
import type { AuthState } from '../states/auth';
import type { OrderState } from '../states/order';
import type { AppState } from '../states/app';
import type { Package } from '../models/Package';
import type { HotelDate } from '../models/HotelDate';
import type { Reservation } from '../models/Reservation';
import type { Travelista, TravelistaTrip } from '../models/Travelista';
import type { PaymentInfo } from '../models/PaymentInfo';
import type { Capacity } from '../models/Capacity';
import type { RoomType } from '../models/RoomType';
import type { Offer } from '../models/Offer';
import type { OfferResponse } from '../types';

type Props = {
  intl: IntlShape,
  match: Match,
  store: {
    app: AppState,
    auth: AuthState,
    offer: OfferState,
    promoCode: PromoCodeState,
    reservation: ReservationState,
    router: ContextRouter,
    order: OrderState,
  },
  actions: {
    replace: string => void,
    flushReservationAction: () => void,
    fetchOffer: (id: string, hotelSlug: string) => Promise<OfferResponse>,
    fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
    flushHotelDateRequests: () => void,
    fetchReservation: string => void,
    fetchOrder: string => void,
    makeReservation: (
      string,
      Moment,
      Moment,
      Capacity,
      promoCode?: string
    ) => void,
    makeOrder: (
      Reservation,
      { user: Travelista, trip: TravelistaTrip }[],
      stripeToken: ?string,
      PaymentInfo
    ) => void,
  },
};

type LocalState = {
  packageDescriptionModal: {
    isOpen: boolean,
    offer: ?Offer,
    roomType: ?RoomType,
    package: ?Package,
  },
};

class OfferDetailPage extends PureComponent<Props, LocalState> {
  state = {
    packageDescriptionModal: {
      isOpen: false,
      offer: null,
      roomType: null,
      package: null,
    },
  };

  componentWillMount() {
    const { match, actions: { fetchOffer, replace } } = this.props;
    const offerId = match.params.id || '';
    const hotelSlug = match.params.hotelSlug || '';
    fetchOffer(offerId, hotelSlug).catch((error: *) => {
      // TODO: do something when that record is not found
      replace('/');
      toastrError(error.message);
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { actions: { replace }, store: { offer: offerState } } = this.props;
    const thisId = this.props.match.params.id || '';
    const nextId = nextProps.match.params.id || '';
    const thisHotelSlug = this.props.match.params.hotelSlug || '';
    const nextHotelSlug = nextProps.match.params.hotelSlug || '';
    const { offerEntry: nextOffer } = offerState;
    if (thisId !== nextId || thisHotelSlug !== nextHotelSlug) {
      this.props.actions.fetchOffer(nextId, nextHotelSlug).catch((error: *) => {
        // TODO: do something when that record is not found
        replace('/');
        toastrError(error.message);
      });
    }
    if (nextOffer && nextOffer.bookingEndAt.isBefore(moment())) {
      replace('/');
    }
  }

  getPackage = (roomTypeId: string, packageId: string): ?Package => {
    const { store: { offer: { offerEntry } } } = this.props;
    if (offerEntry == null) {
      return null;
    }

    const { roomTypeInfo } = offerEntry;
    if (roomTypeInfo[roomTypeId] == null) {
      return null;
    }

    return roomTypeInfo[roomTypeId].packages.find(
      (p: Package) => p.id === packageId
    );
  };

  openPackageDescriptionModal = (p: Package, roomType: RoomType) => {
    this.setState({
      packageDescriptionModal: {
        isOpen: true,
        offer: this.props.store.offer.offerEntry,
        roomType,
        package: p,
      },
    });
  };

  closePackageDescriptionModal = () => {
    this.setState({
      packageDescriptionModal: {
        isOpen: false,
        offer: null,
        roomType: null,
        package: null,
      },
    });
  };

  // this method is used to get a user selected package from offer detail
  getDefaultPackage = (): ?Package => {
    const {
      store: {
        router: { location: { pathname, search } },
        offer: { offerEntry },
      },
    } = this.props;
    const isOrderAction = pathname.match(/\/booking\//i) != null;
    const roomTypeId: ?string = qs.parse(search).roomTypeId;
    const packageId: ?string = qs.parse(search).packageId;

    if (isOrderAction && offerEntry && roomTypeId && packageId) {
      return this.getPackage(roomTypeId, packageId);
    }
    return null;
  };

  render() {
    const {
      match,
      store: {
        app: { config: { currency } },
        auth,
        offer: {
          fetchOfferRequest,
          hotelDateRequests,
          hotelDateMap,
          recommendedRequest,
          offerEntry,
        },
        promoCode: { code },
        reservation: {
          reservation,
          makeReservationRequest,
          fetchReservationRequest,
        },
        order: { order, makeOrderRequest, fetchOrderRequest },
      },
      actions: {
        fetchHotelDates,
        fetchReservation,
        fetchOrder,
        flushHotelDateRequests,
        flushReservationAction,
        replace,
        makeReservation,
        makeOrder,
      },
    } = this.props;
    const { packageDescriptionModal } = this.state;
    const user = mustBe(auth.user);

    return (
      <Fragment>
        <Navigation />
        <OfferDetailView
          currency={currency}
          user={user}
          offer={offerEntry}
          order={order}
          replace={replace}
          match={match}
          defaultPackage={this.getDefaultPackage()}
          hotelDateRequests={hotelDateRequests}
          hotelDateMap={hotelDateMap}
          reservation={reservation}
          request={fetchOfferRequest}
          promoCode={code}
          fetchHotelDates={fetchHotelDates}
          flushHotelDateRequests={flushHotelDateRequests}
          makeReservationRequest={makeReservationRequest}
          makeReservation={makeReservation}
          fetchReservation={fetchReservation}
          fetchReservationRequest={fetchReservationRequest}
          flushReservation={flushReservationAction}
          recommendedRequest={recommendedRequest}
          makeOrderRequest={makeOrderRequest}
          makeOrder={makeOrder}
          fetchOrderRequest={fetchOrderRequest}
          fetchOrder={fetchOrder}
          openPackageDescriptionModal={this.openPackageDescriptionModal}
        />
        <PackageDescriptionModal
          {...packageDescriptionModal}
          closeModal={this.closePackageDescriptionModal}
        />
      </Fragment>
    );
  }
}

function mapStateToProps({
  app,
  offer,
  router,
  promoCode,
  reservation,
  auth,
  order,
}: RootState) {
  return {
    store: {
      app,
      auth,
      order,
      offer,
      promoCode,
      router,
      reservation,
    },
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    replace,
    fetchOffer,
    fetchHotelDates,
    fetchReservation,
    fetchOrder,
    flushHotelDateRequests,
    flushReservationAction,
    makeReservation,
    makeOrder,
  };
  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(OfferDetailPage)
);
