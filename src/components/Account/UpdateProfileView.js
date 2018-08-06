// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import cn from 'classnames';
import type { Option } from '../HTForm/HTSelect';
import type { User } from '../../models/User';
import type { AccountState } from '../../states/account';
import foundation from '../../styles/foundation.scss';
import styles from './Account.scss';
import ProfilePicture from './ProfilePicture';
import HTText from '../HTText/HTText';
import HTSelect from '../HTForm/HTSelect';
import HTButton from '../HTButton/HTButton';
import HTTextInput from '../HTForm/HTTextInput';
import { mustBe } from '../../utils/utils';
import { toastrError, toastrSuccess } from '../../utils/toastr';
import { validateEmailFormat } from '../../utils/stringUtil';
import { COUNTRY_DIAL_CODE } from '../../utils/constants';
import {
  COUNTRY_OPTIONS,
  CURRENCY_OPTIONS,
  SALUTATION_OPTIONS,
} from '../../utils/options';

type Props = {
  intl: IntlShape,
  push: string => void,
  account: AccountState,
  user: User,
  updateProfile: User => void,
  updateProfilePicture: File => void,
};

type State = {
  form: {
    email: ?string,
    firstName: ?string,
    lastName: ?string,
    passportName: ?string,
    mobileNumber: ?string,
    defaultCurrency: ?string,
    salutation: ?string,
    countryOfResidence: ?string,
    partnerCode: ?string,
  },
  errorReasons: {
    email: null | string,
    firstName: null | string,
    lastName: null | string,
    passportName: null | string,
    mobileNumber: null | string,
    defaultCurrency: null | string,
    countryOfResidence: null | string,
    salutation: null | string,
  },
};

