// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';

import type { IntlShape } from 'react-intl';
import type { PaymentInfo } from '../../models/PaymentInfo';
import type { CreditCard } from '../../models/CreditCard';

import HTText from '../HTText/HTText';
import HintDropDown from '../HTForm/HintDropDown';
import HTCheckBox from '../HTForm/HTCheckBox';
import CreditCardInput from '../Payment/CreditCardInput';

import styles from '../OfferDetailView/PackageStep2.scss';
import foundation from '../../styles/foundation.scss';

type Props = {
  intl: IntlShape,
  onPaymentInfoChange: (paymentInfo: PaymentInfo) => void,
  onValidStateChange: boolean => void,
  showErrorMessage: boolean,
};

type State = {
  paymentInfo: {
    card: {
      cardNumber: string,
      cardName: string,
      expiryMonth: number,
      expiryYear: number,
      cvv: string,
    },
    saveCard: boolean,
  },
  errorReason: {
    cardNumber: ?string,
    cardName: ?string,
    expiryText: ?string,
    cvv: ?string,
  },
};

const requiredErrorKey = 'credit_card_input.invalid.required';

class PaymentInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { intl: { formatMessage } } = props;

    const requiredError = formatMessage({
      id: requiredErrorKey,
    });

    this.state = {
      paymentInfo: {
        card: {
          cardNumber: '',
          cardName: '',
          expiryMonth: 0,
          expiryYear: 0,
          cvv: '',
        },
        saveCard: false,
      },
      errorReason: {
        cardNumber: requiredError,
        cardName: requiredError,
        expiryText: requiredError,
        cvv: requiredError,
      },
    };
  }

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

  onSaveCardChange = (checked: boolean) => {
    this.setState((prevState: State) => ({
      paymentInfo: {
        ...prevState.paymentInfo,
        saveCard: checked,
      },
    }));
    this.props.onPaymentInfoChange({
      ...this.state.paymentInfo,
      saveCard: checked,
    });
  };

  onCreditCardChange = (card: CreditCard) => {
    this.setState((prevState: State) => ({
      paymentInfo: {
        ...prevState.paymentInfo,
        card,
      },
    }));
    this.props.onPaymentInfoChange({
      ...this.state.paymentInfo,
      card,
    });
  };

  render() {
    const { intl: { formatMessage }, showErrorMessage } = this.props;
    const { paymentInfo: { card, saveCard }, errorReason } = this.state;

    return (
      <div className={cn(foundation['medium-6'], styles.creditCard)}>
        <div className={foundation['grid-x']}>
          <CreditCardInput
            showErrorMessage={showErrorMessage}
            card={card}
            errorReason={errorReason}
            onCreditCardChange={this.onCreditCardChange}
            onErrorReasonsChange={this.onErrorReasonsChange}
          />
          <div className={styles.creditCardCheckbox}>
            <label className={styles.checkboxLabel}>
              <HTCheckBox
                id="save_card"
                label="Save card details for next travel"
                value={saveCard}
                onChange={this.onSaveCardChange}
              />
              <span className={styles.checkboxText}>
                <HTText translationKey={'packages.step2.save_card_details'} />
              </span>
            </label>
            <HintDropDown
              hint={formatMessage({ id: 'credit_card_input.hint' })}
              className={styles.creditCardHint}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(PaymentInput);
