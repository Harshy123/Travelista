// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import styles from './BrowserWarningModal.scss';
import HTModal from '../HTModal/HTModal';
import HTButton from '../HTButton/HTButton';
import HTText from '../HTText/HTText';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  closeModal: () => void,
};

class BrowserWarningModal extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage }, isOpen, closeModal } = this.props;

    return (
      <HTModal
        className={styles.modal}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <div className={styles.modalWrapper}>
          <section className={styles.content}>
            <HTText translationKey="browser.warning.not_supported" />
          </section>
          <div className={styles.buttonWrapper}>
            <HTButton
              className={styles.button}
              contentClassName={styles.buttonContent}
              buttonType="green"
              text={formatMessage({
                id: 'browser.warning.ok',
              })}
              onClick={closeModal}
            />
          </div>
        </div>
      </HTModal>
    );
  }
}

export default injectIntl(BrowserWarningModal);
