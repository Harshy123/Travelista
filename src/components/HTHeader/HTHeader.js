// @flow
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';

import foundation from '../../styles/foundation.scss';
import styles from './HTHeader.scss';

import logo from '../../images/ic_logo.svg';
import sideMenuIcon from '../../images/ic_side_menu.svg';

import HTText from '../HTText/HTText';
import UserInfoBar from './UserInfoBar.js';
import CurrencyDropDown from './CurrencyDropDown.js';
import { mustBe } from '../../utils/utils';

import type { IntlShape } from 'react-intl';
import type { User } from '../../models/User';
import type { Config } from '../../states/app';

type Props = {
  intl: IntlShape,
  transparent: boolean,
  renderLeft: boolean,
  renderRight: boolean,
  hideAuthLinks: boolean,
  user: ?User,
  appConfig: Config,
  setSideMenuState: (isOpen: boolean) => void,
  openAuthModal: ('signin' | 'signup') => void,
  changeCurrency: (currency: string) => void,
};

class HTHeader extends PureComponent<Props> {
  render() {
    const { transparent, intl: { formatMessage } } = this.props;

    return (
      <nav
        className={classNames(styles.navWrapper, {
          [styles.transparentNav]: transparent,
        })}
      >
        <div className={styles.nav}>
          <div
            className={classNames(
              styles.navBarContainer,
              foundation['grid-container']
            )}
          >
            <div
              className={classNames(styles.navBarGrid, foundation['grid-x'])}
            >
              <div
                className={classNames(
                  foundation['small-1'],
                  foundation['show-for-small-only'],
                  styles.sideMenuIconWrapper
                )}
              >
                <button
                  className={styles.link}
                  onClick={this.handleOpenMenuClick}
                >
                  <img
                    alt={formatMessage({ id: 'image.icon.hamburger' })}
                    src={sideMenuIcon}
                    className={styles.sideMenuIcon}
                  />
                </button>
              </div>

              <div
                className={classNames(
                  foundation['medium-3'],
                  foundation['hide-for-small-only'],
                  styles.left
                )}
              >
                {this.renderLeft()}
              </div>

              <div
                className={classNames(
                  styles.center,
                  foundation['medium-6'],
                  foundation['small-11']
                )}
              >
                <a href="/">
                  <img
                    alt={formatMessage({ id: 'image.logo' })}
                    src={logo}
                    className={styles.logo}
                  />
                </a>
              </div>

              <div
                className={classNames(
                  foundation['medium-3'],
                  foundation['hide-for-small-only'],
                  styles.right
                )}
              >
                {this.renderRight()}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  handleOpenMenuClick = () => {
    const { setSideMenuState } = this.props;
    setSideMenuState(true);
  };

  handleSignupClick = () => {
    this.props.openAuthModal('signup');
  };

  handleLoginClick = () => {
    this.props.openAuthModal('signin');
  };

  renderLeft = () => {
    const { renderLeft, user, hideAuthLinks } = this.props;

    if (renderLeft) {
      // If the user has not signed in
      if (!user && !hideAuthLinks) {
        return (
          <div className={styles.newUserGuideLinks}>
            <a className={styles.link} onClick={this.handleLoginClick}>
              <HTText translationKey="header.user_info.login" />
            </a>
            /
            <a className={styles.link} onClick={this.handleSignupClick}>
              <HTText translationKey="header.user_info.join_now" />
            </a>
          </div>
        );
      }

      if (user) {
        // If the user has signed in
        return (
          <UserInfoBar
            profilePicture={mustBe(user).profilePicture}
            name={mustBe(user).firstName}
          />
        );
      }
    }
  };

  renderRight = () => {
    const { appConfig, changeCurrency } = this.props;
    if (this.props.renderRight) {
      return (
        <CurrencyDropDown
          currency={appConfig.currency}
          changeCurrency={changeCurrency}
        />
      );
    }
  };
}

export default injectIntl(HTHeader);
