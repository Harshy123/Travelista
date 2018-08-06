// @flow
import React, { PureComponent } from 'react';
import DayPicker from 'react-day-picker';
import moment from 'moment';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { toDateString, toDurationString, timeMapping } from '../../utils/time';
import { flatten } from '../../utils/utils';

import HTImage from '../HTImage/HTImage';
import HTCalendarDay from './HTCalendarDay';

import styles from './HTCalendar.scss';
import './HTCalendar.css';
import calendarNextIcon from '../../images/ic_calendar_next.svg';
import calendarPrevIcon from '../../images/ic_calendar_prev.svg';
import loadingIcon from '../../images/ic_loading.png';

import type Moment from 'moment';
import type { IntlShape } from 'react-intl';
import type { HotelDate } from '../../models/HotelDate';
import type { Rates } from '../../models/Rates';
import type { Request } from '../../types';

type Props = {
  intl: IntlShape,
  stayingStartAt: Moment,
  stayingEndAt: Moment,
  numberOfRooms: number,
  numberOfMonths: number,
  dates: {
    [string]: HotelDate,
  },
  hotelRates: Rates,
  hotelDateRequests: {
    [string]: Request,
  },
  onDateRangeSelect: (from: ?Date, to: ?Date) => void,
  minimumNights: number,
  packageNights: number,
  defaultFrom: ?Date,
  defaultTo: ?Date,
  roomTypeId: string,
  packageId: string,
  calendarFetchHotelDatesByDuration: (Moment, Moment) => void,
  flushHotelDateRequests: () => void,
  onClickStateUpdate?: (clickState: 'first' | 'odd' | 'even') => void,
};
// TODO: Change Date to Moment
type State = {
  from: ?Date,
  to: ?Date,
  enteredTo: ?Date,
  clickState: 'first' | 'odd' | 'even',
};

type CalendarState = {
  [key: string]: ?State,
};

