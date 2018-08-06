// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import styles from './SignupView.scss';
import type { UserInfo } from '../../models/UserInfo';
import foundation from '../../styles/foundation.scss';
import HTTextInput from '../HTForm/HTTextInput';
import HTSelect from '../HTForm/HTSelect';
import type { Option } from '../HTForm/HTSelect';
import HTButton from '../HTButton/HTButton';
import HintDropDown from '../HTForm/HintDropDown';
import HTText from '../HTText/HTText';
import HTCheckBox from '../HTForm/HTCheckBox';
import { mustBe } from '../../utils/utils';
import { validateEmailFormat } from '../../utils/stringUtil';
import type { IntlShape } from 'react-intl';
import { toastrError } from '../../utils/toastr';
import { validatePassword } from '../../utils/password';
import { COUNTRY_DIAL_CODE } from '../../utils/constants';
import {
  COUNTRY_OPTIONS,
  CURRENCY_OPTIONS,
  SALUTATION_OPTIONS,
} from '../../utils/options';
import { htmlLineBreak } from '../../utils/stringUtil';

type Fields = Array<
  | 'email'
  | 'password'
  | 'confirmPassword'
  | 'salutation'
  | 'firstName'
  | 'lastName'
  | 'passportName'
  | 'countryOfResidence'
  | 'mobileNumber'
  | 'currency'
  | 'partnerCode'
>;

type OptionalFields = {
  email?: string,
  password?: string,
  confirmPassword?: string,
  salutation?: string,
  firstName?: string,
  lastName?: string,
  passportName?: string,
  countryOfResidence?: string,
  mobileNumber?: string,
  currency?: string,
  partnerCode?: string,
};

type Props = {
  intl: IntlShape,
  isCompletingSignup?: boolean,
  signup?: (string, string, UserInfo) => void,
  completeSignup?: (string, UserInfo) => void,
  signupError: ?string,
  userId?: string,
  prefilledFields?: OptionalFields,
  excludedFields?: Fields,
};

type State = {
  form: {
    email: ?string,
    password: ?string,
    confirmPassword: ?string,
    firstName: ?string,
    lastName: ?string,
    passportName: ?string,
    mobileNumber: ?string,
    currency: ?string,
    salutation: ?string,
    countryOfResidence: ?string,
    partnerCode: ?string,
    receivePromotion: boolean,
    accept: ?boolean,
  },
  errorReasons: {
    email: null | string,
    password: null | string,
    confirmPassword: null | string,
    firstName: null | string,
    lastName: null | string,
    passportName: null | string,
    mobileNumber: null | string,
    currency: null | string,
    countryOfResidence: null | string,
    salutation: null | string,
    accept: null | string,
  },
};

