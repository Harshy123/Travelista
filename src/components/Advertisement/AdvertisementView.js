// @flow

import React, { PureComponent } from 'react';
import type { AdvertisementState } from '../../states/advertisement';
import AdvertisementSlider from '../AdvertisementSlider/AdvertisementSlider';

type Props = {
  advertisement: AdvertisementState,
  fetchAdvertisements: (number, number, 'landing' | 'footer') => void,
  showTitle: boolean,
  className?: string,
  titleClassName?: string,
};

type State = {
  whichSlider: string,
};

class AdvertisementView extends PureComponent<Props, State> {
  componentWillMount() {
    this.props.fetchAdvertisements(0, 5, 'footer');
  }

  render() {
    const {
      showTitle,
      advertisement: { footer: { advertisements, fetchAdvertisementsRequest } },
      className,
      titleClassName,
    } = this.props;
    return (
      <AdvertisementSlider
        advertisements={advertisements}
        request={fetchAdvertisementsRequest}
        showTitle={showTitle}
        className={className}
        titleClassName={titleClassName}
      />
    );
  }
}

export default AdvertisementView;
