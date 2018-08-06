// @flow

import React, { PureComponent } from 'react';
import moment from 'moment';
import cn from 'classnames';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import HintDropDown from '../HTForm/HintDropDown';
import HTImage from '../HTImage/HTImage';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTModal from '../HTModal/HTModal';
import HTCheckBox from '../HTForm/HTCheckBox';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTLoadingPage from '../HTLoadingPage/HTLoadingPage';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HTCurrency from '../../containers/HTCurrency';
import CreditCardPrefill from './CreditCardPrefill';
import PaymentInput from '../Payment/PaymentInput';
import TravelistaDetail from './TravelistaDetail';
import OfferUpgradesView from './OfferUpgradesView';

import type { IntlShape } from 'react-intl';
import type Moment from 'moment';
import type { Offer } from '../../models/Offer';
import type { Package } from '../../models/Package';
import type { HotelDate } from '../../models/HotelDate';
import type { Request } from '../../types';
import type { Reservation } from '../../models/Reservation';
import type { User } from '../../models/User';
import type { PaymentInfo } from '../../models/PaymentInfo';
import type { Travelista, TravelistaTrip } from '../../models/Travelista';
import type { PromoCode } from '../../models/PromoCode';
import type { OfferStep1FormData } from './PackageStep1';

import styles from './PackageStep2.scss';
import foundation from '../../styles/foundation.scss';

import greenBackIcon from '../../images/ic_green_back.svg';

import { toastrError } from '../../utils/toastr';
import { mustBe } from '../../utils/utils';

const stayingDateFormat = 'DD/MM/YYYY';

type Props = {
  intl: IntlShape,
  user: User,
  offer: Offer,
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  },
  replace: string => void,
  step1Data: ?OfferStep1FormData,
  reservation: ?Reservation,
  promoCode: ?PromoCode,
  partnerCode: ?PromoCode,
  onClickUpgradePackage: (p: Package, from: Moment, to: Moment) => void,
  onClickUpgradeRoomType: (p: Package, price: number) => void,
  recommendedRequest: Request,
  fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
  fetchReservation: string => void,
  fetchReservationRequest: Request,
  makeOrderRequest: Request,
  makeOrder: (
    Reservation,
    { user: Travelista, trip: TravelistaTrip }[],
    stripeToken: ?string,
    PaymentInfo
  ) => void,
};

type State = {
  user: {
    [number]: {
      user: Travelista,
      trip: TravelistaTrip,
    },
  },
  time: Moment,
  extensionTime: Moment,
  hasExtended: boolean,
  isOpenExtension: boolean,
  isOpenRedirection: boolean,
  paymentInfo: PaymentInfo,
  validState: {
    card: boolean,
    user: {
      [number]: boolean,
    },
  },
  showErrorMessage: boolean,
  payByMyCard: boolean,
};

class PackageStep2 extends PureComponent<Props, State> {
  timerId: IntervalID;
  extensionTimerId: IntervalID;
  endTime: ?Moment;
  extensionEndTime: ?Moment;

  constructor(props: Props) {
    super(props);

    this.state = {
      user: {},
      time: moment(),
      extensionTime: moment(),
      hasExtended: false,
      isOpenExtension: false,
      isOpenRedirection: false,
      paymentInfo: {
        card: {
          cardNumber: '',
          cardName: '',
          expiryYear: 0,
          expiryMonth: 0,
          cvv: '',
        },
        saveCard: false,
      },
      validState: {
        card: false,
        user: {},
      },
      showErrorMessage: false,
      payByMyCard: props.user.creditCardInfo ? true : false,
    };
  }
  componentWillMount() {
    const { fetchReservation, reservation, replace, offer } = this.props;
    const reservationId: ?string = qs.parse(window.location.search)
      .reservationId;
    if (reservationId == null) {
      replace(`/hotel/${offer.hotel.slug}/offer/${offer.id}`);
      return;
    }
    if (reservation == null || reservation.id !== reservationId) {
      fetchReservation(reservationId);
    }
    this.startTimer(10 * 60);
  }

