// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import styles from './PackageDescriptionModal.scss';
import closeIcon from '../../images/ic_close_thin.svg';
import HTModal from '../HTModal/HTModal';
import HTButton from '../HTButton/HTButton';
import HTText from '../HTText/HTText';
import HTMLComponent from '../HTMLComponent/HTMLComponent';

import type { IntlShape } from 'react-intl';
import type { RoomType } from '../../models/RoomType';
import type { Offer } from '../../models/Offer';
import type { Package } from '../../models/Package';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  closeModal: () => void,
  offer: ?Offer,
  roomType: ?RoomType,
  package: ?Package,
};

class PackageDescriptionModal extends PureComponent<Props> {
  render() {
    const {
      isOpen,
      closeModal,
      offer,
      roomType,
      package: p,
      intl: { formatMessage },
    } = this.props;

    if (!offer || !roomType || !p) {
      return null;
    }

    return (
      <HTModal
        className={styles.modal}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <div className={styles.modalWrapper}>
          <section className={styles.modalHeader}>
            <span className={styles.title}>
              <HTText translationKey="offer.detail.description.modal.title" />
            </span>
            <button onClick={closeModal} className={styles.closeIconContainer}>
              <img
                alt={formatMessage({ id: 'image.modal.close' })}
                src={closeIcon}
                className={styles.closeIcon}
              />
            </button>
          </section>
          <section className={styles.content}>
            <HTMLComponent html={p.description} />
          </section>
          <div className={styles.buttonWrapper}>
            <Link
              to={`/hotel/${offer.hotel.slug}/offer/${
                offer.id
              }/booking/1?roomTypeId=${roomType.id}&packageId=${p.id}`}
            >
              <HTButton
                className={styles.button}
                contentClassName={styles.buttonContent}
                buttonType="green"
                text={formatMessage({
                  id: 'offer.detail.description.modal.continue',
                })}
                onClick={closeModal}
              />
            </Link>
          </div>
        </div>
      </HTModal>
    );
  }
}

export default injectIntl(PackageDescriptionModal);
