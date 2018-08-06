// @flow

import React, { PureComponent } from 'react';
import HTText from '../HTText/HTText';
import apiClient from '../../api';

import type { User } from '../../models/User';

import styles from './VerifyRemindToastrMessage.scss';

type Props = {
  user: User,
};

type State = {
  sendState: ?('sending' | 'sent' | 'error'),
};

export default class VerifyRemindToastr extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      sendState: null,
    };
  }

  defaultMessage() {
    return (
      <span>
        <HTText translationKey={'toastr.verify_email.message'} />
        <span className={styles.callForAction}>
          <HTText translationKey={'toastr.verify_email.resend_message'} />
          <button onClick={this.onClickResend}>
            <HTText translationKey={'toastr.verify_email.resend_button'} />
          </button>
        </span>
      </span>
    );
  }

  sendingMessage() {
    return <HTText translationKey="toastr.verify_email.sending" />;
  }

  sentMessage() {
    return <HTText translationKey="toastr.verify_email.sent" />;
  }

  errorMessage() {
    return <HTText translationKey="toastr.verify_email.error" />;
  }

  render() {
    const { sendState } = this.state;
    let message = null;
    switch (sendState) {
      case 'sending':
        message = this.defaultMessage();
        break;
      case 'sent':
        message = this.sentMessage();
        break;
      case 'error':
        message = this.errorMessage();
        break;
      default:
        message = this.defaultMessage();
    }
    return (
      <span className={styles.message} id="verify-email-msg">
        {message}
      </span>
    );
  }

  onClickResend = () => {
    this.setState({ sendState: 'sending' });
    apiClient
      .resendVerificationEmail()
      .then(() => this.setState({ sendState: 'sent' }))
      .catch(() => this.setState({ sendState: 'error' }));
  };
}
