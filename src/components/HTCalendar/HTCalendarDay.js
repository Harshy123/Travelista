// @flow

import * as React from 'react';
import cn from 'classnames';

import styles from './HTCalendar.scss';

import type { HotelDate } from '../../models/HotelDate';
import type { Rates } from '../../models/Rates';
import type Moment from 'moment';

type Props = {
  hotelDate: HotelDate,
  theDay: Moment,
  hotelRates: Rates,
};

export default class HTCalendarDay extends React.PureComponent<Props> {
  render() {
    const { theDay, hotelDate, hotelRates } = this.props;
    const dStr = theDay.date().toString();

    if (!hotelDate) {
      return <div className={'DayPicker-Wrapper'}>{dStr}</div>;
    }

    const diff = Math.round(hotelDate.price - hotelRates.r1);
    return (
      <div className={'DayPicker-Wrapper'}>
        <span className={cn({ 'DayPicker-green': diff === 0 })}>{dStr}</span>
        <br />
        {diff !== 0 && (
          <span className={cn(styles.dayPrice)}>
            {diff > 0 && '+'}
            {Math.round(diff)}
          </span>
        )}
      </div>
    );
  }
}
