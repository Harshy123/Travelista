// @flow

import React, { PureComponent } from 'react';
import styles from './HTMLComponent.scss';

type Props = {
  html: string,
};

export default class HTMLComponent extends PureComponent<Props> {
  render() {
    return (
      <span
        className={styles.htmlComponent}
        dangerouslySetInnerHTML={{
          __html: this.props.html,
        }}
      />
    );
  }
}
