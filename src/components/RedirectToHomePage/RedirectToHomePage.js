// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';
import { Redirect } from 'react-router';

import { toastrError } from '../../utils/toastr';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
};

class RedirectToHomePage extends PureComponent<Props> {
  componentDidMount() {
    const { intl: { formatMessage } } = this.props;
    toastrError(formatMessage({ id: 'redirect_to_home_page.route_unmatched' }));
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default injectIntl(RedirectToHomePage);
