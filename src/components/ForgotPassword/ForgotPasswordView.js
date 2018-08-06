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
import { validateEmailFormat } from '../../utils/stringUtil';
import { toastrError, toastrSuccess } from '../../utils/toastr';

type Props = {
  intl: IntlShape,
  forgotPasswordRequest: Request,
  forgotPassword: string => void,
  push: string => void,
};

type State = {
  form: {
    email: string,
  },
  errorReasons: {
    email: null | string,
  },
};

class ForgotPasswordView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      form: {
        email: '',
      },
      errorReasons: {
        email: null,
      },
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.forgotPasswordRequest.error;
    const nextError = nextProps.forgotPasswordRequest.error;
    const thisRequesting = this.props.forgotPasswordRequest.requesting;
    const nextRequesting = nextProps.forgotPasswordRequest.requesting;
    const { intl: { formatMessage }, push } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(formatMessage({ id: 'auth.forgot_password.email.sent' }));
      push('/');
    }
  }

  render() {
    const {
      intl: { formatMessage },
      forgotPasswordRequest: { requesting },
    } = this.props;
    const { email } = this.state.form;
    const emailErrorReason = this.state.errorReasons.email;

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
              <HTText translationKey={'auth.forgot_password'} />
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
              <div className={cn(foundation['small-12'], styles.notice)}>
                <HTText translationKey={'auth.forgot_password.notice'} />
              </div>
              <div
                className={cn(foundation['small-12'], foundation['medium-8'])}
              >
                <HTTextInput
                  isError={emailErrorReason != null}
                  errorMessage={emailErrorReason}
                  onChange={this.onEmailChange}
                  placeholder={formatMessage({
                    id: 'auth.forgot_password.email',
                  })}
                  value={email}
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
                  buttonType={'gray'}
                  text={formatMessage({ id: 'auth.forgot_password.back' })}
                  className={styles.button}
                  onClick={this.onBackClick}
                  isDisabled={requesting}
                />
                <HTButton
                  type={'submit'}
                  buttonType={'green'}
                  text={formatMessage({ id: 'auth.forgot_password.send' })}
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

  onBackClick = () => {
    const { push } = this.props;
    push('/');
  };

  onEmailChange = (value: string) => {
    this.setState((state: State) => ({
      form: {
        ...state.form,
        email: value,
      },
    }));
  };

  validateForm = (): boolean => {
    const { email } = this.state.form;
    const { intl: { formatMessage } } = this.props;
    let isValid = true;
    let emailErrorReason: null | string = null;
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

    this.setState((state: State) => ({
      errorReasons: {
        ...state.errorReasons,
        email: emailErrorReason,
      },
    }));

    return isValid;
  };

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { email } = this.state.form;
    const { forgotPassword } = this.props;

    if (this.validateForm()) {
      forgotPassword(email);
    }
  };
}

export default injectIntl(ForgotPasswordView);
