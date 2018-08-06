// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { slide as Menu } from 'react-burger-menu';
import { injectIntl } from 'react-intl';

import HTText from '../HTText/HTText';
import UserInfoBar from '../HTHeader/UserInfoBar';
import { CURRENCY_OPTIONS } from '../../utils/options';

import type { IntlShape } from 'react-intl';
import type { User } from '../../models/User';
import type { Config } from '../../states/app';

import crossIcon from '../../images/ic_cross.svg';
import styles from './SideMenu.scss';

type Props = {
  intl: IntlShape,
  isOpen: boolean,
  onStateChange: (isOpen: boolean) => void,
  openAuthModal: ('signin' | 'signup') => void,
  changeCurrency: (currency: string) => void,
  user: ?User,
  appConfig: Config,
  push: string => void,
};

type NextState = {
  isOpen: boolean,
};

class SideMenu extends PureComponent<Props> {
  changeCurrency = (e: Event) => {
    const { target } = e;
    if (target instanceof HTMLSelectElement) {
      this.props.changeCurrency(target.value);
    }
  };

  render() {
    const {
      onStateChange,
      appConfig,
      intl: { formatMessage },
      ...remainingProps
    } = this.props;

    return (
      <div>
        <Menu
          className={styles.sideMenu}
          itemListClassName={styles.sideMenuItemList}
          overlayClassName={styles.sideMenuOverlay}
          customBurgerIcon={false}
          onStateChange={({ isOpen }: NextState) => onStateChange(isOpen)}
          {...remainingProps}
        >
          <div>
            <div className={styles.closeSideMenu}>
              <a
                className={styles.closeSideMenuLink}
                onClick={this.closeSideMenu}
              >
                <img
                  alt={formatMessage({ id: 'image.modal.close' })}
                  src={crossIcon}
                />
              </a>
            </div>

            <div className={styles.segment}>{this.renderUserInfo()}</div>
          </div>

          <div>
            <hr className={styles.separator} />

            <div className={styles.segment}>
              <a className={styles.link} onClick={this.linkOrLogin('/account')}>
                <HTText translationKey="side_bar.my_account" />
              </a>

              <a className={styles.link} onClick={this.linkOrLogin('/trips')}>
                <HTText translationKey="side_bar.my_trips" />
              </a>

              <div className={styles.currencyMenuWrapper}>
                <label className={styles.currencyMenuLabel}>
                  <HTText translationKey="currency_dropdown.currency" />
                </label>
                <select
                  id="currencyMenu"
                  className={styles.currencyMenu}
                  value={appConfig.currency}
                  onChange={this.changeCurrency}
                >
                  {CURRENCY_OPTIONS.map(
                    (currencyOption: { value: string, label: string }) => {
                      return (
                        <option
                          value={currencyOption.value}
                          key={currencyOption.value}
                        >
                          {currencyOption.label}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
            </div>
          </div>
        </Menu>
      </div>
    );
  }

  renderUserInfo = () => {
    const { user } = this.props;
    if (user) {
      return (
        <div className={styles.userWrapper}>
          <UserInfoBar
            large
            profilePicture={user.profilePicture}
            name={user.firstName}
          />
        </div>
      );
    }

    return (
      <div>
        <div className={styles.greeting}>
          <HTText
            translationKey="header.user_info.greeting"
            values={{ name: 'Guest' }}
          />
        </div>
        <a
          className={classNames(styles.link, styles.highlightLink)}
          onClick={this.promptRegister}
        >
          <HTText translationKey="side_bar.join_now" />
        </a>

        <a
          className={classNames(styles.link, styles.smallLink)}
          onClick={this.promptLogin}
        >
          <HTText translationKey="side_bar.login_now" />
        </a>
      </div>
    );
  };

  linkOrLogin = (path: string) => () => {
    const { user, push } = this.props;
    if (!user) {
      this.promptLogin();
      return;
    }
    push(path);
  };

  closeSideMenu = () => {
    this.props.onStateChange(false);
  };

  promptLogin = () => {
    this.closeSideMenu();
    this.props.openAuthModal('signin');
  };

  promptRegister = () => {
    this.closeSideMenu();
    this.props.openAuthModal('signup');
  };
}

export default injectIntl(SideMenu);