export class UpdateProfileView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const {
      user: {
        email,
        firstName,
        lastName,
        passportName,
        mobileNumber,
        partnerCode,
        defaultCurrency,
        countryOfResidence,
        salutation,
      },
    } = props;
    let mobileNumber_ = mobileNumber;
    const countryDialCode = COUNTRY_DIAL_CODE[countryOfResidence];
    const index = mobileNumber_.indexOf(countryDialCode);
    if (index === 0) {
      mobileNumber_ = mobileNumber_.substring(countryDialCode.length);
    }
    this.state = {
      form: {
        email,
        firstName,
        lastName,
        passportName,
        mobileNumber: mobileNumber_,
        partnerCode: partnerCode ? partnerCode.code : null,
        defaultCurrency,
        countryOfResidence,
        salutation,
      },
      errorReasons: {
        email: null,
        firstName: null,
        lastName: null,
        passportName: null,
        mobileNumber: null,
        defaultCurrency: null,
        countryOfResidence: null,
        salutation: null,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.account.updateProfileRequest.error;
    const nextError = nextProps.account.updateProfileRequest.error;
    const thisRequesting = this.props.account.updateProfileRequest.requesting;
    const nextRequesting = nextProps.account.updateProfileRequest.requesting;
    const { intl: { formatMessage }, push } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(formatMessage({ id: 'account.update_my_profile.success' }));
      push('/account');
    }
  }

  render() {
    const {
      intl: { formatMessage },
      account: { updateProfilePictureRequest, updateProfileRequest },
      user,
      updateProfilePicture,
    } = this.props;

    return (
      <div>
        <section className={styles.accountHeader}>
          <div
            className={cn(
              foundation['grid-container'],
              styles.accountHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'account.update_my_profile'} />
            </h2>
          </div>
        </section>

        <section className={cn(foundation['grid-container'], styles.account)}>
          <ProfilePicture
            className={foundation['hide-for-small-only']}
            user={user}
            updateProfilePictureRequest={updateProfilePictureRequest}
            updateProfilePicture={updateProfilePicture}
          />
          <form className={styles.accountForm} onSubmit={this.onSubmit}>
            {this.renderSalutationField()}
            <div className={cn(foundation['grid-x'], styles.formControl)}>
              {this.renderFirstNameField()}
              {this.renderLastNameField()}
            </div>
            {this.renderPassportNameField()}
            {this.renderEmailField()}
            <div className={cn(foundation['grid-x'], styles.formControl)}>
              {this.renderCountryOfResidenceField()}
              {this.renderMobileNumberField()}
            </div>
            {this.renderCurrencyField()}
            {this.renderPartnerCodeField()}
            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(
                  foundation['small-12'],
                  foundation['medium-10'],
                  styles.buttonGroup
                )}
              >
                <HTButton
                  buttonType={'gray'}
                  onClick={this.onCancelClick}
                  text={formatMessage({ id: 'account.action.cancel' })}
                  className={cn(
                    styles.button,
                    foundation['hide-for-small-only']
                  )}
                />
                <HTButton
                  type={'submit'}
                  buttonType={'green'}
                  text={formatMessage({ id: 'account.action.submit' })}
                  className={styles.button}
                  isDisabled={updateProfileRequest.requesting}
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }

  renderSalutationField = () => {
    const { form: { salutation } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const salutationErrorReason = this.state.errorReasons.salutation;

    return (
      <div className={cn(foundation['grid-x'], styles.formControl)}>
        <div className={cn(foundation['small-12'], foundation['medium-6'])}>
          <HTSelect
            inlineLabel={true}
            isError={salutationErrorReason != null}
            errorMessage={salutationErrorReason}
            onChange={this.onSelectChange('salutation')}
            placeholder={formatMessage({
              id: 'account.profile.form.salutation',
            })}
            placeholderHint={formatMessage({
              id: 'account.profile.form.salutation',
            })}
            options={SALUTATION_OPTIONS}
            defaultValue={mustBe(salutation)}
            isDisabled={updateProfileRequest.requesting}
          />
        </div>
      </div>
    );
  };

  renderFirstNameField = () => {
    const { form: { firstName } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const firstNameErrorReason = this.state.errorReasons.firstName;

    return (
      <div className={cn(foundation['small-12'], foundation['medium-6'])}>
        <HTTextInput
          inlineLabel={true}
          isError={firstNameErrorReason != null}
          errorMessage={firstNameErrorReason}
          onChange={this.onInputChange('firstName')}
          placeholder={formatMessage({
            id: 'account.profile.form.first_name',
          })}
          placeholderHint={
            firstName &&
            formatMessage({
              id: 'account.profile.form.first_name',
            })
          }
          defaultValue={mustBe(firstName)}
          isDisabled={updateProfileRequest.requesting}
        />
      </div>
    );
  };

  renderLastNameField = () => {
    const { form: { lastName } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const lastNameErrorReason = this.state.errorReasons.lastName;

    return (
      <div className={cn(foundation['small-12'], foundation['medium-6'])}>
        <HTTextInput
          inlineLabel={true}
          isError={lastNameErrorReason != null}
          errorMessage={lastNameErrorReason}
          onChange={this.onInputChange('lastName')}
          placeholder={formatMessage({
            id: 'account.profile.form.last_name',
          })}
          placeholderHint={
            lastName &&
            formatMessage({
              id: 'account.profile.form.last_name',
            })
          }
          defaultValue={mustBe(lastName)}
          isDisabled={updateProfileRequest.requesting}
        />
      </div>
    );
  };

  renderPassportNameField = () => {
    const { form: { passportName } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const passportNameErrorReason = this.state.errorReasons.passportName;

    return (
      <div className={cn(foundation['grid-x'], styles.formControl)}>
        <div className={cn(foundation['small-12'], foundation['medium-12'])}>
          <HTTextInput
            inlineLabel={true}
            isError={passportNameErrorReason != null}
            errorMessage={passportNameErrorReason}
            onChange={this.onInputChange('passportName')}
            placeholder={formatMessage({
              id: 'account.profile.form.passport',
            })}
            placeholderHint={
              passportName &&
              formatMessage({
                id: 'account.profile.form.passport',
              })
            }
            hint={formatMessage({
              id: 'account.profile.form.passport.hint',
            })}
            defaultValue={mustBe(passportName)}
            isDisabled={updateProfileRequest.requesting}
          />
        </div>
      </div>
    );
  };

  renderEmailField = () => {
    const { form: { email } } = this.state;
    const { intl: { formatMessage } } = this.props;
    const emailErrorReason = this.state.errorReasons.email;

    return (
      <div className={cn(foundation['grid-x'], styles.formControl)}>
        <div className={cn(foundation['small-12'], foundation['medium-12'])}>
          <HTTextInput
            inlineLabel={true}
            isError={emailErrorReason != null}
            errorMessage={emailErrorReason}
            placeholder={formatMessage({
              id: 'account.profile.form.email_address',
            })}
            placeholderHint={formatMessage({
              id: 'account.profile.form.email_address',
            })}
            onChange={this.onInputChange('email')}
            defaultValue={mustBe(email)}
            isDisabled={true}
          />
        </div>
      </div>
    );
  };

  renderCountryOfResidenceField = () => {
    const { form: { countryOfResidence } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const countryOfResidenceErrorReason = this.state.errorReasons
      .countryOfResidence;

    return (
      <div className={cn(foundation['small-12'], foundation['medium-6'])}>
        <HTSelect
          inlineLabel={true}
          isError={countryOfResidenceErrorReason != null}
          errorMessage={countryOfResidenceErrorReason}
          onChange={this.onSelectChange('countryOfResidence')}
          placeholder={formatMessage({
            id: 'account.profile.form.country_of_residence',
          })}
          placeholderHint={formatMessage({
            id: 'account.profile.form.country_of_residence',
          })}
          options={COUNTRY_OPTIONS}
          defaultValue={mustBe(countryOfResidence)}
          isDisabled={updateProfileRequest.requesting}
          searchable={true}
        />
      </div>
    );
  };

  renderMobileNumberField = () => {
    const { form: { mobileNumber, countryOfResidence } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const countryDialCode: string = countryOfResidence
      ? COUNTRY_DIAL_CODE[countryOfResidence]
      : '';
    const mobileNumberErrorReason = this.state.errorReasons.mobileNumber;

    return (
      <div
        className={cn(
          foundation['small-12'],
          foundation['medium-6'],
          styles.mobileNumber
        )}
      >
        <HTTextInput
          inlineLabel={true}
          isError={mobileNumberErrorReason != null}
          errorMessage={mobileNumberErrorReason}
          onChange={this.onInputChange('mobileNumber')}
          placeholder={formatMessage({
            id: 'account.profile.form.mobile_number',
          })}
          placeholderHint={
            mobileNumber &&
            formatMessage({
              id: 'account.profile.form.mobile_number',
            })
          }
          defaultValue={mustBe(mobileNumber)}
          leadingNode={
            <span className={styles.countryCode}>{countryDialCode}</span>
          }
          isDisabled={updateProfileRequest.requesting}
        />
      </div>
    );
  };

  renderCurrencyField = () => {
    const { form: { defaultCurrency } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;
    const currencyErrorReason = this.state.errorReasons.defaultCurrency;

    return (
      <div className={cn(foundation['grid-x'], styles.formControl)}>
        <div className={cn(foundation['small-12'], foundation['medium-6'])}>
          <HTSelect
            inlineLabel={true}
            isError={currencyErrorReason != null}
            errorMessage={currencyErrorReason}
            onChange={this.onSelectChange('defaultCurrency')}
            placeholder={formatMessage({
              id: 'account.profile.form.default_currency',
            })}
            placeholderHint={formatMessage({
              id: 'account.profile.form.default_currency',
            })}
            options={CURRENCY_OPTIONS}
            defaultValue={mustBe(defaultCurrency)}
            isDisabled={updateProfileRequest.requesting}
          />
        </div>
      </div>
    );
  };

  renderPartnerCodeField = () => {
    const { form: { partnerCode } } = this.state;
    const {
      account: { updateProfileRequest },
      intl: { formatMessage },
    } = this.props;

    return (
      <div className={cn(foundation['grid-x'], styles.formControl)}>
        <div className={cn(foundation['small-12'], foundation['medium-6'])}>
          <HTTextInput
            inlineLabel={true}
            onChange={this.onInputChange('partnerCode')}
            placeholder={formatMessage({
              id: 'account.profile.form.partner_code',
            })}
            placeholderHint={
              partnerCode &&
              formatMessage({
                id: 'account.profile.form.partner_code',
              })
            }
            defaultValue={partnerCode || ''}
            isDisabled={updateProfileRequest.requesting}
          />
        </div>
      </div>
    );
  };

  onCancelClick = () => {
    this.props.push('/account');
  };

  onInputChange = (key: string) => (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    }));
  };

  onSelectChange = (key: string) => ({ value }: Option<string>) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    }));
  };

  validateForm = (): boolean => {
    const {
      form: {
        email,
        firstName,
        lastName,
        passportName,
        mobileNumber,
        defaultCurrency,
        countryOfResidence,
        salutation,
      },
    } = this.state;
    const { intl: { formatMessage } } = this.props;
    let isValid = true;
    let emailErrorReason: null | string = null;
    let firstNameErrorReason: null | string = null;
    let lastNameErrorReason: null | string = null;
    let passportNameErrorReason: null | string = null;
    let mobileNumberErrorReason: null | string = null;
    let countryOfResidenceErrorReason: null | string = null;
    let currencyErrorReason: null | string = null;
    let salutationErrorReason: null | string = null;

    const requiredError = formatMessage({ id: 'auth_modal.invalid.required' });

    if (email == null || email.length === 0) {
      isValid = false;
      emailErrorReason = requiredError;
    } else {
      if (validateEmailFormat(email)) {
        emailErrorReason = null;
      } else {
        isValid = false;
        emailErrorReason = formatMessage({
          id: 'auth_modal.invalid.email.email_format',
        });
      }
    }

    if (firstName == null || firstName.length === 0) {
      isValid = false;
      firstNameErrorReason = requiredError;
    } else {
      firstNameErrorReason = null;
    }

    if (lastName == null || lastName.length === 0) {
      isValid = false;
      lastNameErrorReason = requiredError;
    } else {
      lastNameErrorReason = null;
    }

    if (passportName == null || passportName.length === 0) {
      isValid = false;
      passportNameErrorReason = requiredError;
    } else {
      passportNameErrorReason = null;
    }

    if (mobileNumber == null || mobileNumber.length === 0) {
      isValid = false;
      mobileNumberErrorReason = requiredError;
    } else {
      if (!/^\d+$/.test(mobileNumber)) {
        isValid = false;
        mobileNumberErrorReason = formatMessage({
          id: 'auth.signup.mobile_numbber_contain_non_number',
        });
      } else {
        mobileNumberErrorReason = null;
      }
    }

    if (countryOfResidence == null || countryOfResidence.length === 0) {
      isValid = false;
      countryOfResidenceErrorReason = requiredError;
    } else {
      countryOfResidenceErrorReason = null;
    }

    if (defaultCurrency == null || defaultCurrency.length === 0) {
      isValid = false;
      currencyErrorReason = requiredError;
    } else {
      currencyErrorReason = null;
    }

    if (salutation == null || salutation.length === 0) {
      isValid = false;
      salutationErrorReason = requiredError;
    } else {
      salutationErrorReason = null;
    }

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        email: emailErrorReason,
        firstName: firstNameErrorReason,
        lastName: lastNameErrorReason,
        passportName: passportNameErrorReason,
        mobileNumber: mobileNumberErrorReason,
        countryOfResidence: countryOfResidenceErrorReason,
        salutation: salutationErrorReason,
        defaultCurrency: currencyErrorReason,
      },
    }));

    return isValid;
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const {
      form: {
        email,
        firstName,
        lastName,
        passportName,
        mobileNumber,
        defaultCurrency,
        countryOfResidence,
        salutation,
        partnerCode,
      },
    } = this.state;

    if (this.validateForm()) {
      this.props.updateProfile({
        ...this.props.user,
        email: mustBe(email),
        firstName: mustBe(firstName),
        lastName: mustBe(lastName),
        passportName: mustBe(passportName),
        mobileNumber: `${COUNTRY_DIAL_CODE[mustBe(countryOfResidence)]}${mustBe(
          mobileNumber
        )}`,
        defaultCurrency: mustBe(defaultCurrency),
        countryOfResidence: mustBe(countryOfResidence),
        salutation: mustBe(salutation),
        partnerCodeCode: partnerCode,
      });
    }
  };
}

export default injectIntl(UpdateProfileView);
