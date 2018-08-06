// @flow

import * as React from 'react';
import { FormattedMessage } from 'react-intl';

type Props = {|
  translationKey?: string,
  values?: { [key: string]: * },
|};

export default class HTText extends React.PureComponent<Props> {
  render() {
    const { translationKey, values } = this.props;

    if (!translationKey) {
      return 'UNDEFINED';
    }

    return (
      <FormattedMessage
        id={translationKey}
        values={values}
        defaultMessage={translationKey || 'UNDEFINED'}
      />
    );
  }
}
