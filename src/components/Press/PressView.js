// @flow

import React, { Fragment, PureComponent } from 'react';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import HTText from '../HTText/HTText';
import HTButton from '../HTButton/HTButton';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTFooter from '../HTFooter/HTFooter';

import foundation from '../../styles/foundation.scss';
import styles from './PressView.scss';

import type { IntlShape } from 'react-intl';
import type { Request, PressesResponse } from '../../types';
import type { Press } from '../../models/Press';

type Props = {
  intl: IntlShape,
  presses: Press[],
  request: Request,
  fetchPresses: (number, number) => Promise<PressesResponse>,
};

type State = {
  hasNextPage: boolean,
  offset: number,
  limit: number,
};

class PressView extends PureComponent<Props, State> {
  constructor() {
    super();
    this.state = {
      hasNextPage: false,
      offset: 0,
      limit: 8,
    };
  }

  componentWillMount() {
    this.fetchPresses();
  }

  onClickLoadMore = () => {
    this.fetchPresses();
  };

  fetchPresses = () => {
    const { offset, limit } = this.state;
    this.props.fetchPresses(offset, limit).then((response: PressesResponse) => {
      const nextOffset = offset + limit;
      if (nextOffset < response.totalCount) {
        this.setState({
          hasNextPage: true,
          offset: nextOffset,
        });
      } else {
        this.setState({
          hasNextPage: false,
          offset: nextOffset,
        });
      }
    });
  };

  render() {
    const { request, presses } = this.props;
    return (
      <Fragment>
        <div>
          <section className={styles.pressHeader}>
            <div
              className={cn(
                foundation['grid-container'],
                styles.pressHeaderWrapper
              )}
            >
              <h2 className={cn(styles.title)}>
                <HTText translationKey={'press.title'} />
              </h2>
            </div>
          </section>
          <section
            className={cn(foundation['grid-container'], styles.pressContent)}
          >
            <div className={cn(foundation['grid-x'])}>
              <div
                className={cn(
                  foundation['cell'],
                  foundation['medium-3'],
                  foundation['hide-for-small-only'],
                  styles.subtitle
                )}
              >
                <HTText translationKey={'press.subtitle'} />
              </div>
              <div
                className={cn(
                  foundation['cell'],
                  foundation['medium-9'],
                  foundation['small-12']
                )}
              >
                {this.renderPressesView()}
              </div>
            </div>
          </section>
        </div>
        {request.requesting && presses.length === 0 ? '' : <HTFooter />}
      </Fragment>
    );
  }

  renderPressesView = () => {
    const { presses, request, intl: { formatMessage } } = this.props;
    const { hasNextPage } = this.state;
    if (!request.requesting && presses.length === 0) {
      return this.renderEmpty();
    } else {
      return (
        <section className={foundation['grid-container']}>
          {presses.map((p: Press) => {
            return this.renderPress(p);
          })}
          {hasNextPage && (
            <HTButton
              isDisabled={request.requesting}
              onClick={this.onClickLoadMore}
              className={styles.loadMoreButton}
              buttonType="hollowBlack"
              text={formatMessage({ id: 'press.load_more' })}
            />
          )}
          {request.requesting && (
            <div className={styles.loadingIndicator}>
              <HTLoadingIndicator />
            </div>
          )}
        </section>
      );
    }
  };

  renderEmpty = () => {
    return (
      <section className={foundation['grid-container']}>
        <div className={styles.empty}>
          <HTText translationKey={'press.empty'} />
        </div>
      </section>
    );
  };

  renderPress = (press: Press) => {
    const { id, title, file, publishedAt } = press;
    return (
      <div key={id} className={styles.press}>
        <div className={styles.pressTitle}>
          <a href={file} target="_blank">
            {title}
          </a>
        </div>
        <div className={styles.pressPublishedAt}>
          {publishedAt.format('MMM D, YYYY')}
        </div>
      </div>
    );
  };
}

export default injectIntl(PressView);
