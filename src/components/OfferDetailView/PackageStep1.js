// @flow
import React, { PureComponent, Fragment } from 'react';
import cn from 'classnames';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { mustBe, toHotelDateMapKey } from '../../utils/utils';
import { subtractDays } from '../../utils/time';
import {
  computePrice,
  computeDiscountedPrice,
  computeDiscountedPriceOff,
} from '../../utils/price';
import HTCalendar from '../HTCalendar/HTCalendar';
import HTImage from '../HTImage/HTImage';
import HTSelect from '../HTForm/HTSelect';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HintDropDown from '../HTForm/HintDropDown';
import HTCurrency from '../../containers/HTCurrency';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTMLComponent from '../HTMLComponent/HTMLComponent';
import PromoteCodeInputContainer from '../../containers/PromotionCodeContainer';

import type Moment from 'moment';
import type { IntlShape } from 'react-intl';
import type { Request } from '../../types';
import type { HotelDate } from '../../models/HotelDate';
import type { Option } from '../HTForm/HTSelect';
import type { Offer } from '../../models/Offer';
import type { Package } from '../../models/Package';
import type { Capacity } from '../../models/Capacity';
import type { PromoCode } from '../../models/PromoCode';

import styles from './PackageStep1.scss';
import foundation from '../../styles/foundation.scss';

import greenArrowDown from '../../images/ic_green_dropdown_down_thick.svg';
import greenArrowUp from '../../images/ic_green_dropdown_up_thick.svg';
import greenBackIcon from '../../images/ic_green_back.svg';

const stayingDateFormat = 'DD/MM/YYYY';

export type OfferStep1FormData = {
  from: Date,
  to: Date,
  capacity: Capacity,
  package: Package,
  price: number,
  promoCode: string,
};

type Props = {
  intl: IntlShape,
  currency: string,
  defaultPackage: Package,
  formData: ?OfferStep1FormData,
  promoCode: ?PromoCode,
  partnerCode: ?PromoCode,
  hotelDateRequests: {
    [string]: Request,
  },
  offer: Offer,
  hotelDateMap: {
    [string]: {
      [string]: HotelDate,
    },
  },
  makeReservationRequest: Request,
  flushReservation: () => void,
  onSubmitStep1: OfferStep1FormData => void,
  replace: string => void,
  fetchHotelDates: (string, string, Moment, Moment) => Promise<HotelDate[]>,
  flushHotelDateRequests: () => void,
};

type State = {
  capacity: Capacity,
  dateRange: {
    from: ?Date,
    to: ?Date,
  },
  selectedPackage: Package,
  calendar: {
    clickState: 'first' | 'odd' | 'even',
  },
  error: ?string,
};

type CapacityState = { [key: string]: Capacity };

class PackageStep1 extends PureComponent<Props, State> {
  minimumNights: number;
  packages: Package[];
  constructor(props: Props) {
    super(props);
    const {
      formData,
      offer: { roomTypeInfo },
      defaultPackage: { roomType: { id } },
    } = this.props;
    const info = roomTypeInfo[id];
    if (info == null) {
      throw new Error(`Room type info not found for room type #{id}`);
    }
    this.packages = info.packages;
    this.minimumNights = info.packages.reduce((a: Package, b: Package) => {
      if (Math.min(a.nights, b.nights)) {
        return a;
      }
      return b;
    }).nights;

    if (formData != null) {
      const { from, to, capacity } = formData;
      this.state = {
        capacity: capacity,
        dateRange: {
          from,
          to,
        },
        selectedPackage: formData.package,
        calendar: {
          clickState: 'first',
        },
        error: null,
      };
    } else {
      let capacity = {
        adults: 1,
        children: 0,
        infants: 0,
        numberOfRooms: 1,
      };
      const localCapacityState = this._loadLocalCapacityState();
      if (localCapacityState) {
        capacity = localCapacityState;
      }
      this.state = {
        capacity,
        dateRange: {
          from: null,
          to: null,
        },
        selectedPackage: props.defaultPackage,
        calendar: {
          clickState: 'first',
        },
        error: null,
      };
    }
  }

  componentWillMount() {
    const { flushReservation } = this.props;
    flushReservation();
  }

  componentWillUnmount() {
    this._removeLocalCapacityState();
  }

  _roomTypePackageKeyString = () => {
    const { defaultPackage } = this.props;
    return `${defaultPackage.roomType.id}_${defaultPackage.id}`;
  };

