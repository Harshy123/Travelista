// @flow

import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import type { IntlShape } from 'react-intl';

import styles from './ForgotPassword.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import FeaturedProperty from '../../containers/FeaturedProperty';
import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import failIcon from '../../images/ic_verify_fail.svg';

type Props = {
  intl: IntlShape,
};

class URLInvalidView extends PureComponent<Props> {
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
            <HTText translationKey={'auth.reset_password.link_incorrect'} />
          </h1>
          <div className={styles.notice}>
            <HTText
              translationKey={'auth.reset_password.link_incorrect.notice'}
            />
          </div>

          <div className={styles.invalidButton}>
            <Link to="/forgot-password">
              <HTButton
                buttonType={'black'}
                className={styles.button}
                text={formatMessage({
                  id: 'auth.forgot_password',
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

export default injectIntl(URLInvalidView);