  componentWillUnmount() {
    this.stopTimer();
    this.extensionStopTimer();
    localStorage.removeItem('ht_users');
  }

  componentWillReceiveProps(nextProps: Props) {
    const {
      offer,
      intl: { formatMessage },
      makeOrderRequest: { error: makeOrderError },
      fetchReservationRequest: { error: fetchReservationError },
      reservation: newReservation,
    } = nextProps;
    const { reservation: oldReservation } = this.props;
    if (this.props.makeOrderRequest.error == null && makeOrderError) {
      toastrError(formatMessage({ id: makeOrderError }));
    }
    if (fetchReservationError) {
      if (fetchReservationError !== 'reservation.fetch_reservation.expired') {
        toastrError(formatMessage({ id: fetchReservationError }));
      }
      this.props.replace(`/hotel/${offer.hotel.slug}/offer/${offer.id}`);
      return;
    }
    if (oldReservation == null && newReservation !== null) {
      const { expiredAt } = mustBe(newReservation);
      const remainingSeconds = expiredAt.diff(moment(), 'seconds');
      let countDownSeconds;
      let hasExtended = false;
      if (remainingSeconds > 7 * 60) {
        countDownSeconds = remainingSeconds - 7 * 60;
      } else if (7 * 60 >= remainingSeconds && remainingSeconds >= 5 * 60) {
        countDownSeconds = 5 * 60;
        hasExtended = true;
      } else {
        countDownSeconds = remainingSeconds;
        hasExtended = true;
      }
      this.setState({ hasExtended }, () => {
        this.stopTimer();
        this.startTimer(countDownSeconds);
      });
    }
  }

  // eslint-disable-next-line flowtype/no-weak-types
  _parseLocalUser(user: any): { user: Travelista, trip: TravelistaTrip } {
    const { user: user_, trip } = user;
    const {
      arrivalDate,
      arrivalFlight,
      departureDate,
      departureFlight,
      updateProfile,
      saveSpecialRequest,
    } = trip;
    return {
      user: user_,
      trip: {
        arrivalDate: arrivalDate ? moment(arrivalDate) : null,
        arrivalFlight,
        departureDate: departureDate ? moment(departureDate) : null,
        departureFlight,
        updateProfile,
        saveSpecialRequest,
      },
    };
  }

  areAllValid = (): boolean => {
    const { validState, payByMyCard } = this.state;
    const validState_ = { ...validState };
    if (payByMyCard) {
      delete validState_['card'];
    }
    let reducedValidState = true;
    Object.keys(validState_).forEach((validStateKey: string) => {
      if (!validState_[validStateKey]) {
        reducedValidState = false;
      } else if (validStateKey === 'user') {
        Object.keys(validState_.user).forEach((userValidStateKey: string) => {
          if (!validState_.user[parseInt(userValidStateKey, 10)]) {
            reducedValidState = false;
          }
        });
      }
    });
    return reducedValidState;
  };

  submit = () => {
    const { user, paymentInfo, payByMyCard } = this.state;
    const { reservation, makeOrder, user: user_ } = this.props;
    const reservation_ = mustBe(reservation);
    const { capacity: { numberOfRooms } } = reservation_;

    if (!this.areAllValid()) {
      this.setState({ showErrorMessage: true });
      return;
    }

    const users = [];
    for (let i = 0; i < numberOfRooms; i++) {
      users.push(user[i]);
    }

    if (payByMyCard) {
      makeOrder(
        reservation_,
        users,
        mustBe(user_.creditCardInfo).stripeToken,
        paymentInfo
      );
      return;
    }
    makeOrder(reservation_, users, null, paymentInfo);
  };