  renderCapacity = () => {
    const { roomType: { capacity } } = this.state.selectedPackage;
    const { intl: { formatMessage } } = this.props;
    const { adults, children, infants, numberOfRooms } = this.state.capacity;

    return (
      <div className={capacity}>
        <div className={styles.capacityDropdowns}>
          <div>
            {this.renderDropdown(
              formatMessage({ id: 'packages.step1.adults' }),
              adults,
              PackageStep1.generateOptions(1, 10),
              this.onChangeAdults
            )}
            {this.renderDropdown(
              formatMessage({ id: 'packages.step1.children' }),
              children,
              PackageStep1.generateOptions(0, 10),
              this.onChangeChildren
            )}
            {this.renderDropdown(
              formatMessage({ id: 'packages.step1.infants' }),
              infants,
              PackageStep1.generateOptions(0, 10),
              this.onChangeInfants
            )}
            {this.renderDropdown(
              formatMessage({ id: 'packages.step1.number_of_rooms' }),
              numberOfRooms,
              PackageStep1.generateOptions(1, 10),
              this.onChangeNumberOfRooms
            )}
          </div>
        </div>
        <div className={styles.capacityHint}>
          <HTText
            translationKey={'packages.step1.room_type_hint'}
            values={{
              capacity,
            }}
          />
        </div>
      </div>
    );
  };

  onClickStateUpdate = (clickState: 'first' | 'odd' | 'even') => {
    this.setState({
      calendar: {
        clickState,
      },
    });
  };

  onDateRangeSelect = (from: ?Date, to: ?Date, hotelDates: HotelDate[]) => {
    const { intl: { formatMessage } } = this.props;
    let error = null;

    let selectedPackage = this.state.selectedPackage;

    if (from && to) {
      const duration = subtractDays(to, from);
      if (duration < this.minimumNights) {
        error = formatMessage(
          {
            id: 'packages.step1.error.duration',
          },
          {
            num: this.minimumNights,
          }
        );
      }

      const sortedPackages = [...this.packages].sort(
        (p1: Package, p2: Package) => p1.nights - p2.nights
      );
      const foundPackage = sortedPackages.find(
        (p: Package) => p.nights <= duration
      );

      if (foundPackage) {
        selectedPackage = foundPackage;
      }
    }

    this.setState((state: State) => ({
      dateRange: {
        ...state.dateRange,
        from,
        to,
      },
      error,
      selectedPackage,
    }));
  };

  computePrice = (): ?number => {
    const {
      capacity: { numberOfRooms },
      dateRange: { from, to },
      selectedPackage: { roomType },
    } = this.state;
    const { offer, hotelDateMap } = this.props;

    if (from && to) {
      return computePrice(
        numberOfRooms,
        from,
        to,
        roomType,
        offer,
        hotelDateMap
      );
    }
    return null;
  };

  discountedPrice = (originalPrice: ?number): ?number => {
    const { promoCode, partnerCode } = this.props;
    let discountedPrice = originalPrice;
    if (!discountedPrice) {
      return discountedPrice;
    }
    discountedPrice = computeDiscountedPrice(
      discountedPrice,
      promoCode,
      partnerCode
    );
    return discountedPrice;
  };

  calendarFetchHotelDatesByDuration = (firstDay: Moment, lastDay: Moment) => {
    const { fetchHotelDates, offer } = this.props;

    const { selectedPackage } = this.state;
    const offerId = offer.id;
    const roomTypeId = selectedPackage.roomType.id;
    fetchHotelDates(offerId, roomTypeId, firstDay, lastDay);
  };

