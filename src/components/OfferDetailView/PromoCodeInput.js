// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import cn from 'classnames';
import HTTextInput from '../HTForm/HTTextInput';
import HTText from '../HTText/HTText';
import HTImage from '../HTImage/HTImage';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import circleTickIcon from '../../images/ic_circle_tick.svg';
import circleCrossIcon from '../../images/ic_circle_cross.svg';
import type { IntlShape } from 'react-intl';
import styles from './PromoCodeInput.scss';
type Props = {
  intl: IntlShape,
  status: 'default' | 'loading' | 'success' | 'failure',
  message?: string,
  onChange: string => void,
  onBlur: string => void,
  value: string,
};

class PromoteCodeInput extends PureComponent<Props> {
  renderTrailingNode = () => {
    const { status, message, intl: { formatMessage } } = this.props;
    return (
      <div>
        {status === 'success' && (
          <div className={styles.trailingNode}>
            <HTImage
              src={circleTickIcon}
              alt={formatMessage({ id: 'image.icon.tick' })}
            />
            <span className={styles.trailingText}>{message}</span>
          </div>
        )}
        {status === 'failure' && (
          <div className={styles.trailingNode}>
            <HTImage
              src={circleCrossIcon}
              alt={formatMessage({ id: 'image.icon.cross' })}
            />
            <span className={styles.trailingText}>{message}</span>
          </div>
        )}
        {status === 'loading' && (
          <div className={styles.trailingNode}>
            <HTLoadingIndicator height={18} width={18} />
            <span className={styles.trailingText}>{message}</span>
          </div>
        )}
      </div>
    );
  };

  render() {
    const { status, onChange, onBlur, value } = this.props;
    const wrapperClassName =
      status === 'success' || status === 'loading'
        ? styles.validTextInput
        : status === 'failure' ? styles.invalidTextInput : '';
    return (
      <div>
        <div className={styles.label}>
          <HTText translationKey="promo_code.label" />
        </div>
        <HTTextInput
          wrapperClassName={cn(wrapperClassName, styles.promoCodeInput)}
          className={styles.textInput}
          trailingNode={this.renderTrailingNode()}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
      </div>
    );
  }
}

export default injectIntl(PromoteCodeInput);
