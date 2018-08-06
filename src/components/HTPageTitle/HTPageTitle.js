// @flow

import React, { PureComponent } from 'react';
import { Helmet } from 'react-helmet';
import { injectIntl } from 'react-intl';

import type { IntlShape } from 'react-intl';

type Props = {
  intl: IntlShape,
  translationKey?: string,
  values?: { [key: string]: * },
  descriptionKey?: string,
};
class HTPageTitle extends PureComponent<Props> {
  static defaultProps = {
    translationKey: 'page.title.default',
    descriptionKey: 'page.description.default',
  };

  render() {
    const {
      translationKey,
      values,
      descriptionKey,
      intl: { formatMessage },
    } = this.props;
    const title = formatMessage({ id: translationKey || '' }, values || {});
    const description = formatMessage({ id: descriptionKey || '' });
    return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Hey Travelista" />
        <meta name="author" content="Hey Travelista" />
      </Helmet>
    );
  }
}

export default injectIntl(HTPageTitle);
