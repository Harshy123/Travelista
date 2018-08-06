// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import moment from 'moment';
import cn from 'classnames';

import HTTextInput from '../HTForm/HTTextInput';
import HTText from '../HTText/HTText';
import HTSelect from '../HTForm/HTSelect';
import HTDateInput from '../HTForm/HTDateInput';
import HintDropDown from '../HTForm/HintDropDown';
import HTCheckBox from '../HTForm/HTCheckBox';

import { mustBe } from '../../utils/utils';
import { validateEmailFormat } from '../../utils/stringUtil';
import { COUNTRY_OPTIONS, SALUTATION_OPTIONS } from '../../utils/options';

import styles from './PackageStep2.scss';
import foundation from '../../styles/foundation.scss';

import type Moment from 'moment';
import type { IntlShape } from 'react-intl';
import type { Option } from '../HTForm/HTSelect';
import type { Travelista, TravelistaTrip } from '../../models/Travelista';

type ErrorReason = {
  user: {
    salutation: ?string,
    firstName: ?string,
    lastName: ?string,
    passportName: ?string,
    email: ?string,
    countryOfResidence: ?string,
    mobileNumber: ?string,
  },
};

type Props = {
  intl: IntlShape,
  index: number,
  user: null | Travelista,
  trip?: TravelistaTrip,
  isUser: boolean,
  onChange: (Travelista, TravelistaTrip) => void,
  onValidStateChange: (index: number, validState: boolean) => void,
  showErrorMessage: boolean,
  stayingStartDate: Moment,
  stayingEndDate: Moment,
};

type State = {
  user: Travelista,
  trip: TravelistaTrip,
  errorReason: ErrorReason,
};

const requiredErrorKey = 'travelista_detail.invalid.required';

