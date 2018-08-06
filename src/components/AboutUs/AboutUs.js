// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './AboutUs.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HTText from '../HTText/HTText';
import { injectFooter } from '../../utils/utils';

type Props = {};

class AboutUs extends PureComponent<Props> {
  render() {
    return (
      <div>
        <HTPageTitle
          translationKey="page.title.about_us"
          descriptionKey="page.description.about_us"
        />
        <Navigation />

        <section className={styles.aboutUsHeader}>
          <div
            className={classNames(
              foundation['grid-container'],
              styles.aboutUsHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'about_us.title'} />
            </h2>
          </div>
        </section>

        <article
          className={classNames(
            styles.aboutUsArticle,
            foundation['grid-container']
          )}
        >
          Hey Travelista is a global travel platform designed to inspire people
          to travel. Each week, Hey Travelista will promote a selection of
          exceptional hotel and travel offers at exclusive members-only rates
          with compelling value inclusions. These offers last 2-4 weeks, with
          new offers being promoted every week, however our offers are available
          to book up to 12 months in advance.
          <br />
          <br />
          Our specialised team hand-selects and curates a portfolio of five star
          and unique properties located all around the world for you to
          experience and enjoy. Our deep understanding of the travel and
          hospitality industry, and our relationship with these properties
          allows us to negotiate outstanding offers and value inclusions so that
          our members can enjoy their well-deserved stress-free holidays. One
          other key point – the longer your stay, the more value added
          inclusions you will receive!!
          <br />
          <br />
          To be a Travelista (member) – simply sign up to Hey Travelista with
          your email address and let us do the hard work for you.
        </article>
      </div>
    );
  }
}

export default injectFooter(AboutUs);
