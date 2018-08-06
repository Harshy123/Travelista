// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';

import type { IntlShape } from 'react-intl';
import type { CreditCardInfo } from '../../models/CreditCardInfo';

import { getCreditCard } from '../../utils/constants';
import HTImage from '../HTImage/HTImage';
import HTText from '../HTText/HTText';
import styles from './PackageStep2.scss';
import foundation from '../../styles/foundation.scss';

type Props = {
  intl: IntlShape,
  cardInfo: CreditCardInfo,
};

class CreditCardPrefill extends PureComponent<Props> {
  render() {
    const {
      cardInfo: { cardName, cardBrand, lastFour, expiryMonth, expiryYear },
      intl: { formatMessage },
    } = this.props;

    return (
      <div className={cn(foundation['medium-6'], styles.creditCardInfo)}>
        <div className={foundation['grid-x']}>
          <div className={foundation['medium-2']}>
            <span className={styles.creditCardIconContainer}>
              <HTImage
                className={styles.creditCardIcon}
                src={getCreditCard(cardBrand.toLowerCase())}
                alt={formatMessage({ id: 'image.icon.credit_card' })}
              />
            </span>
          </div>
          <div className={foundation['medium-10']}>
            <div
              className={cn(foundation['medium-12'], styles.creditCardInfoRow)}
            >
              <span style={{ letterSpacing: '4px' }}>{'···· ···· ···· '}</span>
              {lastFour}
            </div>
            <div
              className={cn(foundation['medium-12'], styles.creditCardInfoRow)}
            >
              <HTText translationKey={cardName} />
            </div>
            <div
              className={cn(foundation['medium-12'], styles.creditCardInfoRow)}
            >
              <HTText translationKey={`${expiryMonth}/${expiryYear}`} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(CreditCardPrefill);
