// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import styles from './EmailVerification.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import Advertisement from '../../containers/Advertisement';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import successIcon from '../../images/ic_verify_success.svg';
import { injectFooter } from '../../utils/utils';

type Props = {
  intl: IntlShape,
};

class EmailVerificationSuccess extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage } } = this.props;
    return (
      <div>
        <HTPageTitle translationKey="page.title.verfy_success" />
        <Navigation />
        <section
          className={classNames(styles.content, foundation['grid-container'])}
        >
          <img
            className={styles.icon}
            src={successIcon}
            alt={formatMessage({ id: 'image.icon.success' })}
          />

          <h1 className={styles.title}>
            <HTText
              translationKey={'account.email_verification.success.title'}
            />
          </h1>
          <div className={styles.notice}>
            <HTText
              translationKey={'account.email_verification.success.notice'}
            />
          </div>

          <div className={styles.buttonGroup}>
            <Link to="/all-offers">
              <HTButton
                buttonType={'green'}
                className={styles.button}
                text={formatMessage({
                  id: 'account.email_verification.view_offer',
                })}
              />
            </Link>
            <Link to="/">
              <HTButton
                buttonType={'black'}
                className={styles.button}
                text={formatMessage({
                  id: 'account.email_verification.go_to_main_page',
                })}
              />
            </Link>
          </div>
        </section>

        <Advertisement />
      </div>
    );
  }
}

export default injectFooter(injectIntl(EmailVerificationSuccess));
