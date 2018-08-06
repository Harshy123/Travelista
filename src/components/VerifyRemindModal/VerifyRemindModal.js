// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import styles from './VerifyRemindModal.scss';
import closeIcon from '../../images/ic_close.svg';
import HTModal from '../../components/HTModal/HTModal';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  closeModal: () => void,
};

class VerifyRemindModal extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage }, isOpen, closeModal } = this.props;

    return (
      <HTModal
        className={styles.verifyRemindModal}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <div className={styles.verifyRemindWrapper}>
          <section className={styles.modalHeader}>
            <button onClick={closeModal} className={styles.closeIconContainer}>
              <img
                alt={formatMessage({ id: 'image.modal.close' })}
                src={closeIcon}
                className={styles.closeIcon}
              />
            </button>
          </section>
          <section className={styles.content}>
            <div>{formatMessage({ id: 'verify.email.reminder' })}</div>
          </section>
        </div>
      </HTModal>
    );
  }
}

export default injectIntl(VerifyRemindModal);