  renderCalendar = () => {
    const {
      hotelDateRequests,
      offer: { id, stayingStartAt, stayingEndAt, roomTypeInfo },
      hotelDateMap,
      flushHotelDateRequests,
      defaultPackage,
    } = this.props;

    const {
      capacity: { numberOfRooms },
      selectedPackage: { roomType },
      calendar: { clickState },
      error,
    } = this.state;
    // TODO: set default value of calendar
    const { dateRange: { from, to } } = this.state;
    const roomTypeId = roomType.id;
    const hotelDates = hotelDateMap[toHotelDateMapKey(id, roomTypeId)] || {};
    const rates = roomTypeInfo[roomType.id].rates;

    return (
      <section className={styles.calendarContainer}>
        <div className={styles.calendarTitle}>
          <HTText translationKey="packages.step1.calendar_title" />
        </div>
        <div className={styles.specialDate}>
          <HTText
            translationKey="packages.step1.tip.special_date"
            values={{
              green: (
                <span className={styles.green}>
                  <HTText translationKey="packages.step1.tip.green" />
                </span>
              ),
            }}
          />
        </div>
        <div className={styles.calendarTip}>
          <div className={styles.calendarSelectionTip}>
            {error && <span className={styles.error}>{error}</span>}
            {from == null && to == null ? (
              <HTText translationKey="packages.step1.tip.start_date" />
            ) : (
              clickState === 'odd' && (
                <HTText translationKey="packages.step1.tip.end_date" />
              )
            )}

            {from != null &&
              to == null && (
                <HTText translationKey="packages.step1.tip.end_date" />
              )}
          </div>
        </div>
        <HTCalendar
          hotelDateRequests={hotelDateRequests}
          dates={hotelDates}
          hotelRates={rates}
          numberOfMonths={2}
          numberOfRooms={numberOfRooms}
          stayingStartAt={stayingStartAt}
          stayingEndAt={stayingEndAt}
          packageNights={defaultPackage.nights}
          defaultFrom={from}
          defaultTo={to}
          roomTypeId={defaultPackage.roomType.id}
          packageId={defaultPackage.id}
          minimumNights={this.minimumNights}
          onDateRangeSelect={this.onDateRangeSelect}
          calendarFetchHotelDatesByDuration={
            this.calendarFetchHotelDatesByDuration
          }
          flushHotelDateRequests={flushHotelDateRequests}
          onClickStateUpdate={this.onClickStateUpdate}
        />
      </section>
    );
  };

  static generateOptions(from: number, to: number): Option<number>[] {
    return Array.from(
      { length: to - from + 1 },
      (x: typeof undefined, i: number) => ({
        label: (i + from).toString(),
        value: i + from,
      })
    );
  }

  renderArrow = ({ isOpen }: { isOpen: boolean }) => {
    const { intl: { formatMessage } } = this.props;
    if (isOpen) {
      return (
        <HTImage
          className={styles.dropdownArray}
          src={greenArrowUp}
          alt={formatMessage({ id: 'image.dropdown.up' })}
        />
      );
    } else {
      return (
        <HTImage
          className={styles.dropdownArray}
          src={greenArrowDown}
          alt={formatMessage({ id: 'image.dropdown.down' })}
        />
      );
    }
  };

  _deserializeLocalCapacityState = (): CapacityState => {
    const raw = localStorage.getItem('ht_capacity');
    return raw ? JSON.parse(raw) : {};
  };

  _serializeLocalCapacityState = (capacityState: CapacityState) => {
    localStorage.setItem('ht_capacity', JSON.stringify(capacityState));
  };

  _saveLocalCapacityState = () => {
    const currentLocalCapacity = this._deserializeLocalCapacityState();
    const newLocalCapacity = {
      ...currentLocalCapacity,
      [this._roomTypePackageKeyString()]: this.state.capacity,
    };
    this._serializeLocalCapacityState(newLocalCapacity);
  };

  _loadLocalCapacityState = (): ?Capacity => {
    const localCapacityState = this._deserializeLocalCapacityState();
    if (
      localCapacityState &&
      localCapacityState[this._roomTypePackageKeyString()]
    ) {
      return localCapacityState[this._roomTypePackageKeyString()];
    }
    return null;
  };

  _removeLocalCapacityState = () => {
    const htCapacity = this._deserializeLocalCapacityState();
    if (htCapacity) {
      delete htCapacity[this._roomTypePackageKeyString()];
      this._serializeLocalCapacityState(htCapacity);
    }
  };

  onChangeAdults = (option: Option<number>) => {
    if (option.value != null) {
      this.setState((state: State) => {
        const { selectedPackage: { roomType: { capacity } } } = state;
        const { children, numberOfRooms } = state.capacity;
        const adultsSelected: number = mustBe(option.value);
        const totalPatrons = adultsSelected + children;
        const minimumRooms = Math.ceil(totalPatrons / capacity);
        return {
          ...state,
          capacity: {
            ...state.capacity,
            adults: adultsSelected,
            numberOfRooms:
              minimumRooms > numberOfRooms ? minimumRooms : numberOfRooms,
          },
          error: null,
        };
      }, this._saveLocalCapacityState);
    }
  };

