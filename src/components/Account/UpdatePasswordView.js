// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import cn from 'classnames';
import type { AccountState } from '../../states/account';
import foundation from '../../styles/foundation.scss';
import styles from './Account.scss';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTTextInput from '../HTForm/HTTextInput';
import { mustBe } from '../../utils/utils';
import { toastrError, toastrSuccess } from '../../utils/toastr';
import { validatePassword } from '../../utils/password';

type Props = {
  intl: IntlShape,
  push: string => void,
  account: AccountState,
  updatePassword: (string, string) => void,
};

type State = {
  form: {
    currentPassword: ?string,
    newPassword: ?string,
    confirmNewPassword: ?string,
  },
  errorReasons: {
    currentPassword: null | string,
    newPassword: null | string,
    confirmNewPassword: null | string,
  },
};

export class UpdatePasswordView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
      },
      errorReasons: {
        currentPassword: null,
        newPassword: null,
        confirmNewPassword: null,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.account.updatePasswordRequest.error;
    const nextError = nextProps.account.updatePasswordRequest.error;
    const thisRequesting = this.props.account.updatePasswordRequest.requesting;
    const nextRequesting = nextProps.account.updatePasswordRequest.requesting;
    const { intl: { formatMessage } } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(formatMessage({ id: 'account.update_password.success' }));
    }
  }

  render() {
    const {
      intl: { formatMessage },
      account: { updatePasswordRequest },
    } = this.props;
    const {
      form: { currentPassword, newPassword, confirmNewPassword },
    } = this.state;
    const currentPasswordErrorReason = this.state.errorReasons.currentPassword;
    const newPasswordErrorReason = this.state.errorReasons.newPassword;
    const confirmNewPasswordErrorReason = this.state.errorReasons
      .confirmNewPassword;

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
              <HTText translationKey={'account.update_password'} />
            </h2>
          </div>
        </section>

        <section className={cn(foundation['grid-container'], styles.account)}>
          <form className={styles.accountForm} onSubmit={this.onSubmit}>
            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(foundation['small-12'], foundation['medium-5'])}
              >
                <HTTextInput
                  type="password"
                  isError={currentPasswordErrorReason != null}
                  isDisabled={updatePasswordRequest.requesting}
                  errorMessage={currentPasswordErrorReason}
                  onChange={this.onInputChange('currentPassword')}
                  placeholder={formatMessage({
                    id: 'account.update_password.current_password',
                  })}
                  placeholderHint={
                    currentPassword
                      ? formatMessage({
                          id: 'account.update_password.current_password',
                        })
                      : undefined
                  }
                />
              </div>
            </div>

            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(foundation['small-12'], foundation['medium-5'])}
              >
                <HTTextInput
                  type="password"
                  isError={newPasswordErrorReason != null}
                  isDisabled={updatePasswordRequest.requesting}
                  errorMessage={newPasswordErrorReason}
                  onChange={this.onInputChange('newPassword')}
                  placeholder={formatMessage({
                    id: 'account.update_password.new_password',
                  })}
                  placeholderHint={
                    newPassword
                      ? formatMessage({
                          id: 'account.update_password.new_password',
                        })
                      : undefined
                  }
                />
              </div>
            </div>

            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(foundation['small-12'], foundation['medium-5'])}
              >
                <HTTextInput
                  type="password"
                  isError={confirmNewPasswordErrorReason != null}
                  isDisabled={updatePasswordRequest.requesting}
                  errorMessage={confirmNewPasswordErrorReason}
                  onChange={this.onInputChange('confirmNewPassword')}
                  placeholder={formatMessage({
                    id: 'account.update_password.confirm_new_password',
                  })}
                  placeholderHint={
                    confirmNewPassword
                      ? formatMessage({
                          id: 'account.update_password.confirm_new_password',
                        })
                      : undefined
                  }
                />
              </div>
            </div>

            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(
                  foundation['small-12'],
                  foundation['medium-8'],
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
                  isDisabled={updatePasswordRequest.requesting}
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }

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

  validateForm = (): boolean => {
    const {
      currentPassword,
      newPassword,
      confirmNewPassword,
    } = this.state.form;
    const { intl: { formatMessage } } = this.props;
    let isValid = true;
    let currentPasswordErrorReason: null | string = null;
    let newPasswordErrorReason: null | string = null;
    let confirmNewPasswordErrorReason: null | string = null;
    const requiredError = formatMessage({ id: 'auth_modal.invalid.required' });
    const passwordNotMatchError = formatMessage({
      id: 'account.update_password.invalid.password_not_match',
    });

    if (currentPassword == null || currentPassword.length === 0) {
      isValid = false;
      currentPasswordErrorReason = requiredError;
    } else {
      // add more password validation
      currentPasswordErrorReason = null;
    }

    if (newPassword == null || newPassword.length === 0) {
      isValid = false;
      newPasswordErrorReason = requiredError;
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        isValid = false;
        newPasswordErrorReason = formatMessage({ id: passwordError });
      } else {
        newPasswordErrorReason = null;
      }
    }

    if (confirmNewPassword == null || confirmNewPassword.length === 0) {
      isValid = false;
      confirmNewPasswordErrorReason = requiredError;
    } else {
      if (confirmNewPassword !== newPassword) {
        isValid = false;
        confirmNewPasswordErrorReason = passwordNotMatchError;
      } else {
        confirmNewPasswordErrorReason = null;
      }
    }

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        currentPassword: currentPasswordErrorReason,
        newPassword: newPasswordErrorReason,
        confirmNewPassword: confirmNewPasswordErrorReason,
      },
    }));

    return isValid;
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { currentPassword, newPassword } = this.state.form;

    if (this.validateForm()) {
      this.props.updatePassword(mustBe(currentPassword), mustBe(newPassword));
    }
  };
}

export default injectIntl(UpdatePasswordView);
