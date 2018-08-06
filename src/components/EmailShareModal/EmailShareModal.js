// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import type { IntlShape } from 'react-intl';
import type { Tag } from '../HTForm/HTTagInput';

import styles from './EmailShareModal.scss';
import closeIcon from '../../images/ic_close.svg';
import HTModal from '../HTModal/HTModal';
import HTTagInput from '../HTForm/HTTagInput';
import HTButton from '../HTButton/HTButton';
import { validateEmailFormat } from '../../utils/stringUtil';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  closeModal: () => void,
  title: string,
  onSend: (emails: string[], message: string) => void,
  prefilledEmails?: string[],
};

type State = {
  inputEmail: string,
  emails: string[],
  message: string,
  errorReason: {
    emails: ?string,
  },
};

class EmailShareModal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      inputEmail: '',
      emails: this.props.prefilledEmails || [],
      message: '',
      errorReason: {
        emails: null,
      },
    };
  }

  closeModal = () => {
    this.setState(
      {
        emails: this.props.prefilledEmails || [],
        message: '',
        errorReason: {
          emails: null,
        },
      },
      () => this.props.closeModal()
    );
  };

  onEmailAddition = (tag: Tag) => {
    this.setState((state: State) => {
      return {
        emails: [...state.emails, tag.text],
        inputEmail: '',
      };
    });
  };

  onEmailDelete = (index: number) => {
    this.setState((state: State) => {
      const newEmails = [...state.emails];
      newEmails.splice(index, 1);
      return {
        emails: newEmails,
      };
    });
  };

  onMessageChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ message: e.target.value });
  };

  emailsToTags = (emails: string[]): Tag[] => {
    return emails.map((email: string) => {
      return {
        id: email,
        text: email,
      };
    });
  };

  onSend = () => {
    const { emails, message, inputEmail } = this.state;

    if (emails.length === 0 && !inputEmail) {
      return;
    }

    if (!this.validateEmail()) {
      return;
    }

    if (inputEmail) {
      const newEmails = [...emails, inputEmail];
      this.props.onSend(newEmails, message);
      return;
    }

    this.props.onSend(emails, message);
  };

  onInputChange = (value: string) => {
    this.setState({ inputEmail: value });
  };

  validateEmail = () => {
    const { emails, inputEmail } = this.state;
    const emails_ = [...emails];
    if (inputEmail) {
      emails_.push(inputEmail);
    }
    const isValid = validateEmails(emails_);

    if (!isValid) {
      this.setState((state: State) => {
        return {
          errorReason: {
            ...state.errorReason,
            emails: 'email_share_modal.invalid.email',
          },
        };
      });
    } else {
      this.setState((state: State) => {
        return {
          errorReason: {
            ...state.errorReason,
            emails: null,
          },
        };
      });
    }
    return isValid;
  };

  render() {
    const { intl: { formatMessage }, isOpen, title } = this.props;
    const {
      inputEmail,
      emails,
      message,
      errorReason: { emails: emailsError },
    } = this.state;

    return (
      <HTModal
        className={styles.emailShareModal}
        isOpen={isOpen}
        onRequestClose={this.closeModal}
      >
        <div className={styles.emailShareModalWrapper}>
          <section className={styles.modalHeader}>
            <span className={styles.title}>{title}</span>
            <button
              onClick={this.closeModal}
              className={styles.closeIconContainer}
            >
              <img
                alt={formatMessage({ id: 'image.modal.close' })}
                src={closeIcon}
                className={styles.closeIcon}
              />
            </button>
          </section>
          <section className={styles.content}>
            <HTTagInput
              placeHolder={formatMessage({
                id: 'email_share_modal.email_address',
              })}
              tags={this.emailsToTags(emails)}
              onDelete={this.onEmailDelete}
              onAddition={this.onEmailAddition}
              onInputChange={this.onInputChange}
              error={emailsError && formatMessage({ id: emailsError })}
            />
            <textarea
              className={styles.messageArea}
              placeholder={formatMessage({
                id: 'email_share_modal.message_area',
              })}
              value={message}
              onChange={this.onMessageChange}
            />
            <HTButton
              className={styles.button}
              buttonType="green"
              text={formatMessage({ id: 'email_share_modal.send' })}
              onClick={this.onSend}
              isDisabled={emails.length === 0 && !inputEmail}
            />
            <HTButton
              className={styles.button}
              buttonType="white"
              text={formatMessage({ id: 'email_share_modal.cancel' })}
              onClick={this.closeModal}
            />
          </section>
        </div>
      </HTModal>
    );
  }
}

function validateEmails(emails: string[]): boolean {
  for (let i = 0; i < emails.length; ++i) {
    const email = emails[i];
    if (!(email && validateEmailFormat(email))) {
      return false;
    }
  }

  return true;
}

export default injectIntl(EmailShareModal);
