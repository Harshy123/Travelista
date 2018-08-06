// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import type { Request } from '../../types/index';
import cn from 'classnames';
import foundation from '../../styles/foundation.scss';
import styles from './ForgotPassword.scss';
import HTText from '../HTText/HTText';
import HTTextInput from '../HTForm/HTTextInput';
import HTButton from '../HTButton/HTButton';
import { toastrError, toastrSuccess } from '../../utils/toastr';

type Props = {
  intl: IntlShape,
  resetPasswordRequest: Request,
  resetPasswordInfo: {
    userID: string,
    code: string,
    expireAt: number,
  },
  resetPassword: (string, string, number, string) => void,
  push: string => void,
};

type State = {
  form: {
    newPassword: string,
    confirmNewPassword: string,
  },
  errorReasons: {
    newPassword: null | string,
    confirmNewPassword: null | string,
  },
};

class ResetPasswordView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        newPassword: '',
        confirmNewPassword: '',
      },
      errorReasons: {
        newPassword: null,
        confirmNewPassword: null,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.resetPasswordRequest.error;
    const nextError = nextProps.resetPasswordRequest.error;
    const thisRequesting = this.props.resetPasswordRequest.requesting;
    const nextRequesting = nextProps.resetPasswordRequest.requesting;
    const { intl: { formatMessage } } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(formatMessage({ id: 'auth.reset_password.success' }));
    }
  }

  render() {
    const {
      intl: { formatMessage },
      resetPasswordRequest: { requesting },
    } = this.props;
    const { newPassword, confirmNewPassword } = this.state.form;
    const newPasswordErrorReason = this.state.errorReasons.newPassword;
    const confirmNewPasswordErrorReason = this.state.errorReasons
      .confirmNewPassword;

    return (
      <div>
        <section className={styles.passwordHeader}>
          <div
            className={cn(
              foundation['grid-container'],
              styles.passwordHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'auth.reset_password'} />
            </h2>
          </div>
        </section>

        <section
          className={cn(foundation['grid-container'], {
            [styles.isDisabled]: requesting,
          })}
        >
          <form className={styles.passwordForm} onSubmit={this.onSubmit}>
            <div className={cn(foundation['grid-x'], styles.formControl)}>
              <div
                className={cn(foundation['small-12'], foundation['medium-8'])}
              >
                <HTTextInput
                  type="password"
                  isError={newPasswordErrorReason != null}
                  errorMessage={newPasswordErrorReason}
                  onChange={this.onInputChange('newPassword')}
                  placeholder={formatMessage({
                    id: 'auth.reset_password.new_password',
                  })}
                  value={newPassword}
                  isDisabled={requesting}
                />
              </div>
              <div
                className={cn(foundation['small-12'], foundation['medium-8'])}
              >
                <HTTextInput
                  type="password"
                  isError={confirmNewPasswordErrorReason != null}
                  errorMessage={confirmNewPasswordErrorReason}
                  onChange={this.onInputChange('confirmNewPassword')}
                  placeholder={formatMessage({
                    id: 'auth.reset_password.confirm_new_password',
                  })}
                  value={confirmNewPassword}
                  isDisabled={requesting}
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
                  type={'submit'}
                  buttonType={'green'}
                  text={formatMessage({ id: 'auth.reset_password.confirm' })}
                  className={styles.button}
                  isDisabled={requesting}
                />
              </div>
            </div>
          </form>
        </section>
      </div>
    );
  }

  onInputChange = (key: string) => (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    }));
  };

  validateForm = (): boolean => {
    const { newPassword, confirmNewPassword } = this.state.form;
    const { intl: { formatMessage } } = this.props;
    let isValid = true;
    let newPasswordErrorReason: null | string = null;
    let confirmNewPasswordErrorReason: null | string = null;
    const requiredError = formatMessage({ id: 'auth_modal.invalid.required' });
    const passwordNotMatchError = formatMessage({
      id: 'auth.reset_password.invalid.password_not_match',
    });
    const passwordTooShortError = formatMessage({
      id: 'auth.reset_password.invalid.password_length',
    });

    if (newPassword == null || newPassword.length === 0) {
      isValid = false;
      newPasswordErrorReason = requiredError;
    } else {
      if (newPassword && newPassword.length < 8) {
        isValid = false;
        newPasswordErrorReason = passwordTooShortError;
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
        if (confirmNewPassword && confirmNewPassword.length < 8) {
          isValid = false;
          confirmNewPasswordErrorReason = passwordTooShortError;
        } else {
          confirmNewPasswordErrorReason = null;
        }
      }
    }

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        newPassword: newPasswordErrorReason,
        confirmNewPassword: confirmNewPasswordErrorReason,
      },
    }));

    return isValid;
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { newPassword } = this.state.form;
    const {
      resetPassword,
      resetPasswordInfo: { userID, code, expireAt },
    } = this.props;

    if (this.validateForm()) {
      resetPassword(userID, code, expireAt, newPassword);
    }
  };
}

export default injectIntl(ResetPasswordView);
