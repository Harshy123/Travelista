// @flow
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import DropdownMenu from 'react-dd-menu';

import HTText from '../HTText/HTText';
import { CURRENCY_OPTIONS } from '../../utils/options';
import { mustBe } from '../../utils/utils';

import type { IntlShape } from 'react-intl';

import styles from './CurrencyDropDown.scss';
import dropDownIcon from '../../images/ic_dropdown_white.svg';

type Props = {
  intl: IntlShape,
  currency: string,
  changeCurrency: (currency: string) => void,
};
type State = {
  isMenuOpen: boolean,
};
class CurrencyDropDown extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
  }

  toggle = () => {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  };

  close = () => {
    this.setState({ isMenuOpen: false });
  };

  changeCurrency = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLElement) {
      const currencyLabel = mustBe(target.innerText);
      const currencyValue = CURRENCY_OPTIONS.filter(
        (option: { value: string, label: string }) =>
          option.label === currencyLabel
      )[0].value;
      this.props.changeCurrency(currencyValue);
    }
  };

  renderToggle() {
    const { currency, intl: { formatMessage } } = this.props;
    return (
      <button className={styles.toggle} onClick={this.toggle}>
        <span className={styles.currencyLabel}>
          <HTText translationKey="currency_dropdown.currency" />
        </span>
        <div className={styles.currencyWrapper}>
          <span>{currency}</span>
          <img
            alt={formatMessage({ id: 'image.dropdown.down' })}
            src={dropDownIcon}
            className={styles.dropDownIcon}
          />
        </div>
      </button>
    );
  }

  render() {
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      toggle: this.renderToggle(),
      align: 'right',
    };
    return (
      <DropdownMenu {...menuOptions}>
        {CURRENCY_OPTIONS.map(
          (currencyOption: { value: string, label: string }) => {
            return (
              <li
                className={styles.optionCell}
                onClick={this.changeCurrency}
                key={currencyOption.value}
                style={{ fontSize: '18rem' }}
              >
                {currencyOption.label}
              </li>
            );
          }
        )}
      </DropdownMenu>
    );
  }
}

export default injectIntl(CurrencyDropDown);
