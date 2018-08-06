// @flow
import React, { PureComponent } from 'react';
import GoogleMapReact from 'google-map-react';
import { injectIntl } from 'react-intl';

import HTImage from '../HTImage/HTImage';

import styles from './OfferDetailMap.scss';
import foundation from '../../styles/foundation.scss';
import markerIcon from '../../images/ic_marker.svg';

import type { IntlShape } from 'react-intl';
import type { Location } from '../../models/Location';

type Props = {
  intl: IntlShape,
  location: Location,
  address: string,
};

class OfferDetailMap extends PureComponent<Props> {
  render() {
    const { location, address, intl: { formatMessage } } = this.props;
    return (
      <div>
        <div className={styles.map}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: `${process.env['HT_GOOGLE_MAP_API'] || ''}`,
            }}
            center={location}
            options={{ scrollwheel: false }}
            resetBoundsOnResize
            defaultZoom={13}
          >
            <Marker lat={location.lat} lng={location.lng} />
          </GoogleMapReact>
        </div>
        <div className={styles.mapAddress}>
          <div className={foundation['grid-container']}>
            <HTImage
              className={styles.markerIcon}
              src={markerIcon}
              alt={formatMessage({ id: 'image.icon.marker' })}
              objectFit={'fill'}
              width={15}
              height={15}
            />
            {address}
          </div>
        </div>
      </div>
    );
  }
}

class Marker extends PureComponent<{}> {
  render() {
    return <div className={styles.mapMarker} />;
  }
}

export default injectIntl(OfferDetailMap);