  onUserChange = (index: number, user: Travelista, trip: TravelistaTrip) => {
    this.setState((state: State) => {
      const user_ = {
        ...state.user,
        [index]: {
          user,
          trip,
        },
      };
      localStorage.setItem('ht_users', JSON.stringify(user_));
      return {
        user: user_,
      };
    });
  };

  onUserChangeCurry = (index: number) => {
    return (user: Travelista, trip: TravelistaTrip) => {
      this.onUserChange(index, user, trip);
    };
  };

  onPaymentInfoChange = (paymentInfo: PaymentInfo) => {
    this.setState({
      paymentInfo,
    });
  };

  onValidStateChange = (key: string, value: boolean) => {
    this.setState((prevState: State) => ({
      validState: {
        ...prevState.validState,
        [key]: value,
      },
    }));
  };

  onCardValidStateChange = (value: boolean) => {
    this.onValidStateChange('card', value);
  };

  onUserValidStateChange = (index: number, value: boolean) => {
    this.setState((prevState: State) => ({
      validState: {
        ...prevState.validState,
        user: {
          ...prevState.validState.user,
          [index]: value,
        },
      },
    }));
  };

  onTogglePayment = () => {
    this.setState((prevState: State) => ({
      payByMyCard: !prevState.payByMyCard,
    }));
  };

  countDown = () => {
    const { time, hasExtended } = this.state;
    if (this.endTime && time.isBefore(this.endTime)) {
      this.setState({
        time: moment(time).add(1, 'second'),
      });
    } else {
      if (hasExtended) {
        this.setState({ isOpenRedirection: true });
      } else {
        this.setState(
          {
            isOpenExtension: true,
          },
          () => {
            this.extensionStartTimer(2 * 60);
            this.stopTimer();
          }
        );
      }
    }
  };

  extensionCountDown = () => {
    const { extensionTime } = this.state;
    if (
      this.extensionEndTime &&
      extensionTime.isBefore(this.extensionEndTime)
    ) {
      this.setState({
        extensionTime: moment(extensionTime).add(1, 'second'),
      });
    } else {
      this.setState(
        {
          isOpenExtension: false,
          isOpenRedirection: true,
        },
        () => {
          this.extensionStopTimer();
        }
      );
    }
  };

  extensionStartTimer = (seconds: number) => {
    this.extensionEndTime = moment().add(seconds, 'seconds');
    this.setState(
      {
        extensionTime: moment(),
      },
      () => {
        this.extensionTimerId = setInterval(this.extensionCountDown, 1000);
      }
    );
  };

  extensionStopTimer = () => {
    clearInterval(this.extensionTimerId);
  };

  startTimer = (seconds: number) => {
    this.endTime = moment().add(seconds, 'seconds');
    this.setState(
      {
        time: moment(),
      },
      () => {
        this.timerId = setInterval(this.countDown, 1000);
      }
    );
  };

  stopTimer = () => {
    clearInterval(this.timerId);
  };

  displayTime = (start: Moment, end: Moment): { min: string, sec: string } => {
    const duration = moment.duration(end.diff(start));
    const min = Math.floor(Math.round(duration.asMinutes() * 1000) / 1000);
    const sec = Math.ceil(duration.asSeconds()) % 60;
    return {
      min: min < 10 ? '0' + min : min.toString(),
      sec: sec < 10 ? '0' + sec : sec.toString(),
    };
  };

  backLink = () => {
    const { offer, reservation, step1Data } = this.props;

    if (step1Data) {
      const {
        package: { id: packageId, roomType: { id: roomTypeId } },
      } = step1Data;

      return `/hotel/${offer.hotel.slug}/offer/${
        offer.id
      }/booking/1?roomTypeId=${roomTypeId}&packageId=${packageId}`;
    }

    const { package: { id: packageId, roomType: { id: roomTypeId } } } = mustBe(
      reservation
    );
    return `/hotel/${offer.hotel.slug}/offer/${
      offer.id
    }/booking/1?roomTypeId=${roomTypeId}&packageId=${packageId}`;
  };

