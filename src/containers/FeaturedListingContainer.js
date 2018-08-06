// @flow
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchFeaturedOffers } from '../actions/offer';
import type { RootState } from '../states';
import type { OfferState } from '../states/offer';
import type { OfferListItem } from '../models/OfferListItem';
import OfferListing from '../components/OfferListing/OfferListing';

type Props = {
  state: {
    offer: OfferState,
  },
  actions: {
    fetchFeaturedOffers: () => void,
  },
};
class FeaturedListingContainer extends PureComponent<Props> {
  componentWillMount() {
    this.props.actions.fetchFeaturedOffers();
  }

  render() {
    const offers = this.props.state.offer.featuredOfferListItems;
    return (
      <div>
        {offers.map((offer: OfferListItem, i: number) => {
          return <OfferListing offer={offer} key={'offer' + i} />;
        })}
      </div>
    );
  }
}

function mapStateToProps({ offer }: RootState) {
  return {
    state: {
      offer,
    },
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  const actions = { fetchFeaturedOffers };
  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  FeaturedListingContainer
);
