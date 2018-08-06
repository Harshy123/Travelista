// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';

import type { IntlShape } from 'react-intl';
import type { CreditCard } from '../../models/CreditCard';

import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HintDropDown from '../HTForm/HintDropDown';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import CreditCardInput from '../Payment/CreditCardInput';
import styles from './UpdateCardModal.scss';
import foundation from '../../styles/foundation.scss';

type Props = {
  intl: IntlShape,
  onCreditCardInputChange: (card: CreditCard) => void,
  onValidStateChange: boolean => void,
  showErrorMessage: boolean,
  closeModal: () => void,
  requesting: boolean,
  onSubmit: (SyntheticInputEvent<HTMLInputElement>) => void,
};

type State = {
  card: {
    cardNumber: string,
    cardName: string,
    expiryMonth: number,
    expiryYear: number,
    cvv: string,
  },
  errorReason: {
    cardNumber: ?string,
    cardName: ?string,
    expiryText: ?string,
    cvv: ?string,
  },
  expiryText: string,
};

const requiredErrorKey = 'credit_card_input.invalid.required';

class UpdateCardInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { intl: { formatMessage } } = props;

    const requiredError = formatMessage({
      id: requiredErrorKey,
    });

    this.state = {
      card: {
        cardNumber: '',
        cardName: '',
        expiryMonth: 0,
        expiryYear: 0,
        cvv: '',
      },
      errorReason: {
        cardNumber: requiredError,
        cardName: requiredError,
        expiryText: requiredError,
        cvv: requiredError,
      },
      expiryText: '',
    };
  }

  onCreditCardChange = (card: CreditCard) => {
    this.setState({
      card,
    });
    this.props.onCreditCardInputChange(card);
  };

  onCardExpiryDateChange = (month: number, year: number) => {
    this.setState((prevState: State) => ({
      card: {
        ...prevState.card,
        expiryMonth: month,
        expiryYear: year,
      },
    }));
    this.props.onCreditCardInputChange({
      ...this.state.card,
      expiryMonth: month,
      expiryYear: year,
    });
  };

  onErrorReasonsChange = (key: string, value: ?string) => {
    const newErrorReason = {
      ...this.state.errorReason,
      [key]: value,
    };
    this.setState((prevState: State) => ({
      errorReason: newErrorReason,
    }));
    let reducedValidState = true;
    Object.keys(newErrorReason).forEach((errorReasonKey: string) => {
      if (newErrorReason[errorReasonKey]) {
        reducedValidState = false;
        return;
      }
    });
    this.props.onValidStateChange(reducedValidState);
  };

  render() {
    const {
      intl: { formatMessage },
      showErrorMessage,
      closeModal,
      requesting,
      onSubmit,
    } = this.props;
    const { card, errorReason } = this.state;

    return (
      <div
        className={cn(
          foundation['medium-6'],
          foundation['small-12'],
          styles.creditCard
        )}
      >
        <form onSubmit={onSubmit}>
          <div className={foundation['grid-x']}>
            <CreditCardInput
              showErrorMessage={showErrorMessage}
              card={card}
              errorReason={errorReason}
              isDisabled={requesting}
              onCreditCardChange={this.onCreditCardChange}
              onErrorReasonsChange={this.onErrorReasonsChange}
            />
            <div
              className={cn(foundation['small-12'], styles.creditCardNotice)}
            >
              <HTText translationKey={'account.my_card.update_card.notice'} />
              <HintDropDown
                hint={formatMessage({ id: 'credit_card_input.security.hint' })}
                className={styles.creditCardHint}
              />
            </div>
            <div className={cn(foundation['small-12'], styles.actionButtons)}>
              <HTButton
                type="submit"
                buttonType="green"
                contentClassName={styles.updateButtonContent}
                isDisabled={requesting}
              >
                {requesting ? (
                  <HTLoadingIndicator width={20} height={20} />
                ) : (
                  <HTText translationKey="account.my_card.update_card.update" />
                )}
              </HTButton>
              <HTButton
                type="button"
                buttonType="hollowGray"
                className={styles.cancelButton}
                text={formatMessage({
                  id: 'account.my_card.update_card.cancel',
                })}
                isDisabled={requesting}
                onClick={closeModal}
              />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default injectIntl(UpdateCardInput);
