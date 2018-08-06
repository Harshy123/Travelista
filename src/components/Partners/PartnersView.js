// @flow

import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

import foundation from '../../styles/foundation.scss';
import styles from './PartnersView.scss';

import HTText from '../HTText/HTText';
import HTLink from '../../containers/HTLink';
import Advertisement from '../../containers/Advertisement';

import type { IntlShape } from 'react-intl';
import type { HotelGroupState } from '../../states/hotelGroup';
import type { AppState } from '../../states/app';
import type { HotelGroup } from '../../models/HotelGroup';

type Props = {
  intl: IntlShape,
  app: AppState,
  hotelGroup: HotelGroupState,
  fetchHotelGroups: void => void,
};
class PartnersView extends PureComponent<Props> {
  componentWillMount() {
    const { fetchHotelGroups } = this.props;
    fetchHotelGroups();
  }

  render() {
    return (
      <div>
        {this.renderPartnerHotels()}
        {this.renderPartners()}
        <Advertisement />
      </div>
    );
  }

  renderPartnerHotels = () => {
    const hotelGroups = this.props.hotelGroup.hotelGroups || [];
    return (
      <section className={styles.section}>
        <div className={foundation['grid-container']}>
          <div className={styles.sectionTitle}>
            {' '}
            <HTText translationKey="partners.travelista_partner_hotels.title" />
          </div>
          <div className={styles.hotelGroupImages}>
            {hotelGroups.map((hotelGroup: HotelGroup, i: number) => {
              const { slug, name, image } = hotelGroup;
              return (
                <HTLink to={`/partners/hotel/${slug}`} key={'hotelGroup' + i}>
                  <img alt={name} src={image} />
                </HTLink>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  renderPartners = () => {
    const { app: { serverState }, intl: { formatMessage } } = this.props;
    const partnersImage = serverState.partnersImage;
    return (
      <section className={styles.section}>
        <div className={foundation['grid-container']}>
          <div className={styles.sectionTitle}>
            <HTText translationKey="partners.travelista_partners.title" />
          </div>
          <img
            alt={formatMessage({ id: 'partners.travelista_partners.title' })}
            src={partnersImage}
            className={styles.image}
          />
        </div>
      </section>
    );
  };
}
export default injectIntl(PartnersView);