class HTCalendar extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const localCalendarState = this._loadLocalCalendarState();
    if (localCalendarState) {
      const { onDateRangeSelect, onClickStateUpdate } = this.props;
      this.state = localCalendarState;
      onDateRangeSelect(this.state.from, this.state.to);
      if (onClickStateUpdate) {
        onClickStateUpdate(this.state.clickState);
      }
    } else {
      const { defaultFrom, defaultTo } = props;
      this.state = {
        from: defaultFrom,
        to: defaultTo,
        enteredTo: defaultTo,
        disabledDays: [],
        clickState: 'first',
      };
    }
  }

  componentWillMount() {
    const { flushHotelDateRequests } = this.props;
    flushHotelDateRequests();
  }

  componentWillReceiveProps(nextProps: Props) {
    const { hotelDateRequests } = nextProps;
    const thisNumberOfRooms = this.props.numberOfRooms;

    if (Object.keys(hotelDateRequests).length === 0) {
      this.fetchNumberOfMonths();
    }

    if (thisNumberOfRooms !== nextProps.numberOfRooms) {
      // clear state when numberOfRooms is changed
      this.setState({
        from: null,
        to: null,
        enteredTo: null,
        clickState: 'first',
      });
    }
  }

  componentWillUnmount() {
    this._removeLocalCalendarState();
  }

  componentWillUpdate(nextProps: Props, nextState: State) {
    this._saveLocalCalendarState(nextState);
  }

  get missingDates(): Array<Date> {
    const { stayingStartAt, stayingEndAt, dates } = this.props;
    // entries where dates are without associated HotelDate Entry
    const missingDates = flatten(
      timeMapping(stayingStartAt, stayingEndAt, 'd', (date: Moment) => {
        if (!dates[toDateString(date)]) {
          return moment(date).toDate();
        }
      })
    );
    return missingDates;
  }

  get unavaliableDatesWithLeadingUnavaliables(): Array<Date> {
    const { dates, packageNights } = this.props;
    // loop throught the dates object, find all the unavaliable Dates, convert it to moment object
    const unavaliableDates: Moment[] = Object.keys(dates)
      .map((key: string) => dates[key])
      .filter((hd: HotelDate) => {
        return !this.isValidHotelDateEntry(hd);
      })
      .map((hd: HotelDate) => hd.date);

    // finding all the dates leading an unavaliable date with package nights as pivot
    const unavaliableDatesWithLeadingUnavaliables: Date[] = unavaliableDates.reduce(
      (dates: Date[], d: Moment) => {
        const results = [];
        for (let day = packageNights - 1; day > 0; day--) {
          results.push(
            moment(d)
              .subtract(day, 'd')
              .toDate()
          );
        }
        return [...dates, ...results, d.toDate()];
      },
      []
    );

    return unavaliableDatesWithLeadingUnavaliables;
  }

  _deserializeLocalCalendarState = (): ?CalendarState => {
    const raw = localStorage.getItem('ht_calendar');
    return raw ? JSON.parse(raw) : null;
  };

  _serializeLocalCalendarState = (calendarState: CalendarState) => {
    localStorage.setItem('ht_calendar', JSON.stringify(calendarState));
  };

  _saveLocalCalendarState = (state: State) => {
    const currenctLocalCalendar = this._deserializeLocalCalendarState();
    const newLocalCalendar = {
      ...currenctLocalCalendar,
      [this._roomTypePackageKeyString()]: state,
    };
    this._serializeLocalCalendarState(newLocalCalendar);
  };

  _loadLocalCalendarState = (): ?State => {
    const localCalendarState = this._deserializeLocalCalendarState();
    if (
      localCalendarState &&
      localCalendarState[this._roomTypePackageKeyString()]
    ) {
      return this._parseLocalCalendarState(
        localCalendarState[this._roomTypePackageKeyString()]
      );
    }
    return null;
  };

  _removeLocalCalendarState = () => {
    const raw = localStorage.getItem('ht_calendar');
    if (!raw) {
      return;
    }

    const htCalendar = JSON.parse(raw);
    if (htCalendar) {
      delete htCalendar[this._roomTypePackageKeyString()];
      this._serializeLocalCalendarState(htCalendar);
    }
  };

  _roomTypePackageKeyString(): string {
    return `${this.props.roomTypeId}_${this.props.packageId}`;
  }

  _parseLocalCalendarState(unparsedState: ?State) {
    if (!unparsedState) {
      return {
        from: null,
        to: null,
        enteredTo: null,
        disabledDays: [],
        clickState: 'first',
      };
    }

    const newState = {
      from: unparsedState.from ? new Date(unparsedState.from) : null,
      to: unparsedState.to ? new Date(unparsedState.to) : null,
      enteredTo: unparsedState.enteredTo
        ? new Date(unparsedState.enteredTo)
        : null,
      disabledDays: [],
      clickState: unparsedState.clickState,
    };
    return newState;
  }

  unavaliableDates() {
    const { stayingStartAt, stayingEndAt, packageNights } = this.props;
    const today = moment().toDate();
    // adding one more of selectable day
    // https://github.com/oursky/heytravelista/issues/358
    const outsideStayingPeriod = {
      before: stayingStartAt.toDate() < today ? today : stayingStartAt.toDate(),
      after: moment(stayingEndAt)
        .subtract(packageNights, 'd')
        .toDate(),
    };
    return [
      ...this.missingDates,
      outsideStayingPeriod,
      ...this.unavaliableDatesWithLeadingUnavaliables,
    ];
  }

  /* Compute and return the disableDays based on clickState
   */
  disabledDays() {
    const { from, clickState } = this.state;

    if (clickState === 'first') {
      return this.unavaliableDates();
    }
    if (clickState === 'odd') {
      const mFrom = moment(from);
      // disable all the dates before the selected date and after the closest unavaliable dates
      return [
        {
          before: from,
          after: this.closestUnavaliable(mFrom)
            .subtract(1, 'd')
            .toDate(),
        },
      ];
    }
    if (clickState === 'even') {
      return this.unavaliableDates();
    }
  }

  closestUnavaliable(from: Moment): Moment {
    const { dates } = this.props;
    const date = dates[toDateString(from)];
    if (date == null || !this.isValidHotelDateEntry(date)) {
      return from;
    } else {
      // TODO: remove recursive
      return this.closestUnavaliable(moment(from).add(1, 'd'));
    }
  }

  fetchNumberOfMonths = () => {
    const { stayingStartAt, numberOfMonths } = this.props;
    for (let i = 0; i <= numberOfMonths; i++) {
      let firstDateOfMonth = moment(stayingStartAt);
      if (moment().isAfter(stayingStartAt)) {
        firstDateOfMonth = moment();
      }
      const date = firstDateOfMonth.add(i, 'month').startOf('month');
      this.fetchMonth(date);
    }
  };

  _effectiveMonthRange = (date: Moment) => {
    const { stayingStartAt, stayingEndAt } = this.props;
    const firstValidDay = stayingStartAt.isAfter(date)
      ? stayingStartAt
      : moment(date);
    const endOfMonth = moment(date).endOf('month');
    const lastValidDay = endOfMonth.isAfter(stayingEndAt)
      ? stayingEndAt
      : endOfMonth;
    if (firstValidDay.isAfter(lastValidDay)) {
      return null;
    }
    return {
      firstValidDay,
      lastValidDay,
    };
  };

  fetchMonth = (date: Moment) => {
    const { hotelDateRequests, calendarFetchHotelDatesByDuration } = this.props;
    const effectiveRange = this._effectiveMonthRange(date);
    if (effectiveRange === null) {
      return;
    }
    const { firstValidDay, lastValidDay } = effectiveRange;
    const request =
      hotelDateRequests[toDurationString(firstValidDay, lastValidDay)];
    if (request == null || !request.requesting) {
      calendarFetchHotelDatesByDuration(firstValidDay, lastValidDay);
    }
  };

  resetSelectedDates = () => {
    const { onDateRangeSelect } = this.props;
    onDateRangeSelect(null, null);
    this.setState({
      from: null,
      to: null,
      enteredTo: null,
    });
  };

  renderDay = (date: Date) => {
    const { dates, hotelRates } = this.props;
    const mDate = moment(date);
    const hotelDate = dates[toDateString(mDate)];

    return (
      <HTCalendarDay
        theDay={mDate}
        hotelDate={hotelDate}
        hotelRates={hotelRates}
      />
    );
  };

  renderCaption = ({ date, localeUtils }: { date: Date, localeUtils: * }) => {
    const { hotelDateRequests, intl: { formatMessage } } = this.props;
    const months = localeUtils.getMonths();

    const effectiveRange = this._effectiveMonthRange(moment(date));
    let request = null;
    if (effectiveRange !== null) {
      const { firstValidDay, lastValidDay } = effectiveRange;
      request =
        hotelDateRequests[toDurationString(firstValidDay, lastValidDay)];
    }

    return (
      <div className={styles.monthCaption}>
        <span className={styles.year}>{date.getFullYear()}</span>
        <span>{months[Math.abs(date.getMonth() % 12)].toUpperCase()}</span>
        <div className={styles.loadingContainer}>
          {request &&
            request.requesting && (
              <HTImage
                className={styles.loading}
                src={loadingIcon}
                alt={formatMessage({ id: 'image.icon.loading' })}
              />
            )}
        </div>
      </div>
    );
  };

  onPrevMonthClick = (month: Date, onPreviousClick: () => void) => {
    return () => {
      this.fetchMonth(moment(month));
      onPreviousClick();
    };
  };

  onNextMonthClick = (month: Date, onNextClick: () => void) => {
    return () => {
      this.fetchMonth(moment(month));
      onNextClick();
    };
  };

  renderNav = ({
    nextMonth,
    previousMonth,
    onPreviousClick,
    onNextClick,
  }: {
    nextMonth: Date,
    previousMonth: Date,
    onPreviousClick: () => void,
    onNextClick: () => void,
  }) => {
    const {
      stayingStartAt,
      stayingEndAt,
      intl: { formatMessage },
    } = this.props;
    const mNextMonth = moment(nextMonth).startOf('month');
    const mPreviousMonth = moment(previousMonth).endOf('month');
    // adding one day to ending period
    // https://github.com/oursky/heytravelista/issues/358
    const displayEndAt = moment(stayingEndAt).add(1, 'day');
    return (
      <div className={styles.nav}>
        {mPreviousMonth.diff(stayingStartAt, 'day') > 0 ? (
          <button
            className={cn(styles.navPrev, styles.navButton)}
            onClick={this.onPrevMonthClick(previousMonth, onPreviousClick)}
          >
            <HTImage
              src={calendarPrevIcon}
              alt={formatMessage({ id: 'image.slider.prev' })}
            />
          </button>
        ) : (
          <button className={styles.navPrev} />
        )}
        {mNextMonth.diff(displayEndAt, 'day') <= 0 && (
          <button
            className={cn(styles.navNext, styles.navButton)}
            onClick={this.onNextMonthClick(nextMonth, onNextClick)}
          >
            <HTImage
              src={calendarNextIcon}
              alt={formatMessage({ id: 'image.slider.next' })}
            />
          </button>
        )}
      </div>
    );
  };

  setClickState = (newState: {
    clickState: 'first' | 'odd' | 'even',
    from: Date,
    to: Date,
    enteredTo: Date,
  }) => {
    const { onClickStateUpdate } = this.props;
    this.setState(newState, () => {
      if (onClickStateUpdate && newState.clickState) {
        onClickStateUpdate(newState.clickState);
      }
    });
  };

  /* Wanted behaviour:
   * 1 First click (Odd click) - Select the start date, and automatically
   *   select the end date and highlight the period (based on the minimum # of
   *   night that the package selected), all dates before the start date
   *   should be dimmed (un-clickable)
   *
   * 2 Second click (Even click) - change the end date, and update the no.
   *   of nights accordingly.  If the no. of nights selected is less than
   *   the minimum no. of nights requirement, it will show an warning message
   *   and cannot be proceeded
   *
   * 3 Third click (Odd click) and fourth click (Even click) - all odd order
   *   of clicks will repeat the step1 and all even order of clicks repeats
   *   step 2
   */
  handleDayClick = (date: Date, modifier: { disabled: boolean }) => {
    const { from, clickState } = this.state;
    const { onDateRangeSelect, packageNights } = this.props;
    const mDate = moment(date);
    if (clickState === 'first' && !modifier.disabled) {
      const autoSelectedEndDate = moment(date)
        .add(packageNights, 'days')
        .toDate();
      this.setClickState({
        clickState: 'odd',
        from: mDate.toDate(),
        to: autoSelectedEndDate,
        enteredTo: autoSelectedEndDate,
      });
      onDateRangeSelect(mDate.toDate(), autoSelectedEndDate);
    }
    if (clickState === 'odd' && !modifier.disabled) {
      if (!from) {
        // TODO(limouren): remove this unnecessary throw by
        // modeling click state with tagged union
        throw new Error('from date must present');
      }

      this.setClickState({
        clickState: 'even',
        from: date,
        to: mDate.toDate(),
        enteredTo: mDate.toDate(),
      });
      onDateRangeSelect(from, mDate.toDate());
    }
    if (clickState === 'even' && !modifier.disabled) {
      const autoSelectedEndDate = moment(date)
        .add(packageNights, 'days')
        .toDate();
      this.setClickState({
        clickState: 'odd',
        from: mDate.toDate(),
        to: autoSelectedEndDate,
        enteredTo: autoSelectedEndDate,
      });
      onDateRangeSelect(mDate.toDate(), autoSelectedEndDate);
    }
  };

  handleDayMouseEnter = (day: Date, modifier: { disabled: boolean }) => {
    const { from, to } = this.state;
    if (!modifier.disabled && from !== null && to == null) {
      this.setState({
        enteredTo: day,
      });
    }
  };

  isValidHotelDateEntry = (hotelDate: ?HotelDate): boolean => {
    const { numberOfRooms } = this.props;
    return (
      hotelDate != null &&
      hotelDate.isAvailable &&
      hotelDate.rooms >= numberOfRooms
    );
  };

  onBlur = () => {
    const { from, to, enteredTo } = this.state;
    if (from != null && to == null && enteredTo != null) {
      this.setState({
        to: enteredTo,
      });
    }
  };

  render() {
    const { from, enteredTo } = this.state;
    const { stayingStartAt, stayingEndAt, numberOfMonths } = this.props;
    const selectedDays = [from, { from, to: enteredTo }];
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = this.disabledDays();
    // adding one day to ending period
    // https://github.com/oursky/heytravelista/issues/358

    const displayEndAt = moment(stayingEndAt).add(1, 'd');
    const today = moment().toDate();
    return (
      <div className={styles.calendarContainer}>
        <DayPicker
          className="ht-calendar"
          initialMonth={
            stayingStartAt.toDate() < today ? today : stayingStartAt.toDate()
          }
          fromMonth={stayingStartAt.toDate()}
          toMonth={displayEndAt.toDate()}
          numberOfMonths={numberOfMonths}
          captionElement={this.renderCaption}
          renderDay={this.renderDay}
          disabledDays={disabledDays}
          selectedDays={selectedDays}
          navbarElement={this.renderNav}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
          modifiers={modifiers}
        />
      </div>
    );
  }
}

export default injectIntl(HTCalendar);