class SignupView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { prefilledFields } = this.props;
    if (prefilledFields) {
      this.state = {
        form: {
          email: prefilledFields.email,
          password: prefilledFields.password,
          confirmPassword: null,
          firstName: prefilledFields.firstName,
          lastName: prefilledFields.lastName,
          passportName: prefilledFields.passportName,
          mobileNumber: prefilledFields.mobileNumber,
          partnerCode: prefilledFields.partnerCode,
          currency: prefilledFields.currency,
          countryOfResidence: prefilledFields.countryOfResidence,
          salutation: prefilledFields.salutation,
          receivePromotion: false,
          accept: false,
        },
        errorReasons: {
          email: null,
          password: null,
          confirmPassword: null,
          firstName: null,
          lastName: null,
          passportName: null,
          mobileNumber: null,
          currency: null,
          countryOfResidence: null,
          salutation: null,
          accept: null,
        },
      };
      return;
    }
    this.state = {
      form: {
        email: null,
        password: null,
        confirmPassword: null,
        firstName: null,
        lastName: null,
        passportName: null,
        mobileNumber: null,
        partnerCode: null,
        currency: null,
        countryOfResidence: null,
        salutation: null,
        receivePromotion: true,
        accept: false,
      },
      errorReasons: {
        email: null,
        password: null,
        confirmPassword: null,
        firstName: null,
        lastName: null,
        passportName: null,
        mobileNumber: null,
        currency: null,
        countryOfResidence: null,
        salutation: null,
        accept: null,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisSignupError = this.props.signupError;
    const nextSignupError = nextProps.signupError;
    const { intl: { formatMessage } } = this.props;
    if (thisSignupError == null && nextSignupError != null) {
      const error = nextSignupError;
      toastrError(formatMessage({ id: error }));
    }
  }

  onEmailChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        email: value,
      },
    }));
  };

  onPasswordChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        password: value,
      },
    }));
  };

  onConfirmPasswordChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        confirmPassword: value,
      },
    }));
  };

  onFirstNameChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        firstName: value,
      },
    }));
  };

  onLastNameChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        lastName: value,
      },
    }));
  };

  onPassportNameChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        passportName: value,
      },
    }));
  };

  onCurrencyChange = ({ value }: Option<string>) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        currency: value,
      },
    }));
  };

  onSalutationChange = ({ value }: Option<string>) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        salutation: value,
      },
    }));
  };

  onCountryOfResidenceChange = ({ value }: Option<string>) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        countryOfResidence: value,
      },
    }));
  };
  onMobileNumberChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        mobileNumber: value,
      },
    }));
  };

  onPartnerCodeChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        partnerCode: value,
      },
    }));
  };

  onCheckBoxChange = (key: string) => (checked: boolean) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        [key]: checked,
      },
    }));
  };

  validateForm = (): boolean => {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      passportName,
      mobileNumber,
      currency,
      countryOfResidence,
      salutation,
      receivePromotion,
      accept,
    } = this.state.form;
    const { excludedFields, intl: { formatMessage } } = this.props;
    let isValid = true;
    let emailErrorReason: null | string = null;
    let passwordErrorReason: null | string = null;
    let confirmPasswordErrorReason: null | string = null;
    let firstNameErrorReason: null | string = null;
    let lastNameErrorReason: null | string = null;
    let passportNameErrorReason: null | string = null;
    let mobileNumberErrorReason: null | string = null;
    let countryOfResidenceErrorReason: null | string = null;
    let currencyErrorReason: null | string = null;
    let salutationErrorReason: null | string = null;
    let receivePromotionErrorReason: null | 'signup.accept_email.error' = null;
    let acceptErrorReason: null | 'signup.accept.error' = null;

    const excludedFields_ = excludedFields || [];

    const requiredError = formatMessage({ id: 'auth_modal.invalid.required' });
    if (excludedFields_.indexOf('email') < 0) {
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
    }

    if (excludedFields_.indexOf('password') < 0) {
      if (password == null || password.length === 0) {
        isValid = false;
        passwordErrorReason = requiredError;
      } else {
        const passwordError = validatePassword(password);
        if (passwordError) {
          isValid = false;
          passwordErrorReason = formatMessage({ id: passwordError });
        } else {
          passwordErrorReason = null;
        }
      }
    }

    if (excludedFields_.indexOf('confirmPassword') < 0) {
      if (confirmPassword == null || confirmPassword.length === 0) {
        isValid = false;
        confirmPasswordErrorReason = requiredError;
      } else {
        if (password !== confirmPassword) {
          isValid = false;
          confirmPasswordErrorReason = formatMessage({
            id: 'signup.form.password_not_match',
          });
        } else {
          confirmPasswordErrorReason = null;
        }
      }
    }

    if (excludedFields_.indexOf('firstName') < 0) {
      if (firstName == null || firstName.length === 0) {
        isValid = false;
        firstNameErrorReason = requiredError;
      } else {
        firstNameErrorReason = null;
      }
    }

    if (excludedFields_.indexOf('lastName') < 0) {
      if (lastName == null || lastName.length === 0) {
        isValid = false;
        lastNameErrorReason = requiredError;
      } else {
        lastNameErrorReason = null;
      }
    }

    if (excludedFields_.indexOf('passportName') < 0) {
      if (passportName == null || passportName.length === 0) {
        isValid = false;
        passportNameErrorReason = requiredError;
      } else {
        passportNameErrorReason = null;
      }
    }

    if (excludedFields_.indexOf('mobileNumber') < 0) {
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
    }

    if (excludedFields_.indexOf('countryOfResidence') < 0) {
      if (countryOfResidence == null || countryOfResidence.length === 0) {
        isValid = false;
        countryOfResidenceErrorReason = requiredError;
      } else {
        countryOfResidenceErrorReason = null;
      }
    }

    if (excludedFields_.indexOf('currency') < 0) {
      if (currency == null || currency.length === 0) {
        isValid = false;
        currencyErrorReason = requiredError;
      } else {
        currencyErrorReason = null;
      }
    }

    if (excludedFields_.indexOf('salutation') < 0) {
      if (salutation == null || salutation.length === 0) {
        isValid = false;
        salutationErrorReason = requiredError;
      } else {
        salutationErrorReason = null;
      }
    }

    if (!receivePromotion) {
      isValid = false;
      receivePromotionErrorReason = 'signup.accept_email.error';
      toastrError(
        formatMessage({
          id: receivePromotionErrorReason,
        })
      );
    } else {
      receivePromotionErrorReason = null;
    }

    if (!accept) {
      isValid = false;
      acceptErrorReason = `signup.accept.error`;
      toastrError(
        formatMessage({
          id: acceptErrorReason,
        })
      );
    } else {
      acceptErrorReason = null;
    }

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        email: emailErrorReason,
        password: passwordErrorReason,
        confirmPassword: confirmPasswordErrorReason,
        firstName: firstNameErrorReason,
        lastName: lastNameErrorReason,
        passportName: passportNameErrorReason,
        mobileNumber: mobileNumberErrorReason,
        countryOfResidence: countryOfResidenceErrorReason,
        salutation: salutationErrorReason,
        currency: currencyErrorReason,
        accept: acceptErrorReason,
      },
    }));

    return isValid;
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();
    // comment for now
    const {
      firstName,
      lastName,
      email,
      password,
      passportName,
      mobileNumber,
      partnerCode,
      currency,
      salutation,
      countryOfResidence,
      receivePromotion,
    } = this.state.form;
    if (this.validateForm()) {
      const userInfo: UserInfo = {
        email: mustBe(email),
        passportName: mustBe(passportName),
        firstName: mustBe(firstName),
        lastName: mustBe(lastName),
        mobileNumber: `${COUNTRY_DIAL_CODE[mustBe(countryOfResidence)]}${mustBe(
          mobileNumber
        )}`,
        defaultCurrency: mustBe(currency),
        salutation: mustBe(salutation),
        countryOfResidence: mustBe(countryOfResidence),
        receivePromotion,
        partnerCode,
      };
      const { isCompletingSignup, completeSignup, signup } = this.props;
      if (isCompletingSignup) {
        if (completeSignup !== undefined) {
          completeSignup(mustBe(this.props.userId), userInfo);
        }
      } else {
        if (signup !== undefined) {
          signup(mustBe(email), mustBe(password), userInfo);
        }
      }
    }
  };

  renderSalutationField = () => {
    const { excludedFields, intl: { formatMessage } } = this.props;
    const {
      form: { salutation },
      errorReasons: { salutation: salutationErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('salutation') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(foundation['small-12'], foundation['medium-6'])}
        >
          <HTSelect
            isError={salutationErrorReason != null}
            errorMessage={salutationErrorReason}
            onChange={this.onSalutationChange}
            placeholder={formatMessage({ id: 'signup.form.salutation' })}
            placeholderHint={
              salutation ? formatMessage({ id: 'signup.form.salutation' }) : ''
            }
            options={SALUTATION_OPTIONS}
          />
        </div>
      </div>
    );
  };

  renderFirstNameField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { firstName },
      errorReasons: { firstName: firstNameErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('firstName') >= 0) {
      return null;
    }

    return (
      <div
        className={classNames(foundation['small-12'], foundation['medium-6'])}
      >
        <HTTextInput
          isError={firstNameErrorReason != null}
          errorMessage={firstNameErrorReason}
          onChange={this.onFirstNameChange}
          placeholder={formatMessage({ id: 'signup.form.first_name' })}
          placeholderHint={
            firstName && formatMessage({ id: 'signup.form.first_name' })
          }
          defaultValue={prefilledFields ? prefilledFields.firstName : ''}
        />
      </div>
    );
  };

  renderLastNameField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { lastName },
      errorReasons: { lastName: lastNameErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('lastName') >= 0) {
      return null;
    }

    return (
      <div
        className={classNames(foundation['small-12'], foundation['medium-6'])}
      >
        <HTTextInput
          isError={lastNameErrorReason != null}
          errorMessage={lastNameErrorReason}
          onChange={this.onLastNameChange}
          placeholder={formatMessage({ id: 'signup.form.last_name' })}
          placeholderHint={
            lastName && formatMessage({ id: 'signup.form.last_name' })
          }
          defaultValue={prefilledFields ? prefilledFields.lastName : ''}
        />
      </div>
    );
  };

  renderPassportNameField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { passportName },
      errorReasons: { passportName: passportNameErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('passportName') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(
            foundation['small-12'],
            foundation['medium-12']
          )}
        >
          <HTTextInput
            isError={passportNameErrorReason != null}
            errorMessage={passportNameErrorReason}
            onChange={this.onPassportNameChange}
            placeholder={formatMessage({ id: 'signup.form.passport' })}
            placeholderHint={
              passportName && formatMessage({ id: 'signup.form.passport' })
            }
            trailingNode={
              <HintDropDown
                hint={formatMessage({ id: 'signup.form.passport.hint' })}
                align="right"
              />
            }
            defaultValue={prefilledFields ? prefilledFields.passportName : ''}
          />
        </div>
      </div>
    );
  };

  renderEmailField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { email },
      errorReasons: { email: emailErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('email') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(
            foundation['small-12'],
            foundation['medium-12']
          )}
        >
          <HTTextInput
            isError={emailErrorReason != null}
            errorMessage={emailErrorReason}
            placeholder={formatMessage({
              id: 'signup.form.email_address',
            })}
            placeholderHint={
              email &&
              formatMessage({
                id: 'signup.form.email_address',
              })
            }
            onChange={this.onEmailChange}
            defaultValue={prefilledFields ? prefilledFields.email : ''}
          />
        </div>
      </div>
    );
  };

  renderPasswordField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { password },
      errorReasons: { password: passwordErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('password') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(
            foundation['small-12'],
            foundation['medium-12']
          )}
        >
          <HTTextInput
            type="password"
            isError={passwordErrorReason != null}
            errorMessage={passwordErrorReason}
            onChange={this.onPasswordChange}
            placeholder={formatMessage({ id: 'signup.form.password' })}
            placeholderHint={
              password && formatMessage({ id: 'signup.form.password' })
            }
            defaultValue={prefilledFields ? prefilledFields.password : ''}
          />
        </div>
      </div>
    );
  };

  renderConfirmPasswordField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { confirmPassword },
      errorReasons: { confirmPassword: confirmPasswordErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('confirmPassword') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(
            foundation['small-12'],
            foundation['medium-12']
          )}
        >
          <HTTextInput
            type="password"
            isError={confirmPasswordErrorReason != null}
            errorMessage={confirmPasswordErrorReason}
            onChange={this.onConfirmPasswordChange}
            placeholder={formatMessage({ id: 'signup.form.confirm_password' })}
            placeholderHint={
              confirmPassword &&
              formatMessage({ id: 'signup.form.confirm_password' })
            }
            defaultValue={
              prefilledFields ? prefilledFields.confirmPassword : ''
            }
          />
        </div>
      </div>
    );
  };

  renderCountryOfResidenceField = () => {
    const { excludedFields, intl: { formatMessage } } = this.props;
    const {
      form: { countryOfResidence },
      errorReasons: { countryOfResidence: countryOfResidenceErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('countryOfResidence') >= 0) {
      return null;
    }

    return (
      <div
        className={classNames(foundation['small-12'], foundation['medium-6'])}
      >
        <HTSelect
          isError={countryOfResidenceErrorReason != null}
          errorMessage={countryOfResidenceErrorReason}
          onChange={this.onCountryOfResidenceChange}
          searchable={true}
          placeholder={formatMessage({
            id: 'signup.form.country_of_residence',
          })}
          placeholderHint={
            countryOfResidence
              ? formatMessage({
                  id: 'signup.form.country_of_residence',
                })
              : ''
          }
          options={COUNTRY_OPTIONS}
        />
      </div>
    );
  };

  renderMobileNumberField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const {
      form: { mobileNumber, countryOfResidence },
      errorReasons: { mobileNumber: mobileNumberErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('mobileNumber') >= 0) {
      return null;
    }

    return (
      <div
        className={classNames(
          foundation['small-12'],
          foundation['medium-6'],
          styles.mobileNumber
        )}
      >
        <HTTextInput
          isError={mobileNumberErrorReason != null}
          errorMessage={mobileNumberErrorReason}
          onChange={this.onMobileNumberChange}
          placeholder={formatMessage({
            id: 'signup.form.mobile_number',
          })}
          placeholderHint={
            mobileNumber &&
            formatMessage({
              id: 'signup.form.mobile_number',
            })
          }
          leadingNode={
            <span className={styles.countryCode}>
              {countryOfResidence && COUNTRY_DIAL_CODE[countryOfResidence]}
            </span>
          }
          defaultValue={prefilledFields ? prefilledFields.mobileNumber : ''}
        />
      </div>
    );
  };

  renderCurrencyField = () => {
    const { excludedFields, intl: { formatMessage } } = this.props;
    const {
      form: { currency },
      errorReasons: { currency: currencyErrorReason },
    } = this.state;

    if (excludedFields && excludedFields.indexOf('currency') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(foundation['small-12'], foundation['medium-6'])}
        >
          <HTSelect
            isError={currencyErrorReason != null}
            errorMessage={currencyErrorReason}
            onChange={this.onCurrencyChange}
            placeholder={formatMessage({
              id: 'signup.form.default_currency',
            })}
            placeholderHint={
              currency
                ? formatMessage({
                    id: 'signup.form.default_currency',
                  })
                : ''
            }
            options={CURRENCY_OPTIONS}
          />
        </div>
      </div>
    );
  };

  renderPartnerCodeField = () => {
    const {
      excludedFields,
      prefilledFields,
      intl: { formatMessage },
    } = this.props;
    const { form: { partnerCode } } = this.state;

    if (excludedFields && excludedFields.indexOf('partnerCode') >= 0) {
      return null;
    }

    return (
      <div className={classNames(foundation['grid-x'], styles.formControl)}>
        <div
          className={classNames(foundation['small-12'], foundation['medium-6'])}
        >
          <HTTextInput
            onChange={this.onPartnerCodeChange}
            placeholder={formatMessage({
              id: 'signup.form.partner_code',
            })}
            placeholderHint={
              partnerCode &&
              formatMessage({
                id: 'signup.form.partner_code',
              })
            }
            defaultValue={prefilledFields ? prefilledFields.partnerCode : ''}
          />
        </div>
      </div>
    );
  };

  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className={classNames(styles.content, foundation['grid-container'])}>
        <section className={styles.titleSection}>
          <div className={styles.title}>
            <HTText translationKey={'signup.title'} />
          </div>
          <div className={styles.subtitle}>
            <HTText translationKey={'signup.subtitle'} />
          </div>
        </section>
        <section className={styles.formSection}>
          <form>
            {this.renderSalutationField()}
            <div
              className={classNames(foundation['grid-x'], styles.formControl)}
            >
              {this.renderFirstNameField()}
              {this.renderLastNameField()}
            </div>
            {this.renderPassportNameField()}
            {this.renderEmailField()}
            {this.renderPasswordField()}
            {this.renderConfirmPasswordField()}
            <div
              className={classNames(foundation['grid-x'], styles.formControl)}
            >
              {this.renderCountryOfResidenceField()}
              {this.renderMobileNumberField()}
            </div>
            {this.renderCurrencyField()}
            {this.renderPartnerCodeField()}

            <div className={styles.formControl}>
              <label className={styles.checkboxLabel}>
                <HTCheckBox
                  id="accept_terms"
                  onChange={this.onCheckBoxChange('accept')}
                />
                <span className={styles.checkboxText}>
                  <HTText
                    translationKey="signup.form.accept_terms"
                    values={{
                      tnc: (
                        <a href="/tnc" target="_blank" className={styles.link}>
                          <HTText translationKey="footer.tnc" />
                        </a>
                      ),
                      pp: (
                        <a
                          href="/privacy-policy"
                          target="_blank"
                          className={styles.link}
                        >
                          <HTText translationKey="footer.privacy_policy" />
                        </a>
                      ),
                    }}
                  />
                </span>
              </label>
            </div>

            <div className={styles.formControl}>
              <label className={styles.checkboxLabel}>
                <HTCheckBox
                  id="accept_promotion"
                  value={this.state.form.receivePromotion}
                  onChange={this.onCheckBoxChange('receivePromotion')}
                />
                <span className={styles.checkboxText}>
                  {htmlLineBreak(
                    formatMessage({ id: 'signup.form.accept_promotion' })
                  )}
                </span>
              </label>
            </div>

            <div
              className={classNames(foundation['grid-x'], styles.formControl)}
            >
              <div
                className={classNames(
                  foundation['small-12'],
                  foundation['medium-8']
                )}
              >
                <HTButton
                  type={'submit'}
                  buttonType={'green'}
                  onClick={this.onSubmit}
                  text={formatMessage({ id: 'signup.register_account' })}
                  className={styles.button}
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }
}

export default injectIntl(SignupView);
