// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';
import cn from 'classnames';

import type { Request } from '../../types/index';
import type { CreditCard } from '../../models/CreditCard';
import styles from './UpdateCardModal.scss';
import HTModal from '../../components/HTModal/HTModal';
import UpdateCardInput from './UpdateCardInput';
import { toastrError, toastrSuccess } from '../../utils/toastr';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  closeModal: () => void,
  updateCard: CreditCard => void,
  updateCardRequest: Request,
};

type State = {
  card: CreditCard,
  isCardValid: boolean,
  showErrorMessage: boolean,
};

class UpdateCardModal extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      card: {
        cardNumber: '',
        cardName: '',
        expiryYear: 0,
        expiryMonth: 0,
        cvv: '',
      },
      isCardValid: false,
      showErrorMessage: false,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisError = this.props.updateCardRequest.error;
    const nextError = nextProps.updateCardRequest.error;
    const thisRequesting = this.props.updateCardRequest.requesting;
    const nextRequesting = nextProps.updateCardRequest.requesting;
    const { intl: { formatMessage }, closeModal } = this.props;
    if (thisError == null && nextError != null) {
      const error = nextError;
      toastrError(formatMessage({ id: error }));
    }
    if (thisRequesting && !nextRequesting && nextError == null) {
      toastrSuccess(
        formatMessage({ id: 'account.my_card.update_card.success' })
      );
      closeModal();
    }
  }

  onCreditCardInputChange = (card: CreditCard) => {
    this.setState({
      card,
    });
  };

  onCardValidStateChange = (value: boolean) => {
    this.setState((prevState: State) => ({
      ...prevState,
      isCardValid: value,
    }));
  };

  render() {
    const {
      intl: { formatMessage },
      isOpen,
      closeModal,
      updateCardRequest: { requesting },
    } = this.props;

    const { showErrorMessage } = this.state;

    return (
      <HTModal
        className={styles.updateCardModal}
        isOpen={isOpen}
        onRequestClose={closeModal}
      >
        <div className={styles.updateCardWrapper}>
          <section className={styles.modalHeader}>
            <h1 className={styles.modalTitle}>
              {formatMessage({ id: 'account.my_card.update_card.title' })}
            </h1>
          </section>
          <section
            className={cn(styles.content, {
              [styles.isDisabled]: requesting,
            })}
          >
            <UpdateCardInput
              onCreditCardInputChange={this.onCreditCardInputChange}
              onValidStateChange={this.onCardValidStateChange}
              showErrorMessage={showErrorMessage}
              closeModal={closeModal}
              requesting={requesting}
              onSubmit={this.onSubmit}
            />
          </section>
        </div>
      </HTModal>
    );
  }

  onSubmit = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { updateCard } = this.props;
    const { card, isCardValid } = this.state;

    if (!isCardValid) {
      this.setState({ showErrorMessage: true });
      return;
    }

    updateCard(card);
  };
}

export default injectIntl(UpdateCardModal);
