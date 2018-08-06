// @flow

import React, { PureComponent, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';

import type { IntlShape } from 'react-intl';
import type { CreditCard } from '../../models/CreditCard';

import {
  stripValidateExpiry,
  stripeValidateCVV,
  stripeValidateCardNumber,
  stripeCheckCardType,
} from '../../utils/stripe';

import HTTextInput from '../HTForm/HTTextInput';
import HTImage from '../HTImage/HTImage';

import styles from '../OfferDetailView/PackageStep2.scss';
import foundation from '../../styles/foundation.scss';

import { getCreditCard } from '../../utils/constants';

type Props = {
  intl: IntlShape,
  showErrorMessage: boolean,
  card: CreditCard,
  errorReason: {
    cardNumber: ?string,
    cardName: ?string,
    expiryText: ?string,
    cvv: ?string,
  },
  isDisabled?: boolean,
  onCreditCardChange: CreditCard => void,
  onErrorReasonsChange: (string, ?string) => void,
};

type State = {
  expiryText: string,
  cardType: string,
};

const requiredErrorKey = 'credit_card_input.invalid.required';
const expiryTextInvalidKey = 'credit_card_input.invalid.expiry_text';

class CreditCardInput extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      expiryText: '',
      cardType: '',
    };
  }

  _isDigit(text: string) {
    return !isNaN(text);
  }

  _isMonth(text: string) {
    if (this._isDigit(text)) {
      const month = parseInt(text, 10);
      if (month >= 1 && month <= 12) {
        return true;
      }
    }
    return false;
  }

  _validateExpiryText(value: string) {
    const {
      card,
      onCreditCardChange,
      onErrorReasonsChange,
      intl: { formatMessage },
    } = this.props;
    const expiryTextInvalid = formatMessage({ id: expiryTextInvalidKey });
    const values = value.split('/');

    if (values.length < 2) {
      onErrorReasonsChange('expiryText', expiryTextInvalid);
      return;
    }

    const month = values[0];
    const year = values[1];

    if (!this._isMonth(month)) {
      onErrorReasonsChange('expiryText', expiryTextInvalid);
      return;
    }

    if (this._isDigit(year)) {
      if (year.length === 2) {
        const monthInt = parseInt(month, 10);
        const yearInt = parseInt(year, 10);
        const expiryDateValid = stripValidateExpiry(monthInt, yearInt);
        if (expiryDateValid) {
          onErrorReasonsChange('expiryText', null);
          onCreditCardChange({
            ...card,
            expiryMonth: monthInt,
            expiryYear: yearInt,
          });
        }
        return;
      }
      onErrorReasonsChange('expiryText', expiryTextInvalid);
      return;
    }

    onErrorReasonsChange('expiryText', null);
  }

  onExpiryTextChange = (value: string) => {
    const { onErrorReasonsChange, intl: { formatMessage } } = this.props;

    if (value.length === 0) {
      this.setState({ expiryText: value });
      onErrorReasonsChange(
        'expiryText',
        formatMessage({ id: requiredErrorKey })
      );
      return;
    }

    if (value.length === 1) {
      if (this._isDigit(value)) {
        this.setState({ expiryText: value });
        this._validateExpiryText(value);
        return;
      } else {
        return;
      }
    }

    if (value.length === 2) {
      if (this._isDigit(value)) {
        const originalText = this.state.expiryText;
        if (originalText.length > 2) {
          this.setState({ expiryText: value });
          this._validateExpiryText(value);
          return;
        } else {
          this.setState({ expiryText: `${value}/` });
          this._validateExpiryText(value);
          return;
        }
      } else {
        return;
      }
    }

    const values = value.split('/');
    const month = values[0];
    const year = values.length === 2 ? values[1] : null;

    if (values.length === 1) {
      this.setState({ expiryText: `${value.substr(0, 2)}/${value.substr(2)}` });
      this._validateExpiryText(value);
      return;
    }

    if (month.length > 2) {
      return;
    }

    if (year && year.length > 2) {
      return;
    }

    let shouldUpdateText = false;
    if (this._isDigit(month)) {
      if (year) {
        if (this._isDigit(year)) {
          shouldUpdateText = true;
        }
      } else {
        shouldUpdateText = true;
      }
    }

    if (shouldUpdateText) {
      this.setState({ expiryText: `${month}/${year || ''}` });
      this._validateExpiryText(value);
    }
  };

  onCardNumberChange = (value: string) => {
    this.setState({ cardType: stripeCheckCardType(value).toLowerCase() });
    const { onErrorReasonsChange, intl: { formatMessage } } = this.props;
    if (!this._isDigit(value)) {
      return;
    }
    this.onCardStringChange('cardNumber', value);
    if (!value.trim()) {
      onErrorReasonsChange(
        'cardNumber',
        formatMessage({ id: requiredErrorKey })
      );
      return;
    }
    if (!stripeValidateCardNumber(value)) {
      onErrorReasonsChange(
        'cardNumber',
        formatMessage({ id: 'credit_card_input.invalid.invalid_card_number' })
      );
      return;
    }
    onErrorReasonsChange('cardNumber', null);
  };

  onCardNameChange = (value: string) => {
    const { onErrorReasonsChange, intl: { formatMessage } } = this.props;
    this.onCardStringChange('cardName', value);
    if (!value.trim()) {
      onErrorReasonsChange('cardName', formatMessage({ id: requiredErrorKey }));
      return;
    }
    onErrorReasonsChange('cardName', null);
  };

  onCVVChange = (value: string) => {
    const { onErrorReasonsChange, intl: { formatMessage } } = this.props;
    if (!this._isDigit(value)) {
      return;
    }
    this.onCardStringChange('cvv', value);
    if (!value.trim()) {
      onErrorReasonsChange('cvv', formatMessage({ id: requiredErrorKey }));
      return;
    }
    if (!stripeValidateCVV(value)) {
      onErrorReasonsChange(
        'cvv',
        formatMessage({ id: 'credit_card_input.invalid.invalid_cvv' })
      );
      return;
    }
    onErrorReasonsChange('cvv', null);
  };

  onCardStringChange = (key: string, value: string) => {
    this.props.onCreditCardChange({
      ...this.props.card,
      [key]: value,
    });
  };

  render() {
    const {
      intl: { formatMessage },
      showErrorMessage,
      card: { cardNumber, cvv, cardName },
      errorReason,
      isDisabled,
    } = this.props;
    const { expiryText, cardType } = this.state;

    return (
      <Fragment>
        <div className={foundation['medium-2']}>
          <span className={styles.creditCardIconContainer}>
            <HTImage
              className={styles.creditCardIcon}
              src={getCreditCard(cardType)}
              alt={formatMessage({ id: 'image.icon.credit_card' })}
            />
          </span>
        </div>

        <div className={cn(foundation['medium-10'], styles.fullFormControl)}>
          <HTTextInput
            isError={showErrorMessage && errorReason.cardNumber !== null}
            errorMessage={showErrorMessage ? errorReason.cardNumber : null}
            placeholder={formatMessage({
              id: 'packages.step2.credit_card_number_placeholder',
            })}
            placeholderHint={
              cardNumber
                ? formatMessage({
                    id: 'packages.step2.credit_card_number_placeholder',
                  })
                : undefined
            }
            onChange={this.onCardNumberChange}
            value={cardNumber}
            isDisabled={isDisabled}
          />
        </div>

        <div className={cn(foundation['medium-12'], styles.fullFormControl)}>
          <HTTextInput
            isError={showErrorMessage && errorReason.cardName !== null}
            errorMessage={showErrorMessage ? errorReason.cardName : null}
            placeholder={formatMessage({
              id: 'packages.step2.credit_card_name',
            })}
            placeholderHint={
              cardName
                ? formatMessage({
                    id: 'packages.step2.credit_card_name',
                  })
                : undefined
            }
            onChange={this.onCardNameChange}
            value={cardName}
            isDisabled={isDisabled}
          />
        </div>
        <div className={foundation['medium-12']}>
          <div className={foundation['grid-x']}>
            <div className={cn(foundation['medium-6'], styles.formControl)}>
              <HTTextInput
                isError={showErrorMessage && errorReason.expiryText !== null}
                errorMessage={showErrorMessage ? errorReason.expiryText : null}
                placeholder={formatMessage({
                  id: 'packages.step2.expiry_date',
                })}
                placeholderHint={
                  expiryText
                    ? formatMessage({
                        id: 'packages.step2.expiry_date',
                      })
                    : undefined
                }
                onChange={this.onExpiryTextChange}
                value={expiryText}
                isDisabled={isDisabled}
              />
            </div>
            <div className={cn(foundation['medium-6'], styles.formControl)}>
              <HTTextInput
                isError={showErrorMessage && errorReason.cvv !== null}
                errorMessage={showErrorMessage ? errorReason.cvv : null}
                placeholder="CVV"
                placeholderHint={
                  cvv
                    ? 'CVV'
                    : formatMessage({
                        id: 'packages.step2.cvv_hint',
                      })
                }
                value={cvv}
                onChange={this.onCVVChange}
                isDisabled={isDisabled}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(CreditCardInput);
