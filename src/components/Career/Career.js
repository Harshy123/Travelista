// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import styles from './Career.scss';
import foundation from '../../styles/foundation.scss';
import Navigation from '../../containers/Navigation';
import HTPageTitle from '../HTPageTitle/HTPageTitle';
import HTText from '../HTText/HTText';
import { injectFooter } from '../../utils/utils';

type Props = {};

class Career extends PureComponent<Props> {
  render() {
    return (
      <div>
        <HTPageTitle
          translationKey="page.title.career"
          descriptionKey="page.description.career"
        />
        <Navigation />

        <section className={styles.careerHeader}>
          <div
            className={classNames(
              foundation['grid-container'],
              styles.careerHeaderWrapper
            )}
          >
            <h2 className={styles.title}>
              <HTText translationKey={'career.title'} />
            </h2>
          </div>
        </section>

        <article
          className={classNames(
            styles.careerArticle,
            foundation['grid-container']
          )}
        >
          <h3 className={styles.subtitle}>
            <HTText translationKey={'career.subtitle'} />
          </h3>

          <p>
            Hey Travelista is Asia’s newest and fastest growing traveltech
            start-up. We only work with the best hotels and the best membership
            base - so we are looking for the best talent that Hong Kong has to
            offer. For more details, email us at{' '}
            <a href="mailto:hr@heytravelista.com">hr@heytravelista.com</a>.
            <br />
            <br />
          </p>
        </article>
      </div>
    );
  }
}

export default injectFooter(Career);
