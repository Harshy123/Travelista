// @flow
import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchSimilarOffers } from '../actions/offer';
import OfferCollection from '../components/OfferCollection/OfferCollection';
import HTText from '../components/HTText/HTText';
import type { RootState } from '../states';
import type { OfferState } from '../states/offer';

type Props = {
  offerId: string,
  className?: string,
  titleClassName?: string,
  state: {
    offer: OfferState,
  },
  actions: {
    fetchSimilarOffers: string => void,
  },
};
class SimilarOfferCollectionContainer extends PureComponent<Props> {
  componentWillMount() {
    const { offerId, actions } = this.props;
    actions.fetchSimilarOffers(offerId);
  }

  render() {
    const { similarOfferListItems } = this.props.state.offer;
    const { className, titleClassName } = this.props;
    if (similarOfferListItems.length === 0) {
      return null;
    }
    return (
      <section className={className}>
        <div className={titleClassName}>
          <HTText translationKey={'offer.detail.similar_offers'} />
        </div>
        <OfferCollection offers={similarOfferListItems} />;
      </section>
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
  const actions = { fetchSimilarOffers };
  const actionMap = {
    actions: bindActionCreators(actions, dispatch),
  };
  return actionMap;
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SimilarOfferCollectionContainer
);