  renderHeaderTitle = () => {
    const { offer } = this.props;
    return (
      <HTPageTitle
        translationKey="page.title.booking_step_2"
        values={{ hotel: offer.hotel.name }}
        descriptionKey="page.description.offer_detail"
      />
    );
  };

  renderPaymentInfo = () => {
    const { intl: { formatMessage }, user: { creditCardInfo } } = this.props;

    const { showErrorMessage, payByMyCard } = this.state;

    if (!creditCardInfo) {
      return (
        <PaymentInput
          onPaymentInfoChange={this.onPaymentInfoChange}
          onValidStateChange={this.onCardValidStateChange}
          showErrorMessage={showErrorMessage}
        />
      );
    }

    return (
      <div className={foundation['medium-6']}>
        <label
          className={cn(
            styles.checkboxLabel,
            styles.paymentCheckboxLabel,
            foundation['medium-12']
          )}
        >
          <HTCheckBox
            id="pay_by_my_card"
            label={formatMessage({ id: 'packages.step2.pay_by_my_card' })}
            value={payByMyCard}
            onChange={this.onTogglePayment}
          />
          <span className={cn(styles.checkboxText, styles.paymentCheckboxText)}>
            <HTText translationKey={'packages.step2.pay_by_my_card'} />
          </span>
        </label>
        {payByMyCard ? <CreditCardPrefill cardInfo={creditCardInfo} /> : ''}
        <label
          className={cn(
            styles.checkboxLabel,
            styles.paymentCheckboxLabel,
            foundation['medium-12']
          )}
        >
          <HTCheckBox
            id="pay_by_another_card"
            label={formatMessage({ id: 'packages.step2.pay_by_another_card' })}
            value={!payByMyCard}
            onChange={this.onTogglePayment}
          />
          <span className={cn(styles.checkboxText, styles.paymentCheckboxText)}>
            <HTText translationKey={'packages.step2.pay_by_another_card'} />
          </span>
        </label>
        {payByMyCard ? (
          ''
        ) : (
          <PaymentInput
            onPaymentInfoChange={this.onPaymentInfoChange}
            onValidStateChange={this.onCardValidStateChange}
            showErrorMessage={showErrorMessage}
          />
        )}
      </div>
    );
  };

