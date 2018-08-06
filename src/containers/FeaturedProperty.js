// @flow

import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import type { RootState } from '../states';
import type { AuthState } from '../states/auth';
import type { OfferState } from '../states/offer';
import type { AdvertisementState } from '../states/advertisement';
import { openAuthModal } from '../actions/app';
import { fetchFeaturedOffers } from '../actions/offer';
import { fetchAdvertisements } from '../actions/advertisement';
import HotelSlider from '../components/HotelSlider/HotelSlider';
import AdvertisementSlider from '../components/AdvertisementSlider/AdvertisementSlider';

type Props = {
  auth: AuthState,
  offer: OfferState,
  advertisement: AdvertisementState,
  actions: {
    openAuthModal: ('signin' | 'signup') => void,
    push: string => void,
    fetchFeaturedOffers: () => void,
    fetchAdvertisements: (number, number, 'landing' | 'footer') => void,
  },
  showTitle: boolean,
  className?: string,
  titleClassName?: string,
};

type LocalState = {
  whichSlider: string,
};

class FeaturedProperty extends PureComponent<Props, LocalState> {
  static defaultProps = {
    showTitle: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      whichSlider: Math.random() >= 0.5 ? 'advertisement' : 'hotel',
    };
  }

  componentWillMount() {
    if (this.state.whichSlider === 'advertisement') {
      this.props.actions.fetchAdvertisements(0, 5, 'landing');
    }
  }

  render() {
    switch (this.state.whichSlider) {
      case 'advertisement':
        return this.renderAdvertisementSlider();
      case 'hotel':
      default:
        return this.renderHotelSlider();
    }
  }

  renderAdvertisementSlider = () => {
    const {
      showTitle,
      advertisement: {
        landing: { advertisements, fetchAdvertisementsRequest },
      },
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
  };

  renderHotelSlider = () => {
    const {
      auth: { isLoggedIn },
      offer: { featuredOfferListItems, fetchFeaturedOffersRequest },
      actions: { push, openAuthModal, fetchFeaturedOffers },
      showTitle,
      className,
      titleClassName,
    } = this.props;
    return (
      <HotelSlider
        isLoggedIn={isLoggedIn}
        offers={featuredOfferListItems}
        request={fetchFeaturedOffersRequest}
        fetchOffers={fetchFeaturedOffers}
        push={push}
        openAuthModal={openAuthModal}
        showTitle={showTitle}
        className={className}
        titleClassName={titleClassName}
      />
    );
  };
}

function mapStateToProps({ auth, offer, advertisement }: RootState) {
  return {
    auth,
    offer,
    advertisement,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = {
    openAuthModal,
    push,
    fetchFeaturedOffers,
    fetchAdvertisements,
  };

  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturedProperty);
