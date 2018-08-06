// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import styles from './Account.scss';
import HTButton from '../HTButton/HTButton';
import HTText from '../HTText/HTText';
import HTModal from '../HTModal/HTModal';
import { userToUpdateUser } from '../../models/User';
import { toastrError, toastrSuccess } from '../../utils/toastr';
import { getCreditCard } from '../../utils/constants';

import type { IntlShape } from 'react-intl';
import type { Request } from '../../types/index';
import type { CreditCardInfo } from '../../models/CreditCardInfo';
import type { User, UpdateUser } from '../../models/User';

type Props = {
  intl: IntlShape,
  user: User,
  updateProfile: UpdateUser => void,
  updateProfileRequest: Request,
  openUpdateCardModal: () => void,
};

type State = {
  isRemoveCardModalOpen: boolean,
};

class MyCardView extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isRemoveCardModalOpen: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.updateProfileRequest.error;
    const nextError = nextProps.updateProfileRequest.error;
    const thisRequesting = this.props.updateProfileRequest.requesting;
    const nextRequesting = nextProps.updateProfileRequest.requesting;
    const { intl: { formatMessage } } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(
        formatMessage({ id: 'account.tab.my_card.remove_card.success' })
      );
    }
  }

  render() {
    const { user: { creditCardInfo } } = this.props;

    if (creditCardInfo) {
      return this.renderCard(creditCardInfo);
    }

    return this.renderNoCard();
  }

  renderNoCard = () => {
    const {
      intl: { formatMessage },
      updateProfileRequest: { requesting },
      openUpdateCardModal,
    } = this.props;

    return (
      <div className={styles.myCardWrapper}>
        <div className={styles.noCard}>
          {formatMessage({ id: 'account.tab.my_card.no_card' })}
        </div>
        <HTButton
          type={'button'}
          buttonType={'green'}
          text={formatMessage({ id: 'account.tab.my_card.add_card' })}
          className={styles.cardButton}
          onClick={openUpdateCardModal}
          isDisabled={requesting}
        />
      </div>
    );
  };

  renderCard = (creditCardInfo: CreditCardInfo) => {
    const {
      intl: { formatMessage },
      updateProfileRequest: { requesting },
      openUpdateCardModal,
    } = this.props;
    const {
      cardName,
      cardBrand,
      lastFour,
      expiryMonth,
      expiryYear,
    } = creditCardInfo;

    return (
      <div
        className={classNames(styles.myCardWrapper, {
          [styles.isDisabled]: requesting,
        })}
      >
        <div className={styles.myCardContainer}>
          <div key={lastFour} className={styles.creditCard}>
            <div className={styles.creditCardLogo}>
              <img
                src={getCreditCard(cardBrand.toLowerCase())}
                alt={cardBrand}
              />
            </div>
            <div className={styles.creditCardInfo}>
              <div className={styles.creditCardLastDigit}>{lastFour}</div>
              <div>{cardName}</div>
              <div>
                {expiryMonth}/{expiryYear}
              </div>
            </div>
          </div>
          <HTButton
            type={'button'}
            buttonType={'hollowGray'}
            text={formatMessage({ id: 'account.tab.my_card.remove_card' })}
            className={styles.cardButton}
            onClick={this.openRemoveCardModal}
            isDisabled={requesting}
          />
        </div>
        <div className={styles.hintAndButton}>
          <span className={styles.hint}>
            <HTText translationKey="credit_card_input.security.hint" />
          </span>
          <HTButton
            type={'button'}
            buttonType={'green'}
            text={formatMessage({ id: 'account.tab.my_card.update_card' })}
            className={styles.cardButton}
            onClick={openUpdateCardModal}
            isDisabled={requesting}
          />
        </div>
        {this.renderRemoveCardModal()}
      </div>
    );
  };

  openRemoveCardModal = () => {
    this.setState({ isRemoveCardModalOpen: true });
  };

  closeRemoveCardModal = () => {
    this.setState({ isRemoveCardModalOpen: false });
  };

  renderRemoveCardModal = () => {
    const { isRemoveCardModalOpen } = this.state;
    const { intl: { formatMessage } } = this.props;
    return (
      <HTModal
        isOpen={isRemoveCardModalOpen}
        className={styles.removeCardModal}
        onRequestClose={this.closeRemoveCardModal}
      >
        <div className={styles.removeCardModalContent}>
          <HTText translationKey="account.tab.my_card.remove_card.confirm" />
        </div>
        <HTButton
          className={styles.removeCardButton}
          contentClassName={styles.contentClassName}
          buttonType={'green'}
          onClick={this.removeCard}
          text={formatMessage({
            id: 'account.my_card.remove_card_modal.confirm_button',
          })}
        />
        <HTButton
          className={styles.removeCardButton}
          contentClassName={styles.contentClassName}
          buttonType={'transparent'}
          onClick={this.closeRemoveCardModal}
          text={formatMessage({
            id: 'account.my_card.remove_card_modal.cancel_button',
          })}
        />
      </HTModal>
    );
  };

  removeCard = () => {
    const { updateProfile, user } = this.props;
    updateProfile({
      ...userToUpdateUser(user),
      creditCardInfo: null,
    });
    this.closeRemoveCardModal();
  };
}

export default injectIntl(MyCardView);