  renderInfo = () => {
    const { intl: { formatMessage }, reservation } = this.props;
    const { price } = mustBe(reservation);

    const {
      from,
      to,
      capacity: { numberOfRooms },
      package: { roomType: { name } },
    } = mustBe(reservation);

    return (
      <div className={styles.paymentMethodContainer}>
        <h4 className={styles.creditCardTitle}>
          <HTText translationKey={'packages.step2.payment_method'} />
          <HintDropDown
            className={styles.hintDropDown}
            hint={formatMessage({ id: 'credit_card_input.security.hint' })}
          />
        </h4>
        <div className={foundation['grid-x']}>
          {this.renderPaymentInfo()}
          <div className={cn(foundation['medium-6'], styles.paymentInfoRight)}>
            <div className={styles.paymentInfo}>
              <div className={styles.priceLabel}>
                <HTText translationKey="packages.step1.your_travelista_price" />
              </div>
              <div className={styles.capacityLabel}>
                for {numberOfRooms} {name}
              </div>
              <div className={styles.selectedDates}>
                <div className={styles.selectedDate}>
                  <HTText translationKey="packages.step1.check_in_date" />
                  {from ? (
                    <span>{moment(from).format(stayingDateFormat)}</span>
                  ) : (
                    <span className={styles.textAlignCenter}>-</span>
                  )}
                </div>
                <div className={styles.selectedDate}>
                  <HTText translationKey="packages.step1.check_out_date" />
                  {to ? (
                    <span>{moment(to).format(stayingDateFormat)}</span>
                  ) : (
                    <span className={styles.textAlignCenter}>-</span>
                  )}
                </div>
              </div>
              <div className={styles.price}>
                <span>
                  <HTCurrency value={price} />
                </span>
                <span className={styles.hintDropDown}>
                  <HintDropDown
                    hint={formatMessage({
                      id: 'packages.step2.price.hint',
                    })}
                    align="right"
                  />
                </span>
              </div>
              <div className={styles.taxInclusive}>
                <HTText translationKey="packages.step2.tax_inclusive" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderDiscountCodeContainer(code: string, titleKey: string) {
    return (
      <div className={styles.discountCodeContainer}>
        <div className={styles.discountCodeTitle}>
          <HTText translationKey={titleKey} />
        </div>
        <div className={styles.discountCode}>{code}</div>
      </div>
    );
  }

  render() {
    const { promoCode, partnerCode, reservation } = this.props;
    const fetchReservationRequesting = this.props.fetchReservationRequest
      .requesting;
    const makeOrderRequesting = this.props.makeOrderRequest.requesting;
    const { time, showErrorMessage, hasExtended } = this.state;
    const { user, intl: { formatMessage } } = this.props;

    if (fetchReservationRequesting || !reservation) {
      return <HTLoadingPage />;
    }

    const { capacity: { numberOfRooms } } = reservation;

    let localUsers = new Array(numberOfRooms);
    if (localStorage.getItem('ht_users')) {
      localUsers = JSON.parse(mustBe(localStorage.getItem('ht_users')));
      // eslint-disable-next-line
      localUsers = Object.keys(localUsers).reduce((localUsers_, key) => {
        if (localUsers[key]) {
          return {
            ...localUsers_,
            [key]: this._parseLocalUser(localUsers[key]),
          };
        }
        return localUsers_;
      }, {});
    }

    const rooms = [];

    rooms.push(
      <TravelistaDetail
        key={`room-0`}
        index={0}
        user={localUsers[0] ? localUsers[0].user : user}
        trip={localUsers[0] ? localUsers[0].trip : undefined}
        isUser={true}
        onChange={this.onUserChangeCurry(0)}
        onValidStateChange={this.onUserValidStateChange}
        showErrorMessage={showErrorMessage}
        stayingStartDate={reservation.from}
        stayingEndDate={reservation.to}
      />
    );
    for (let i = 1; i < numberOfRooms; i++) {
      let travelista = null;
      let trip = undefined;
      if (localUsers[i]) {
        travelista = localUsers[i].user;
        trip = localUsers[i].trip;
      } else {
        travelista = user;
      }

      rooms.push(
        <TravelistaDetail
          key={`room-${i}`}
          index={i}
          user={travelista}
          trip={trip}
          isUser={false}
          onChange={this.onUserChangeCurry(i)}
          onValidStateChange={this.onUserValidStateChange}
          showErrorMessage={showErrorMessage}
          stayingStartDate={reservation.from}
          stayingEndDate={reservation.to}
        />
      );
    }

    return (
      <div>
        {this.renderHeaderTitle()}
        <div className={styles.header}>
          <div
            className={cn(styles.headerWrapper, foundation['grid-container'])}
          >
            <Link to={this.backLink()}>
              <button className={styles.backButtonContainer}>
                <HTImage
                  src={greenBackIcon}
                  alt={formatMessage({ id: 'image.icon.back' })}
                />
              </button>
            </Link>
            <div className={styles.title}>
              <HTText translationKey="packages.step2.title" />
            </div>
            <div className={styles.subtitle}>
              <HTText translationKey="packages.step2.subtitle" />
            </div>
            <div className={styles.countDownContainer}>
              <div className={styles.countDown}>
                {this.endTime &&
                  !hasExtended && (
                    <HTText
                      translationKey="packages.step2.count_down"
                      values={this.displayTime(time, this.endTime)}
                    />
                  )}
                {this.endTime &&
                  hasExtended && (
                    <HTText
                      translationKey="packages.step2.count_down.extended"
                      values={this.displayTime(time, this.endTime)}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className={foundation['grid-container']}>
          {rooms}
          {this.renderInfo()}
          <div className={styles.payButtonWrapper}>
            <HTButton
              className={styles.payButton}
              contentClassName={styles.buttonContent}
              buttonType="green"
              text={formatMessage({ id: 'packages.step2.confirm_and_pay' })}
              onClick={this.submit}
              isDisabled={makeOrderRequesting}
            >
              {makeOrderRequesting ? <HTLoadingIndicator /> : undefined}
            </HTButton>
          </div>
        </div>
        <OfferUpgradesView
          offer={this.props.offer}
          reservation={reservation}
          promoCode={promoCode}
          partnerCode={partnerCode}
          fetchHotelDates={this.props.fetchHotelDates}
          onClickUpgradePackage={this.props.onClickUpgradePackage}
          onClickUpgradeRoomType={this.props.onClickUpgradeRoomType}
          hotelDateMap={this.props.hotelDateMap}
        />
        {this.renderExtensionModal()}
        {this.renderRedirectionModal()}
      </div>
    );
  }

  onClickExtendAgree = () => {
    this.extensionStopTimer();
    this.setState(
      {
        hasExtended: true,
        isOpenExtension: false,
      },
      () => {
        this.startTimer(5 * 60);
      }
    );
  };

  onClickRedirection = () => {
    const { offer, replace } = this.props;
    replace(`/hotel/${offer.hotel.slug}/offer/${offer.id}`);
  };

  onClickExtendDeny = () => {
    const { offer, replace } = this.props;
    replace(`/hotel/${offer.hotel.slug}/offer/${offer.id}`);
  };

  renderExtensionModal = () => {
    const { extensionTime, isOpenExtension } = this.state;
    const { intl: { formatMessage } } = this.props;
    return (
      <HTModal
        isOpen={isOpenExtension}
        className={styles.extensionContainer}
        onRequestClose={() => {}}
      >
        <div className={styles.extensionTitle}>
          <HTText translationKey="packages.step2.extension.title" />
        </div>
        <div className={styles.extensionCountDown}>
          {this.extensionEndTime && (
            <HTText
              translationKey={'packages.step2.extension.count_down'}
              values={this.displayTime(extensionTime, this.extensionEndTime)}
            />
          )}
        </div>
        <div className={styles.buttons}>
          <HTButton
            className={styles.button}
            contentClassName={styles.contentClassName}
            buttonType={'green'}
            onClick={this.onClickExtendAgree}
            text={formatMessage({
              id: 'packages.step2.extension.confirm_button',
            })}
          />
          <HTButton
            className={cn(styles.button, styles.noButton)}
            contentClassName={styles.noButtonContent}
            buttonType={'hollowBlack'}
            onClick={this.onClickExtendDeny}
            text={formatMessage({
              id: 'packages.step2.extension.cancel_button',
            })}
          />
        </div>
      </HTModal>
    );
  };

  renderRedirectionModal = () => {
    const { isOpenRedirection } = this.state;
    const { intl: { formatMessage } } = this.props;
    return (
      <HTModal
        isOpen={isOpenRedirection}
        className={styles.redirectionContainer}
        onRequestClose={() => {}}
      >
        <div id="reservation-expired-msg" className={styles.redirectionContent}>
          <div className={styles.redirectionTitle}>
            <HTText translationKey="packages.step2.redirection.title" />
          </div>
          <div>
            <HTText translationKey="packages.step2.redirection.message" />
          </div>
          <div className={styles.buttons}>
            <HTButton
              className={styles.button}
              contentClassName={styles.contentClassName}
              buttonType={'green'}
              onClick={this.onClickRedirection}
              text={formatMessage({
                id: 'packages.step2.redirection.confirm_button',
              })}
            />
          </div>
        </div>
      </HTModal>
    );
  };
}

export default injectIntl(PackageStep2);
