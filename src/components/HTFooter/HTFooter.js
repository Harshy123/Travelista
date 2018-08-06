// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import moment from 'moment';

import { signout } from '../../actions/auth';
import { openAuthModal } from '../../actions/app';

import HTText from '../HTText/HTText';

import styles from './HTFooter.scss';
import foundation from '../../styles/foundation.scss';

import logo from '../../images/ic_logo.svg';
import logoTAR from '../../images/logo_tar_white.svg';
import logoTIC from '../../images/logo_tic_white.svg';
import logoHATA from '../../images/logo_hata.svg';

import { SOCIAL_MEDIA_URL } from '../../utils/constants';

import type { IntlShape } from 'react-intl';
import type { User } from '../../models/User';
import type { RootState } from '../../states';

type Props = {
  intl: IntlShape,
  user: ?User,
  openAuthModal: ('signin' | 'signup') => void,
  signout: () => void,
};

class HTFooter extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage } } = this.props;
    return (
      <footer className={styles.footer}>
        <div
          className={classNames(
            foundation['grid-container'],
            styles.footerWrapper
          )}
        >
          <div
            className={classNames(foundation['grid-x'], styles.footerContent)}
          >
            <div
              className={classNames(
                foundation['cell'],
                foundation['medium-12'],
                styles.contentCell
              )}
            >
              <img
                src={logo}
                alt={formatMessage({ id: 'image.logo' })}
                className={styles.logo}
              />
            </div>
            <div
              className={classNames(
                foundation['cell'],
                foundation['medium-4'],
                foundation['small-12'],
                styles.contentCell
              )}
            >
              <div className={styles.title}>
                <HTText translationKey="footer.about_us.title" />
              </div>
              <ul>
                <li>
                  <Link to="/about" className={styles.link}>
                    <HTText translationKey="footer.about_us.about_us" />
                  </Link>
                </li>
                <li>
                  <Link to="/press" className={styles.link}>
                    <HTText translationKey="footer.about_us.press" />
                  </Link>
                </li>
                <li>
                  <Link to="/career" className={styles.link}>
                    <HTText translationKey="footer.about_us.career" />
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className={styles.link}>
                    <HTText translationKey="footer.about_us.hotel_partners" />
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hello@heytravelista.com"
                    className={styles.link}
                  >
                    <HTText translationKey="footer.contact_us.email_us" />
                  </a>
                </li>
                {this.renderLogout()}
              </ul>
            </div>
            <div
              className={classNames(
                foundation['cell'],
                foundation['medium-3'],
                foundation['small-12'],
                styles.contentCell
              )}
            >
              <div className={styles.title}>
                <HTText translationKey="footer.contact_us.title" />
              </div>
              <ul>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.ig}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconInstagram)}
                    >
                      Instagram
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.fb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconFacebook)}
                    >
                      Facebook
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.yt}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconYouTube)}
                    >
                      YouTube
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.pi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconPinterest)}
                    >
                      Pinterest
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.gp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconGoogle)}
                    >
                      Google Plus
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href={SOCIAL_MEDIA_URL.tw}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <span
                      className={classNames(styles.icon, styles.iconTwitter)}
                    >
                      Twitter
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div
              className={classNames(
                foundation['cell'],
                foundation['medium-5'],
                foundation['small-12'],
                styles.logoCell
              )}
            >
              <div className={classNames(styles.title, styles.centerTitle)}>
                <HTText translationKey="footer.logos.title" />
              </div>
              <div className={foundation['grid-x']}>
                <div className={styles.travelLogos}>
                  <div
                    className={classNames(
                      foundation['cell'],
                      foundation['medium-12'],
                      styles.logosWithMargin
                    )}
                  >
                    <div className={styles.upperTravelLogos}>
                      <img
                        src={logoHATA}
                        className={styles.logoHATA}
                        alt={formatMessage({ id: 'image.logo.hata' })}
                      />
                      <img
                        src={logoTIC}
                        className={styles.logoTIC}
                        alt={formatMessage({ id: 'image.logo.tic' })}
                      />
                    </div>
                  </div>
                  <div
                    className={classNames(
                      foundation['cell'],
                      foundation['medium-12']
                    )}
                  >
                    <img
                      src={logoTAR}
                      className={styles.logoTAR}
                      alt={formatMessage({ id: 'image.logo.tar' })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.privacy}>
            <div className={styles.links}>
              <Link to="/tnc" className={styles.link}>
                <HTText translationKey="footer.tnc" />
              </Link>
              <Link to="/privacy-policy" className={styles.link}>
                <HTText translationKey="footer.privacy_policy" />
              </Link>
            </div>
            <div className={styles.copyright}>
              <HTText
                translationKey="footer.copyright"
                values={{ year: moment().year() }}
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  renderLogout = () => {
    const { user, signout } = this.props;
    if (user) {
      return (
        <li>
          <a className={styles.link} onClick={signout}>
            <HTText translationKey="footer.logout" />
          </a>
        </li>
      );
    }
  };
}

function mapStateToProps({ auth: { user } }: RootState) {
  return { user };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { openAuthModal, signout };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  injectIntl(HTFooter)
);
