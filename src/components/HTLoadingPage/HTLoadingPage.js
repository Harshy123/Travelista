// @flow

import React, { PureComponent } from 'react';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';

export default class LoadingPage extends PureComponent<{}> {
  render() {
    return (
      <div style={{ display: 'table', margin: '25% auto' }}>
        <HTLoadingIndicator />
      </div>
    );
  }
}