class TravelistaDetail extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { user, trip } = props;

    let email = '';
    let firstName = '';
    let lastName = '';
    let passportName = '';
    let mobileNumber = '';
    let countryOfResidence = '';
    let salutation = '';
    let specialRequest = '';
    if (user) {
      const validUser = mustBe(user);
      email = validUser.email;
      firstName = validUser.firstName;
      lastName = validUser.lastName;
      passportName = validUser.passportName;
      mobileNumber = validUser.mobileNumber;
      countryOfResidence = validUser.countryOfResidence;
      salutation = validUser.salutation;
      specialRequest = validUser.specialRequest;
    }

    let arrivalDate = null;
    let arrivalFlight = null;
    let departureDate = null;
    let departureFlight = null;
    let updateProfile = false;
    let saveSpecialRequest = false;
    if (trip) {
      arrivalDate = trip.arrivalDate;
      arrivalFlight = trip.arrivalFlight;
      departureDate = trip.departureDate;
      departureFlight = trip.departureFlight;
      updateProfile = trip.updateProfile;
      saveSpecialRequest = trip.saveSpecialRequest;
    }

    const { intl: { formatMessage } } = props;
    const requiredError = formatMessage({ id: requiredErrorKey });

    this.state = {
      user: {
        email,
        firstName,
        lastName,
        passportName,
        mobileNumber,
        countryOfResidence,
        salutation,
        specialRequest,
      },
      trip: {
        arrivalDate,
        arrivalFlight,
        departureDate,
        departureFlight,
        updateProfile,
        saveSpecialRequest,
      },
      errorReason: {
        user: {
          salutation: salutation ? null : requiredError,
          firstName: firstName ? null : requiredError,
          lastName: lastName ? null : requiredError,
          passportName: passportName ? null : requiredError,
          email: email ? null : requiredError,
          countryOfResidence: countryOfResidence ? null : requiredError,
          mobileNumber: mobileNumber ? null : requiredError,
        },
      },
    };
  }

  _reducedValidState(errorReason: ErrorReason) {
    let reducedValidState = true;
    Object.keys(errorReason.user).forEach((errorReasonKey: string) => {
      if (errorReason.user[errorReasonKey]) {
        reducedValidState = false;
        return;
      }
    });
    return reducedValidState;
  }

  componentDidMount() {
    this.props.onChange(this.state.user, this.state.trip);
    this.props.onValidStateChange(
      this.props.index,
      this._reducedValidState(this.state.errorReason)
    );
  }

  onUserErrorReasonChange = (key: string, value: ?string) => {
    const newErrorReason = {
      ...this.state.errorReason,
      user: {
        ...this.state.errorReason.user,
        [key]: value,
      },
    };
    this.setState({ errorReason: newErrorReason });
    this.props.onValidStateChange(
      this.props.index,
      this._reducedValidState(newErrorReason)
    );
  };

  onInputChange = (key: string) => (value: string) => {
    const { intl: { formatMessage } } = this.props;
    this.setState((state: State) => {
      const user = {
        ...state.user,
        [key]: value,
      };
      this.props.onChange(user, state.trip);
      return {
        user: user,
      };
    });
    if (!value.trim()) {
      this.onUserErrorReasonChange(
        key,
        formatMessage({ id: requiredErrorKey })
      );
      return;
    }

    this.onUserErrorReasonChange(key, null);
  };

  onSelectChange = (key: string) => ({ value }: Option<string>) => {
    const { intl: { formatMessage } } = this.props;
    this.setState((state: State) => {
      const user = {
        ...state.user,
        [key]: value,
      };
      this.props.onChange(user, state.trip);
      return {
        user: user,
      };
    });
    if (!value) {
      this.onUserErrorReasonChange(
        key,
        formatMessage({ id: requiredErrorKey })
      );
      return;
    }

    this.onUserErrorReasonChange(key, null);
  };

  onTripBoolChange = (key: string) => (value: boolean) => {
    this.setState((state: State) => {
      const trip = {
        ...state.trip,
        [key]: value,
      };
      this.props.onChange(state.user, trip);
      return {
        trip: trip,
      };
    });
  };

  onTripChange = (key: string) => (value: string) => {
    this.setState((state: State) => {
      const trip = {
        ...state.trip,
        [key]: value,
      };
      this.props.onChange(state.user, trip);
      return {
        trip: trip,
      };
    });
  };

  onSpecialRequestChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { target } = event;
    this.setState((state: State) => {
      const user = {
        ...state.user,
        specialRequest: target.value,
      };
      this.props.onChange(user, state.trip);
      return {
        user: user,
      };
    });
  };

  onTripDateChange = (key: string) => (value: Date) => {
    const mDate = value && moment(value);
    this.setState((state: State) => {
      const trip = {
        ...state.trip,
        [key]: mDate,
      };
      this.props.onChange(state.user, trip);
      return {
        trip: trip,
      };
    });
  };

  onEmailChange = (value: string) => {
    const { intl: { formatMessage } } = this.props;
    if (!validateEmailFormat(value)) {
      this.onUserErrorReasonChange(
        'email',
        formatMessage({ id: 'packages.step2.error.email.email_format' })
      );
      return;
    }
    this.onInputChange('email')(value);
  };

  renderSpecialRequest = () => {
    const { intl: { formatMessage }, isUser } = this.props;
    return (
      <div className={styles.specialRequest}>
        <h4 className={styles.specialRequestTitle}>
          <HTText translationKey={'packages.step2.special_request'} />
        </h4>
        <HintDropDown
          className={styles.dropDown}
          hint={formatMessage({
            id: 'travelista_detail.special_requests.hint',
          })}
        />
        <textarea
          className={styles.textArea}
          placeholder={formatMessage({
            id: 'packages.step2.special_request.text_area_placeholder',
          })}
          onChange={this.onSpecialRequestChange}
          value={this.state.user.specialRequest}
        />
        {isUser && (
          <label
            className={cn(styles.checkboxLabel, styles.saveSpecialRequest)}
          >
            <HTCheckBox
              id="special_request"
              label={formatMessage({
                id: 'packages.step2.save_special_request',
              })}
              value={this.state.trip.saveSpecialRequest}
              onChange={this.onTripBoolChange('saveSpecialRequest')}
            />
            <span className={styles.checkboxText}>
              <HTText translationKey={'packages.step2.update_profile'} />
            </span>
          </label>
        )}
      </div>
    );
  };

  render() {
    const {
      user,
      trip,
      isUser,
      index,
      showErrorMessage,
      intl: { formatMessage },
      stayingStartDate,
      stayingEndDate,
    } = this.props;
    let email = null;
    let firstName = null;
    let lastName = null;
    let passportName = null;
    let mobileNumber = null;
    let countryOfResidence = null;
    let salutation = null;
    if (user) {
      const validUser = mustBe(user);
      email = validUser.email;
      firstName = validUser.firstName;
      lastName = validUser.lastName;
      passportName = validUser.passportName;
      mobileNumber = validUser.mobileNumber;
      countryOfResidence = validUser.countryOfResidence;
      salutation = validUser.salutation;
    }

    const { user: localUser } = this.state;
    if (localUser) {
      countryOfResidence = localUser.countryOfResidence;
      salutation = localUser.salutation;
    }

    let arrivalDate = null;
    let arrivalFlight = null;
    let departureDate = null;
    let departureFlight = null;
    let updateProfile = null;
    if (trip) {
      const validTrip = mustBe(trip);
      arrivalDate = validTrip.arrivalDate;
      arrivalFlight = validTrip.arrivalFlight;
      departureDate = validTrip.departureDate;
      departureFlight = validTrip.departureFlight;
      updateProfile = validTrip.updateProfile;
    }

    const { errorReason } = this.state;

    return (
      <div key={'room-' + index}>
        <h4 className={styles.roomTitle}>Room {index + 1}</h4>
        <div className={styles.travelistaDetails}>
          <HTText translationKey="packages.step2.travelista_details" />
          <HintDropDown
            className={styles.dropDown}
            hint={formatMessage({ id: 'travelista_detail.details.hint' })}
          />
        </div>
        <div className={cn(foundation['grid-x'], styles.roomForm)}>
          <div className={cn(foundation['medium-6'], styles.roomInfo)}>
            <div className={foundation['grid-x']}>
              <div className={cn(foundation['medium-6'], styles.formControl)}>
                <HTSelect
                  isError={
                    showErrorMessage && errorReason.user.salutation !== null
                  }
                  errorMessage={
                    showErrorMessage ? errorReason.user.salutation : null
                  }
                  placeholder={formatMessage({
                    id: 'packages.step2.salutation',
                  })}
                  placeholderHint={
                    salutation
                      ? formatMessage({
                          id: 'packages.step2.salutation',
                        })
                      : ''
                  }
                  options={SALUTATION_OPTIONS}
                  onChange={this.onSelectChange('salutation')}
                  defaultValue={salutation ? salutation : ''}
                />
              </div>
            </div>
            <div className={foundation['grid-x']}>
              <div className={cn(foundation['medium-6'], styles.formControl)}>
                <HTTextInput
                  isError={
                    showErrorMessage && errorReason.user.firstName != null
                  }
                  errorMessage={
                    showErrorMessage ? errorReason.user.firstName : null
                  }
                  placeholder={formatMessage({
                    id: 'packages.step2.first_name',
                  })}
                  placeholderHint={
                    firstName &&
                    formatMessage({
                      id: 'packages.step2.first_name',
                    })
                  }
                  onChange={this.onInputChange('firstName')}
                  defaultValue={firstName ? firstName : ''}
                />
              </div>
              <div className={cn(foundation['medium-6'], styles.formControl)}>
                <HTTextInput
                  isError={
                    showErrorMessage && errorReason.user.lastName != null
                  }
                  errorMessage={
                    showErrorMessage ? errorReason.user.lastName : null
                  }
                  placeholder={formatMessage({
                    id: 'packages.step2.last_name',
                  })}
                  placeholderHint={
                    lastName &&
                    formatMessage({
                      id: 'packages.step2.last_name',
                    })
                  }
                  onChange={this.onInputChange('lastName')}
                  defaultValue={lastName ? lastName : ''}
                />
              </div>
            </div>
            <div
              className={cn(foundation['medium-12'], styles.fullFormControl)}
            >
              <HTTextInput
                isError={
                  showErrorMessage && errorReason.user.passportName != null
                }
                errorMessage={
                  showErrorMessage ? errorReason.user.passportName : null
                }
                placeholder={formatMessage({ id: 'packages.step2.full_name' })}
                placeholderHint={
                  passportName &&
                  formatMessage({ id: 'packages.step2.full_name' })
                }
                onChange={this.onInputChange('passportName')}
                defaultValue={passportName ? passportName : ''}
              />
            </div>
            <div className={cn(foundation['medium-12'], styles.formControl)}>
              <div className={foundation['grid-x']}>
                <HTTextInput
                  className={foundation['medium-12']}
                  isError={showErrorMessage && errorReason.user.email != null}
                  errorMessage={
                    showErrorMessage ? errorReason.user.email : null
                  }
                  placeholder={formatMessage({
                    id: 'packages.step2.email_address',
                  })}
                  placeholderHint={
                    email &&
                    formatMessage({
                      id: 'packages.step2.email_address',
                    })
                  }
                  onChange={this.onEmailChange}
                  trailingNode={
                    isUser && (
                      <HintDropDown
                        className={cn(
                          styles.emailHintDropDown,
                          foundation['medium-1']
                        )}
                        hint={formatMessage({
                          id: 'packages.step2.email.disabled_hint',
                        })}
                      />
                    )
                  }
                  defaultValue={email ? email : ''}
                  isDisabled={isUser}
                />
              </div>
            </div>
            <div
              className={cn(foundation['medium-12'], styles.fullFormControl)}
            >
              <HTTextInput
                isError={
                  showErrorMessage && errorReason.user.mobileNumber != null
                }
                errorMessage={
                  showErrorMessage ? errorReason.user.mobileNumber : null
                }
                placeholder={formatMessage({
                  id: 'packages.step2.phone_number',
                })}
                placeholderHint={
                  mobileNumber &&
                  formatMessage({
                    id: 'packages.step2.phone_number',
                  })
                }
                onChange={this.onInputChange('mobileNumber')}
                defaultValue={mobileNumber ? mobileNumber : ''}
              />
            </div>
            <div className={foundation['grid-x']}>
              <div
                className={cn(foundation['medium-8'], styles.fullFormControl)}
              >
                <HTSelect
                  isError={
                    showErrorMessage &&
                    errorReason.user.countryOfResidence !== null
                  }
                  errorMessage={
                    showErrorMessage
                      ? errorReason.user.countryOfResidence
                      : null
                  }
                  placeholder={formatMessage({
                    id: 'packages.step2.country_of_residence',
                  })}
                  placeholderHint={
                    countryOfResidence
                      ? formatMessage({
                          id: 'packages.step2.country_of_residence',
                        })
                      : ''
                  }
                  options={COUNTRY_OPTIONS}
                  onChange={this.onSelectChange('countryOfResidence')}
                  defaultValue={countryOfResidence ? countryOfResidence : ''}
                />
              </div>
            </div>
            {isUser && (
              <label className={styles.checkboxLabel}>
                <HTCheckBox
                  id={`user-${index}`}
                  label={formatMessage({ id: 'packages.step2.update_profile' })}
                  onChange={this.onTripBoolChange('updateProfile')}
                  value={updateProfile || false}
                />
                <span className={styles.checkboxText}>
                  <HTText translationKey={'packages.step2.update_profile'} />
                </span>
              </label>
            )}
          </div>

          <div className={foundation['medium-6']}>
            <div className={styles.tripInfomationTitle}>
              <HTText translationKey={'packages.step2.trip_information'} />
              <HintDropDown
                className={styles.dropDown}
                hint={formatMessage({ id: 'travelista_detail.trip.hint' })}
              />
            </div>
            <div className={foundation['grid-x']}>
              <div className={cn(foundation['medium-6'], styles.formControl)}>
                <HTDateInput
                  placeholder={formatMessage({
                    id: 'packages.step2.arrival_date',
                  })}
                  onChange={this.onTripDateChange('arrivalDate')}
                  value={arrivalDate ? arrivalDate.toDate() : null}
                  disabledDays={{
                    after: stayingStartDate.toDate(),
                  }}
                  isOptional
                />
              </div>
              <div
                className={cn(
                  foundation['medium-6'],
                  styles.formControl,
                  styles.tripFlightInput
                )}
              >
                <HTTextInput
                  placeholder={formatMessage({
                    id: 'packages.step2.flight_number',
                  })}
                  placeholderHint={
                    arrivalFlight &&
                    formatMessage({
                      id: 'packages.step2.flight_number',
                    })
                  }
                  onChange={this.onTripChange('arrivalFlight')}
                  defaultValue={arrivalFlight || ''}
                  isOptional
                />
              </div>
              <div className={cn(foundation['medium-6'], styles.formControl)}>
                <HTDateInput
                  placeholder={formatMessage({
                    id: 'packages.step2.departure_date',
                  })}
                  onChange={this.onTripDateChange('departureDate')}
                  value={departureDate ? departureDate.toDate() : null}
                  disabledDays={{
                    before: stayingEndDate.toDate(),
                  }}
                  isOptional
                />
              </div>
              <div
                className={cn(
                  foundation['medium-6'],
                  styles.formControl,
                  styles.tripFlightInput
                )}
              >
                <HTTextInput
                  placeholder={formatMessage({
                    id: 'packages.step2.flight_number',
                  })}
                  placeholderHint={
                    departureFlight &&
                    formatMessage({
                      id: 'packages.step2.flight_number',
                    })
                  }
                  onChange={this.onTripChange('departureFlight')}
                  defaultValue={departureFlight || ''}
                  isOptional
                />
              </div>
            </div>
          </div>
        </div>
        {this.renderSpecialRequest()}
      </div>
    );
  }
}

export default injectIntl(TravelistaDetail);