  onChangeChildren = (option: Option<number>) => {
    if (option.value != null) {
      this.setState((state: State) => {
        const { selectedPackage: { roomType: { capacity } } } = state;
        const { adults, numberOfRooms } = state.capacity;
        const childrenSelected = mustBe(option.value);
        const totalPatrons = adults + childrenSelected;
        const minimumRooms = Math.ceil(totalPatrons / capacity);
        return {
          ...state,
          capacity: {
            ...state.capacity,
            children: childrenSelected,
            numberOfRooms:
              minimumRooms > numberOfRooms ? minimumRooms : numberOfRooms,
          },
          error: null,
        };
      }, this._saveLocalCapacityState);
    }
  };

  onChangeInfants = (option: Option<number>) => {
    if (option.value != null) {
      this.setState(
        (state: State) => ({
          ...state,
          capacity: {
            ...state.capacity,
            infants: mustBe(option.value),
          },
          error: null,
        }),
        this._saveLocalCapacityState
      );
    }
  };

  onChangeNumberOfRooms = (option: Option<number>) => {
    if (option.value) {
      this.setState((state: State) => {
        const numberOfRooms = mustBe(option.value);
        const { adults, children } = state.capacity;
        const { selectedPackage: { roomType: { capacity } } } = state;
        const totalCapacity = capacity * numberOfRooms;
        let newAdults = Math.min(Math.floor(totalCapacity - children), adults);
        newAdults = newAdults <= 0 ? 1 : newAdults;
        let newChildren = Math.min(totalCapacity - newAdults, children);
        newChildren = newChildren < 0 ? 0 : newChildren;
        return {
          ...state,
          capacity: {
            ...state.capacity,
            numberOfRooms,
            children: newChildren,
            adults: newAdults,
          },
          dateRange: {
            from: null,
            to: null,
          },
          error: null,
        };
      }, this._saveLocalCapacityState);
    }
  };

  renderDropdown = (
    title: string,
    value: number,
    options: Option<number>[],
    onChange: (Option<number>) => void
  ) => {
    return (
      <div className={styles.dropdownContainer}>
        <div className={styles.capacityTitle}>{title}</div>
        <HTSelect
          className={styles.dropdown}
          renderArrow={this.renderArrow}
          defaultValue={value}
          options={options}
          onChange={onChange}
        />
      </div>
    );
  };

  renderHeaderTitle = () => {
    const { offer } = this.props;
    return (
      <HTPageTitle
        translationKey="page.title.booking_step_1"
        values={{ hotel: offer.hotel.name }}
        descriptionKey="page.description.offer_detail"
      />
    );
  };

  renderPartnerCode = (originalPrice: number) => {
    const { partnerCode } = this.props;
    if (partnerCode) {
      const priceOff = computeDiscountedPriceOff(originalPrice, partnerCode);
      return (
        <div className={styles.discountCode}>
          <HTText
            translationKey="packages.step1.partner_code"
            values={{ code: partnerCode.code }}
          />
          {originalPrice > 0 &&
            priceOff !== 0 && (
              <div className={styles.priceOff}>
                -<HTCurrency value={priceOff} />
              </div>
            )}
        </div>
      );
    }
  };

