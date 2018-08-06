// @flow

import moment from 'moment';
import yup from 'yup';

const DateSchema = yup.date;

export default class MomentDateSchemaType extends DateSchema {
  _validFormats: string[];

  constructor() {
    super();

    this._validFormats = [];

    this.withMutation(() => {
      // eslint-disable-next-line flowtype/no-weak-types
      this.transform(function(value: any, originalvalue: any) {
        if (this.isType(value)) {
          // we have a valid value
          return moment(value);
        }

        return moment(originalvalue, this._validFormats, true);
      });
    });
  }

  // eslint-disable-next-line flowtype/no-weak-types
  _typeCheck(value: any) {
    return (
      super._typeCheck(value) || (moment.isMoment(value) && value.isValid())
    );
  }

  format(formats: string | string[]) {
    if (!formats) {
      throw new Error('must enter a valid format');
    }

    const next = this.clone();
    next._validFormats = [].concat(formats);

    return next;
  }
}
