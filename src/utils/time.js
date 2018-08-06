// @flow
import moment from 'moment';
import type Moment from 'moment';

export function subtractDays(
  param1: Moment | Date,
  param2: Moment | Date
): number {
  const mParam1 = moment(param1).startOf('d');
  const mParam2 = moment(param2).startOf('d');
  const duration = moment.duration(mParam1.diff(mParam2));
  return Math.ceil(duration.asDays());
}

export function diffDays(momentA: Moment, momentB: Moment): number {
  const duration = moment.duration(momentA.diff(momentB));
  return Math.ceil(duration.asHours() / 24);
}

export function toDateString(date: Moment): string {
  return date.format('MMDDYYYY');
}

export function toDurationString(from: Moment, to: Moment): string {
  return toDateString(from) + ',' + toDateString(to);
}

// mapping between two inclusive dates of moment or date objects
export function timeMapping<T>(
  from: Moment | Date,
  to: Moment | Date,
  interval: 'd' | 'day' | 'm' | 'month',
  func: (date: Moment) => T
): T[] {
  const timeDiff = moment(to).diff(from, interval);
  if (timeDiff < 0) {
    return [];
  }
  return timeArray(from, to, interval).map(func);
}

export function timeArray(
  from: Moment | Date,
  to: Moment | Date,
  interval: 'd' | 'day' | 'm' | 'month'
): Moment[] {
  const mFrom = moment(from).startOf('d');
  const mTo = moment(to).startOf('d');
  const results = [];
  for (let d = moment(mFrom); mTo.diff(d, interval) >= 0; d.add(1, interval)) {
    results.push(moment(d));
  }
  return results;
}
