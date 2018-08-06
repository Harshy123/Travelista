// @flow

import React, { Fragment, PureComponent } from 'react';
import cn from 'classnames';
import { injectIntl } from 'react-intl';

import { mustBe } from '../../utils/utils';
import ExperienceDropdown from '../ExperienceDropdown/ExperienceDropdown';
import OfferListing from '../OfferListing/OfferListing';
import HTButton from '../HTButton/HTButton';
import HTText from '../HTText/HTText';
import HTLoadingIndicator from '../HTLoadingIndicator/HTLoadingIndicator';
import HTFooter from '../HTFooter/HTFooter';
import Advertisement from '../../containers/Advertisement';

import styles from './OffersView.scss';
import foundation from '../../styles/foundation.scss';
import dropdownUpIcon from '../../images/ic_dropdown_up.svg';
import dropdownDownIcon from '../../images/ic_dropdown_down.svg';

import type { IntlShape } from 'react-intl';
import type { OfferListItem } from '../../models/OfferListItem';
import type { Experience } from '../../models/Experience';
import type { PageInfo, Request } from '../../types';

type Props = {
  intl: IntlShape,
  filterExperienceId: ?string,
  experiences: ?(Experience[]),
  offers: OfferListItem[],
  fetchOffers: (number, number, ?string) => void,
  flushOffers: () => void,
  push: string => void,
  request: Request,
  pageInfo: PageInfo,
};

const INITIAL_NUM_OFFERS = 10;

export class OffersView extends PureComponent<Props> {
  componentWillMount() {
    const { filterExperienceId } = this.props;
    this.props.fetchOffers(0, INITIAL_NUM_OFFERS, filterExperienceId);
  }

  componentWillReceiveProps(nextProps: Props) {
    const thisExperienceId = this.props.filterExperienceId;
    const nextExperienceId = nextProps.filterExperienceId;
    const { flushOffers, fetchOffers } = this.props;
    if (thisExperienceId !== nextExperienceId) {
      flushOffers();
      fetchOffers(0, INITIAL_NUM_OFFERS, nextExperienceId);
    }
  }

  render() {
    const {
      intl: { formatMessage },
      experiences,
      filterExperienceId,
      offers,
      request,
    } = this.props;
    const experienceText = this.getExperienceText();
    const title = experienceText || formatMessage({ id: 'offer.title' });

    return (
      <Fragment>
        <div>
          <section className={styles.offerHeader}>
            <div
              className={cn(
                foundation['grid-container'],
                styles.offerHeaderWrapper
              )}
            >
              <h2
                className={cn(styles.title, foundation['hide-for-small-only'])}
              >
                {title}
              </h2>
              {experiences && (
                <ExperienceDropdown
                  experiences={experiences}
                  experienceId={filterExperienceId}
                  onExperienceChange={this.onExperienceChange}
                />
              )}
            </div>
          </section>
          {this.renderOffersView()}
          {this.renderAdvertisement()}
        </div>
        {request.requesting && offers.length === 0 ? '' : <HTFooter />}
      </Fragment>
    );
  }

  onClickLoadMore = () => {
    const { fetchOffers, filterExperienceId } = this.props;
    fetchOffers(INITIAL_NUM_OFFERS, 1000, filterExperienceId);
  };

  renderOffersView = () => {
    const { offers, request } = this.props;
    if (!request.requesting && offers.length === 0) {
      return this.renderEmpty();
    } else {
      return this.renderOffers();
    }
  };

  renderAdvertisement = () => {
    const { request } = this.props;
    if (!request.requesting) {
      return <Advertisement />;
    }
  };

  renderOffers = () => {
    const { offers, request, pageInfo, intl: { formatMessage } } = this.props;
    return (
      <section className={styles.offers}>
        <div>
          {offers.map((offer: OfferListItem, i: number) => {
            return <OfferListing offer={offer} key={'offer' + i} />;
          })}
        </div>
        <div>
          {request.requesting && (
            <div className={styles.loadingContainer}>
              <HTLoadingIndicator />
            </div>
          )}
          {!request.requesting &&
            pageInfo.hasNextPage && (
              <HTButton
                isDisabled={request.requesting}
                onClick={this.onClickLoadMore}
                className={styles.loadMoreButton}
                contentClassName={styles.loadMoreButtonContent}
                buttonType="green"
                text={formatMessage({ id: 'offer.listing.load_more' })}
              />
            )}
        </div>
      </section>
    );
  };

  onExperienceChange = (experience: ?Experience) => {
    const { push } = this.props;

    if (experience == null) {
      push('/all-offers');

      return;
    }

    push(`/all-offers/${experience.id}`);
  };

  getExperienceText = (): ?string => {
    const { filterExperienceId, experiences } = this.props;
    if (experiences != null && filterExperienceId != null) {
      const experience = experiences.find(
        (e: Experience) => e.id === filterExperienceId
      );
      if (experience != null) return experience.name;
      else return null;
    } else {
      return null;
    }
  };

  renderEmpty = () => {
    const experienceText = this.getExperienceText();
    return (
      <section className={styles.offers}>
        <div className={styles.emptyContainer}>
          <div className={foundation['grid-container']}>
            {experienceText ? (
              <HTText
                translationKey={'offer.empty_experience'}
                values={{ experience: mustBe(experienceText).toUpperCase() }}
              />
            ) : (
              <HTText translationKey={'offer.empty'} />
            )}
          </div>
        </div>
      </section>
    );
  };

  renderArrow = ({ isOpen }: { isOpen: boolean }) => {
    const { intl: { formatMessage } } = this.props;
    const icon = isOpen ? (
      <img
        alt={formatMessage({ id: 'image.dropdown.up' })}
        src={dropdownUpIcon}
        className={styles.dropdownIcon}
      />
    ) : (
      <img
        alt={formatMessage({ id: 'image.dropdown.down' })}
        src={dropdownDownIcon}
        className={styles.dropdownIcon}
      />
    );
    return <div className={styles.iconContainer}>{icon}</div>;
  };
}

export default injectIntl(OffersView);
