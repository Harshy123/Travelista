// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import styles from './EmailVerification.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import FeaturedProperty from '../../containers/FeaturedProperty';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import failIcon from '../../images/ic_verify_fail.svg';
import { injectFooter } from '../../utils/utils';

type Props = {
  intl: IntlShape,
};

class EmailVerificationFail extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage } } = this.props;
    return (
      <div>
        <Navigation />

        <section
          className={classNames(styles.content, foundation['grid-container'])}
        >
          <img
            className={styles.icon}
            src={failIcon}
            alt={formatMessage({ id: 'image.icon.failed' })}
          />

          <h1 className={styles.title}>
            <HTText translationKey={'account.email_verification.fail.title'} />
          </h1>
          <div className={styles.notice}>
            <HTText translationKey={'account.email_verification.fail.notice'} />
          </div>

          <div className={styles.buttonGroup}>
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

        <FeaturedProperty />
      </div>
    );
  }
}

export default injectFooter(injectIntl(EmailVerificationFail));