  renderPromoCode = (originalPrice: number) => {
    const { promoCode } = this.props;
    return (
      <div className={styles.discountCode}>
        <span className={styles.promoCodeInput}>
          <PromoteCodeInputContainer />
        </span>
        {originalPrice > 0 && promoCode ? (
          <div className={styles.priceOff}>
            -<HTCurrency
              value={computeDiscountedPriceOff(originalPrice, promoCode)}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  renderLumpSum = (originalPrice: number, price: ?number) => {
    const { partnerCode } = this.props;
    return (
      <Fragment>
        {originalPrice !== price && (
          <Fragment>
            <div className={styles.originalPrice}>
              <HTText translationKey="packages.step1.original_price" />
              {originalPrice > 0 ? (
                <span className={styles.originalPriceTag}>
                  <HTCurrency value={originalPrice} />
                </span>
              ) : (
                <span
                  className={cn(
                    styles.textAlignCenter,
                    styles.originalPriceLabel
                  )}
                >
                  -
                </span>
              )}
            </div>
          </Fragment>
        )}
        <div className={styles.discount}>
          {this.renderPartnerCode(originalPrice)}
        </div>

        <div className={styles.discount}>
          {this.renderPromoCode(
            computeDiscountedPrice(originalPrice, null, partnerCode)
          )}
        </div>
      </Fragment>
    );
  };

  renderInfo = () => {
    const { intl: { formatMessage } } = this.props;
    const { selectedPackage: { roomType: { name } } } = this.state;
    const { capacity: { numberOfRooms }, dateRange: { from, to } } = this.state;

    const originalPrice = this.computePrice();
    const price = this.discountedPrice(originalPrice);

    return (
      <div className={styles.info}>
        <div className={styles.paymentInfo}>
          <div className={styles.priceLabel}>
            <HTText translationKey="packages.step1.your_travelista_price" />
          </div>
          <div className={styles.capacityLabel}>
            <HTText
              translationKey="packages.step1.room_info"
              values={{
                number: numberOfRooms,
                name: name,
              }}
            />
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
          {originalPrice != null && this.renderLumpSum(originalPrice, price)}
          <div className={styles.finalPrice}>
            {price ? (
              <Fragment>
                <HTText translationKey="packages.step1.final_price" />
                <span className={styles.finalPriceTag}>
                  <HTCurrency value={price} />
                  <HintDropDown
                    className={styles.hintDropDown}
                    hint={formatMessage({
                      id: 'packages.step1.price.hint',
                    })}
                    align="right"
                  />
                </span>
                <div className={styles.taxInclusive}>
                  <HTText translationKey="packages.step1.tax_inclusive" />
                </div>
              </Fragment>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  };

  renderPolicies = () => {
    const { hotel: { policy } } = this.props.offer;
    return (
      <section className={styles.policies}>
        <div className={styles.policiesLabel}>
          <HTText translationKey="packages.step1.policies" />
        </div>
        <div className={styles.policyContent}>
          <HTMLComponent html={policy} className={styles.policySpan} />
        </div>
      </section>
    );
  };

  onClickNextStep = () => {
    const { dateRange: { from, to }, capacity, selectedPackage } = this.state;
    const { intl: { formatMessage }, promoCode } = this.props;
    const price = this.computePrice();

    if (from == null || to == null) {
      this.setState({
        error: formatMessage(
          {
            id: 'packages.step1.error.duration',
          },
          {
            num: this.minimumNights,
          }
        ),
      });
      return;
    }
    if (from && to && price) {
      this.props.onSubmitStep1({
        from,
        to,
        price,
        capacity,
        package: selectedPackage,
        promoCode: promoCode ? promoCode.code : '',
      });
    }
  };

  render() {
    const {
      dateRange,
      selectedPackage: { name, startingFrom, saveUpTo },
      error,
    } = this.state;
    const {
      offer: { id, hotel },
      makeReservationRequest,
      intl: { formatMessage },
    } = this.props;
    const isReservationRequesting = makeReservationRequest.requesting;
    return (
      <div className={cn(styles.mainContainer, foundation['grid-container'])}>
        {this.renderHeaderTitle()}
        <section className={styles.mainContent}>
          <Link to={`/hotel/${hotel.slug}/offer/${id}`}>
            <button className={styles.backButtonContainer}>
              <HTImage
                src={greenBackIcon}
                alt={formatMessage({ id: 'image.icon.back' })}
              />
            </button>
          </Link>
          <div className={styles.title}>
            <HTText translationKey={name} />
          </div>
          <div className={styles.prices}>
            <div className={styles.priceContainer}>
              <div className={styles.priceTitle}>
                <HTText translationKey={'packages.step1.starting_from'} />
              </div>
              <div className={styles.price}>
                <HTCurrency value={startingFrom} />
              </div>
            </div>
            <div className={styles.priceContainer}>
              <div className={styles.priceTitle}>
                <HTText translationKey={'packages.step1.save_up_to'} />
              </div>
              <div className={styles.price}>
                <HTCurrency value={saveUpTo} roundTo8={false} />
              </div>
            </div>
          </div>
          {this.renderCapacity()}
          {this.renderCalendar()}
          {this.renderInfo()}
          <div className={styles.buttonContainer}>
            <div className={styles.loadingIndicatorContainer}>
              {isReservationRequesting && <HTLoadingIndicator />}
            </div>
            <HTButton
              className={styles.button}
              contentClassName={styles.buttonContent}
              buttonType="green"
              isDisabled={
                !dateRange.from ||
                !dateRange.to ||
                error !== null ||
                isReservationRequesting
              }
              text={'JUST ONE MORE STEP TO CONFIRM'}
              onClick={this.onClickNextStep}
            />
          </div>
        </section>
        {this.renderPolicies()}
      </div>
    );
  }
}

export default injectIntl(PackageStep1);
