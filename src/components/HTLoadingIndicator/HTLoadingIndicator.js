// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import HTImage from '../HTImage/HTImage';

import styles from './HTLoadingIndicator.scss';
import loadingIcon from '../../images/ic_loading.png';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  width: number,
  height: number,
};

class HTLoadingIndicator extends PureComponent<Props> {
  static defaultProps = {
    width: 35,
    height: 35,
  };

  render() {
    const { intl: { formatMessage } } = this.props;
    return (
      <HTImage
        className={styles.loading}
        src={loadingIcon}
        alt={formatMessage({ id: 'image.icon.loading' })}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }
}
export default injectIntl(HTLoadingIndicator);
