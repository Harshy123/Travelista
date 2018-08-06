// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import HTImage from '../../components/HTImage/HTImage';

import styles from './HTPreloadIndicator.scss';
import icon from '../../images/ic_icon.svg';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
};

class HTPreloadIndicator extends PureComponent<Props> {
  render() {
    const { intl: { formatMessage } } = this.props;

    return (
      <div className={styles.preload}>
        <HTImage
          src={icon}
          alt={formatMessage({ id: 'image.icon.loading' })}
          className={styles.preloadIcon}
        />
      </div>
    );
  }
}

export default injectIntl(HTPreloadIndicator);
