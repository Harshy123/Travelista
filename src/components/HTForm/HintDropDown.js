// @flow
import React, { PureComponent } from 'react';
import DropdownMenu from 'react-dd-menu';
import { injectIntl } from 'react-intl';

import hintIcon from '../../images/ic_hint_green.svg';
import styles from './HTForm.scss';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  className?: string,
  hint: ?string,
  description?: string,
  align: 'center' | 'right' | 'left',
};
type State = {
  isMenuOpen: boolean,
};

class HintDropDown extends PureComponent<Props, State> {
  static defaultProps = {
    align: 'center',
  };

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

  renderToggle() {
    const { description, intl: { formatMessage } } = this.props;
    return (
      <span className={styles.hint} onClick={this.toggle}>
        <img
          alt={formatMessage({ id: 'image.icon.hint' })}
          src={hintIcon}
          className={styles.hintIcon}
        />
        <span className={styles.description}>{description}</span>
      </span>
    );
  }

  render() {
    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      className: this.props.className,
      close: this.close,
      toggle: this.renderToggle(),
      align: this.props.align,
    };
    return (
      <DropdownMenu {...menuOptions}>
        <li className={styles.hintTextWrapper}>
          <p className={styles.hintText}>{this.props.hint}</p>
        </li>
      </DropdownMenu>
    );
  }
}

export default injectIntl(HintDropDown);
