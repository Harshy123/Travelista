// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import closeIcon from '../../images/ic_close_thin.svg';
import facebookShareIcon from '../../images/ic_share_facebook.svg';
import emailShareIcon from '../../images/ic_share_email.svg';

import HTModal from '../HTModal/HTModal';

import styles from './ShareModal.scss';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  facebookShareLink: string,
  isOpen: boolean,
  onClose: () => void,
  onShareToEmailClick: () => void,
};

type State = {
  isEmailShareModalOpened: boolean,
};

class ShareModal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEmailShareModalOpened: false,
    };
  }

  render() {
    const { intl: { formatMessage }, isOpen } = this.props;

    return (
      <HTModal isOpen={isOpen} onRequestClose={this.handleRequestClose}>
        <div className={styles.container}>
          <button
            className={styles.closeButton}
            onClick={this.handleCloseButtonClick}
          >
            <img
              src={closeIcon}
              width={24}
              height={24}
              alt={formatMessage({ id: 'image.modal.close' })}
            />
          </button>
          <h1 className={styles.header}>
            {formatMessage({ id: 'share_modal.title' })}
          </h1>
          <ul className={styles.shareList}>
            <li className={styles.shareListItem}>
              <button
                className={styles.shareButton}
                onClick={this.handleFacebookShareClick}
              >
                <img
                  src={facebookShareIcon}
                  width={56}
                  height={56}
                  alt=""
                  className={styles.shareButtonIcon}
                />
                {formatMessage({ id: 'share_modal.share_on_facebook' })}
              </button>
            </li>
            <li className={styles.shareListItem}>
              <button
                className={styles.shareButton}
                onClick={this.handleEmailShareClick}
              >
                <img
                  src={emailShareIcon}
                  width={56}
                  height={56}
                  alt=""
                  className={styles.shareButtonIcon}
                />
                {formatMessage({ id: 'share_modal.share_on_email' })}
              </button>
            </li>
          </ul>
        </div>
      </HTModal>
    );
  }

  handleCloseButtonClick = () => {
    this.props.onClose();
  };

  handleRequestClose = () => {
    this.props.onClose();
  };

  handleFacebookShareClick = () => {
    const { facebookShareLink, onClose } = this.props;

    FB.ui(
      {
        method: 'share',
        href: facebookShareLink,
      },
      // eslint-disable-next-line flowtype/no-weak-types
      (response: any) => {
        // facebook returns an empty array if the user shared successfully
        if (Array.isArray(response) && response.length === 0) {
          onClose();
        }

        // user might have cancelled / failed to do the share

        // eslint-disable-next-line no-console
        console.log('Facebook share response', response);
      }
    );
  };

  handleEmailShareClick = () => {
    this.props.onShareToEmailClick();
  };
}

export default injectIntl(ShareModal);
